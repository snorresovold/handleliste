import React, { useState } from "react";
import { useNavigate } from "react-router"; // Import useNavigate for redirection
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function Registration() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const auth = getAuth();

  function createUser() {
    if (!email || !password) {
      console.error("Email and password are required");
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          id: user.uid,
          createdAt: new Date().toISOString(),
        });

        console.log("User created:", user);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error:", error.code, error.message);
      });
  }

  return (
    <div>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={createUser}>Register</button>
    </div>
  );
}

export default Registration;
