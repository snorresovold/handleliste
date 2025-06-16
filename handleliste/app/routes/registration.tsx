import React, { useState } from "react";
import { useNavigate } from "react-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "FirebaseConfig";
import { doc, setDoc } from "firebase/firestore";

function Registration() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vær så snill å legg inn både passord og email.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        id: user.uid,
        createdAt: new Date().toISOString(),
      });

      navigate("/");
    } catch (error: any) {
      alert(error.message || "Registration failed.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-base-200 p-4">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-2xl font-bold text-center mb-4">Registrer</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input input-bordered w-full"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Passord
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Registrer
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
