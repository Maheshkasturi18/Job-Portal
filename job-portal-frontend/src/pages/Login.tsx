import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn } from "lucide-react";
import { useStore } from "../store";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { baseUrl } from "../Url"; // adjust the path based on your folder structure

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/login`, {
        email,
        password,
      });

      const data = response.data;

      const { token, user } = data;

      // ✅ Save session data
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem(
        "expiresAt",
        String(Date.now() + 2 * 60 * 60 * 1000)
      );

      setCurrentUser({ ...user, token });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      console.error("Login error:", err);
      const errorMessage =
        (err as Error).message || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div
        className={` rounded-lg shadow-md p-8 ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex items-center justify-center mb-8">
          <LogIn className="w-12 h-12 text-blue-600" />
        </div>
        <h1
          className={`text-2xl font-bold text-center mb-8 ${
            isDarkMode ? "text-white" : "text-gray-800"
          }`}
        >
          Welcome Back
        </h1>
        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              required
            />
          </div>
          {/* <div className="mb-6">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              required
            />
          </div> */}
          <div className="mb-6 relative">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 pr-10 rounded-lg border ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-gray-700 hover:text-gray-700 dark:text-gray-500"
              style={{ bottom: "15px" }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Sign In
          </button>

          <Link
            to={"/register"}
            className="block text-center mt-2 text-blue-600 underline"
          >
            Create an Account
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
