import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { db } from "FirebaseConfig";
import { getAuth } from "firebase/auth";
import type { Item, ShoppingList } from "~/Interfaces";
import type { Route } from "./+types";
import { useAuth } from "~/hooks/useAuth";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "handleliste" },
    { name: "description", content: "velkommen til handleliste appen min!" },
  ];
}

async function handleEmailToID(emails: string[]): Promise<string[]> {
  let IDs: string[] = [];
  for (const email of emails) {
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    IDs.push(querySnapshot.docs[0]?.id);
  }

  return IDs;
}

export default function Home() {
  const [list, setList] = useState<ShoppingList>();
  const [titleInput, setTitleInput] = useState("");
  const [sharedWith, setSharedWith] = useState<string[]>([]);
  const [sharedInput, setSharedInput] = useState("");
  const [showSharedWith, setShowSharedWith] = useState(true);
  const [itemName, setItemName] = useState("");
  const { user, loading } = useAuth();

  async function handleCreateList() {
    if (titleInput.trim() === "") return;

    if (!user) return;

    const sharedWithIDs = await handleEmailToID(sharedWith);

    const listId = crypto.randomUUID();
    const createdAt = new Date();

    await setDoc(doc(db, "shoppinglists", listId), {
      title: titleInput.trim(),
      createdAt,
      creator: user.uid,
      sharedWith: sharedWithIDs,
    });

    setList({
      id: listId,
      title: titleInput.trim(),
      created_at: createdAt,
      creator: user.uid,
      sharedWith: sharedWithIDs,
      items: [],
    });

    setTitleInput("");
    setShowSharedWith(false);
    setSharedInput("");
    setSharedWith([]);
  }

  async function handleAddItem(listId: string) {
    if (!list || itemName.trim() === "") return;

    const itemId = crypto.randomUUID();
    const createdAt = new Date();
    const user = getAuth().currentUser;
    if (!user) return;

    await setDoc(doc(db, "shoppinglists", listId, "items", itemId), {
      name: itemName.trim(),
      checked: false,
      createdAt,
    });

    setList({
      ...list,
      items: [
        ...(list.items ?? []),
        {
          id: itemId,
          name: itemName.trim(),
          checked: false,
          creator: user.uid,
          created_at: createdAt,
        },
      ],
    });

    setItemName("");
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <div>
        Logg inn for å se handlelistene dine.{" "}
        <NavLink to="/login">Logg inn</NavLink>{" "}
        <NavLink to="/register">Registrer deg</NavLink>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <button
        onClick={() => window.history.back()}
        className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 mb-4"
      >
        Tilbake
      </button>
      <h1 className="text-xl font-bold mb-2">Lag en ny handleliste</h1>

      <div className="flex gap-2 mb-2">
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
      {showSharedWith ? (
        <input
          type="text"
          value={sharedInput}
          onChange={(e) => {
            setSharedInput(e.target.value);
            setSharedWith(e.target.value.split(/\s+/).filter(Boolean));
          }}
          placeholder="Delt med (e-post, skill med mellomrom)"
          className="border rounded px-2 py-1 w-full mb-4"
        />
      ) : null}

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
                onClick={() => handleAddItem(list.id)}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
              >
                Legg til
              </button>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Varer:</h3>
            {!list.items || list.items.length === 0 ? (
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
