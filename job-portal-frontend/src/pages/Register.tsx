// Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";
import axios from "axios";
import { useStore } from "../store";
import { Eye, EyeOff } from "lucide-react";
import { baseUrl } from "../Url"; // adjust the path based on your folder structure

function Register() {
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "jobseeker",
    company: "",
  });
  const [error, setError] = useState("");

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/api/register`, formData);
      const data = response.data;
      console.log("data", data);

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
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
          <UserPlus className="w-12 h-12 text-blue-600" />
        </div>
        <h1
          className={`text-2xl font-bold text-center mb-8  ${
            isDarkMode ? "text-white " : "text-gray-800 "
          }`}
        >
          Create Account
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
                isDarkMode ? "text-white " : "text-gray-800 "
              }`}
            >
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "text-white bg-gray-800" : "text-gray-800 bg-white"
              }`}
              required
            />
          </div>
          <div className="mb-4">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white " : "text-gray-800 "
              }`}
            >
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "text-white bg-gray-800" : "text-gray-800 bg-white"
              }`}
              required
            />
          </div>
          {/* <div className="mb-4">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white " : "text-gray-800 "
              }`}
            >
              Password
            </label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "text-white bg-gray-800" : "text-gray-800 bg-white"
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
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
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
          <div className="mb-4">
            <label
              className={`block mb-2 ${
                isDarkMode ? "text-white " : "text-gray-800 "
              }`}
            >
              Account Type
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className={`w-full p-3 rounded-lg border ${
                isDarkMode ? "text-white bg-gray-800" : "text-gray-800 bg-white"
              }`}
            >
              <option value="jobseeker">Job Seeker</option>
              <option value="employer">Employer</option>
            </select>
          </div>
          {formData.role === "employer" && (
            <div className="mb-4">
              <label
                className={`block mb-2 ${
                  isDarkMode ? "text-white " : "text-gray-800 "
                }`}
              >
                Company Name
              </label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
                className={`w-full p-3 rounded-lg border ${
                  isDarkMode
                    ? "text-white bg-gray-800"
                    : "text-gray-800 bg-white"
                }`}
                required
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>

          <Link
            to={"/login"}
            className="block text-center mt-2 text-blue-600 underline"
          >
            Already a User? Login
          </Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
