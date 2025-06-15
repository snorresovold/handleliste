import { collection, getDocs, or, query, where } from "firebase/firestore";
import { db } from "FirebaseConfig";
import React, { useEffect, useState } from "react";
import type { ShoppingList } from "~/Interfaces";
import Shoppinglists from "~/components/Shoppinglists";
import { NavLink } from "react-router";
import { useAuth } from "~/hooks/useAuth";

function Index() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const { user, loading } = useAuth();

  async function getLists() {
    if (!user) return; // extra safety

    const q = query(
      collection(db, "shoppinglists"),
      or(
        where("creator", "==", user.uid),
        where("sharedWith", "array-contains", user.uid)
      )
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
    if (!loading && user) {
      getLists();
    }
  }, [loading, user]);

  function handleDelete(id: string) {
    setLists((prev) => prev.filter((list) => list.id !== id));
  }

  if (loading) {
    return <div>Loading...</div>; // or your loader component
  }

  if (!user) {
    return <div>Please log in to see your shopping lists.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex flex-col items-center justify-center pb-3.5">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Mine handlelister
        </h1>
        <NavLink
          to="/addList"
          className="bg-white text-black px-4 py-2 rounded"
          end
        >
          Lag ny handleliste
        </NavLink>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-black">
        {lists.map((list) => (
          <div
            key={list.id}
            className="bg-white shadow-md rounded-2xl p-4 border border-gray-200"
          >
            <Shoppinglists
              id={list.id}
              title={list.title}
              onDelete={handleDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Index;
