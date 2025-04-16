// Login.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { LogIn } from "lucide-react";
import { useStore } from "../store";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Firebase sign in
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      // Get Firebase ID token
      const token = await user.getIdToken();
      // Fetch additional profile from Firestore
      const docSnap = await getDoc(doc(db, "users", user.uid));
      if (docSnap.exists()) {
        const userData = docSnap.data();
        // Save user data, including uid and token, in global state for use in API calls
        setCurrentUser({
          uid: user.uid,
          token,
          name: userData.name,
          email: userData.email,
          role: userData.role,
          company: userData.company, // Optional field
        });
        navigate(`/${userData.role}/dashboard`);
      }
    } catch (err) {
      console.log("Error object:", err);
      const errorMessage =
        (err as Error).message || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-8">Welcome Back</h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 rounded-lg border dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 rounded-lg border dark:bg-gray-700"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
