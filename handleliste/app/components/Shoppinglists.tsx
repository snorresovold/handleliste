import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { auth, db } from "FirebaseConfig";
import React, { useEffect, useState } from "react";
import type { Item } from "~/Interfaces";
import { useAuth } from "~/hooks/useAuth";

interface Props {
  id: string;
  title: string;
  onDelete: (id: string) => void;
}

function Shoppinglists({ id, title, onDelete }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const { user } = useAuth();

  async function getItems() {
    const querySnapshot = await getDocs(
      collection(db, "shoppinglists", id, "items")
    );
    const newItems = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      checked: doc.data().checked,
      name: doc.data().name,
      creator: doc.data().creator,
      created_at: doc.data().created_at,
    }));
    setItems(newItems);
  }

  useEffect(() => {
    getItems();
  }, []);

  async function handleDeleteList(id: string) {
    onDelete(id);
    await deleteDoc(doc(db, "shoppinglists", id));
  }

  async function handleAddItem() {
    if (!newItemName.trim()) return;
    const itemID = crypto.randomUUID();
    const docRef = await setDoc(
      doc(collection(db, "shoppinglists", id, "items", itemID)),
      {
        name: newItemName,
        checked: false,
        creator: user!.uid,
        created_at: new Date(),
      }
    );

    setItems((prev) => [
      ...prev,
      {
        id: itemID,
        name: newItemName,
        checked: false,
        creator: user!.uid,
        created_at: new Date(),
      },
    ]);
    setNewItemName("");
  }

  async function handleToggleChecked(itemId: string, checked: boolean) {
    const itemRef = doc(db, "shoppinglists", id, "items", itemId);
    await setDoc(itemRef, { checked }, { merge: true });

    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, checked } : item
      )
    );
  }

  return (
    <div className="space-y-2">
      <p className="font-semibold">{title}</p>

      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <span>{item.name}</span>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={(e) => handleToggleChecked(item.id, e.target.checked)}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      ))}

      {/* Input for new item */}
      <div className="flex gap-2 mt-2">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="Ny vare"
          className="border border-gray-300 px-2 py-1 rounded w-full"
        />
        <button
          onClick={handleAddItem}
          className="px-4 py-2 bg-black text-white rounded hover:bg-blue-700"
        >
          Legg til vare
        </button>
      </div>

      <button
        className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-red-700"
        onClick={() => handleDeleteList(id)}
      >
        Slett liste
      </button>
    </div>
  );
}

export default Shoppinglists;
