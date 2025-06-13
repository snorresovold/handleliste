import { collection, getDocs } from "firebase/firestore";
import { db } from "FirebaseConfig";
import React, { useEffect, useState } from "react";
interface Props {
  id: string;
  title: string;
}

interface Item {
  id: string;
  checked: boolean;
  name: string;
}

function Shoppinglists({ id, title }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  async function getItems() {
    const querySnapshot = await getDocs(
      collection(db, "shoppinglists", id, "items")
    );
    const newItems = querySnapshot.docs.map((doc) => ({
      id: doc.data().id,
      checked: doc.data().checked,
      name: doc.data().name,
    }));
    setItems(newItems);
    console.log(newItems);
  }
  useEffect(() => {
    getItems().then(() => {
      console.log("Items fetched successfully");
    });
  }, []);
  return (
    <div className="space-y-2">
      <p className="font-semibold">{title}</p>
      {items.map((item) => (
        <div key={item.id} className="flex justify-between items-center">
          <span>{item.name}</span>
          <input
            type="checkbox"
            checked={item.checked}
            onChange={() => {}}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
        </div>
      ))}
      <button className="mt-2 px-4 py-2 bg-black text-white rounded hover:bg-blue-700">
        Endre liste
      </button>
    </div>
  );
}

export default Shoppinglists;
