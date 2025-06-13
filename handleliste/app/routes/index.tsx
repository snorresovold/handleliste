import { getAuth } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "FirebaseConfig";
import React, { useEffect, useState } from "react";
import type { ShoppingList } from "./home";
import Shoppinglists from "~/components/Shoppinglists";

function index() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const auth = getAuth();
  async function getLists() {
    const user = auth.currentUser;
    const q = query(
      collection(db, "shoppinglists"),
      where("creator", "==", user!.uid)
    );

    const querySnapshot = await getDocs(q);
    setLists(
      querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as unknown as ShoppingList[]
    );
  }
  useEffect(() => {
    getLists().then(() => {
      console.log("Lists fetched successfully");
    });
  }, []);
  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center pb-3.5">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Mine handlelister
        </h1>
        <button className="bg-white text-black px-4 py-2 rounded">
          Lag ny liste
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200"
          >
            <Shoppinglists id={list.id} title={list.title} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default index;
