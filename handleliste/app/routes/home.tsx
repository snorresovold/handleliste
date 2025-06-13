import { useState } from "react";
import type { Route } from "./+types/home";
import { doc, setDoc } from "firebase/firestore";
import { db } from "FirebaseConfig";
import { getAuth } from "firebase/auth";
import firebase from "firebase/compat/app";
import { randomUUID } from "crypto";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "handleliste" },
    { name: "description", content: "velkommen til handleliste appen min!" },
  ];
}

export interface ShoppingList {
  id: string;
  title: string;
  created_at: string;
  items: Item[];
}

export interface Item {
  id: string;
  name: string;
  checked: boolean;
}

export default function Home() {
  const [list, setList] = useState<ShoppingList>();
  const [titleInput, setTitleInput] = useState<string>("");

  // Item input states
  const [itemName, setItemName] = useState<string>("");

  async function handleCreateList() {
    if (titleInput.trim() === "") return;

    const auth = getAuth();

    const newList: ShoppingList = {
      id: randomUUID(),
      title: titleInput.trim(),
      created_at: new Date().toISOString(),
      items: [],
    };

    const user = auth.currentUser;
    await setDoc(doc(db, "shoppinglists", newList.id.toString()), {
      title: newList.title,
      createdAt: new Date().toISOString(),
      creator: user!.uid,
    });

    setList(newList);
    setTitleInput("");
  }

  function handleAddItem() {
    if (!list || itemName.trim() === "") return;

    const newItem: Item = {
      id: randomUUID(),
      name: itemName.trim(),
      checked: false,
    };

    setList({
      ...list,
      items: [...list.items, newItem],
    });

    // Clear item inputs
    setItemName("");
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-2">Lag en ny handleliste</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={titleInput}
          onChange={(e) => setTitleInput(e.target.value)}
          placeholder="Skriv navn på listen..."
          className="border rounded px-2 py-1 flex-1"
        />
        <button
          onClick={handleCreateList}
          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
        >
          Lag
        </button>
      </div>

      {list && (
        <>
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Handleliste: {list.title}</h2>
            <p className="text-sm text-gray-500">
              Opprettet: {new Date(list.created_at).toLocaleString()}
            </p>
          </div>

          <div className="space-y-2 mb-4">
            <h3 className="font-medium">Legg til vare:</h3>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Varenavn"
              className="border rounded px-2 py-1 w-full"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddItem}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Legg til
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Varer:</h3>
            {list.items.length === 0 ? (
              <p className="text-gray-500">Ingen varer enda.</p>
            ) : (
              <ul className="list-disc pl-5 space-y-1">
                {list.items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
