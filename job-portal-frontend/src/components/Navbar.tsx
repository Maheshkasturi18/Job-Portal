import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon, User, Menu, LogOut, X } from "lucide-react";
import { useStore } from "../store";

function Navbar() {
  const { isDarkMode, toggleDarkMode, currentUser, setCurrentUser } =
    useStore();
  // const  = useStore((state) => state.isDarkMode);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleLogout = () => {
    localStorage.clear();
    setCurrentUser(null);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav
      className={`${isDarkMode ? "dark bg-gray-800" : "bg-white"} shadow-md`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link
            to="/"
            className={`text-xl font-bold ${
              isDarkMode ? "text-white" : "text-gray-900"
            }`}
          >
            JobPortal
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/jobs"
              className={`${
                isDarkMode ? "text-gray-300" : "text-gray-700"
              } hover:text-blue-600`}
            >
              Jobs
            </Link>

            {currentUser && (
              <Link
                to={`/${currentUser.role}/dashboard`}
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } hover:text-blue-600`}
              >
                Dashboard
              </Link>
            )}

            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`text-sm font-medium ${
                    isDarkMode ? "text-white" : "text-gray-800"
                  }`}
                >
                  Profile
                </button>
                {isDropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 shadow-lg rounded-md p-2 z-50 ${
                      isDarkMode ? "bg-gray-800" : "bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-2 border-b pb-2">
                      <User className="w-5 h-5 text-blue-500" />
                      <span
                        className={`${
                          isDarkMode ? "text-white" : "text-gray-800"
                        } text-sm`}
                      >
                        {currentUser.name}
                      </span>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 text-red-600 hover:underline px-2 py-2 mt-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/register"
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } hover:text-blue-600`}
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className={`${
                    isDarkMode ? "text-gray-300" : "text-gray-700"
                  } hover:text-blue-600 ml-4`}
                >
                  Login
                </Link>
              </>
            )}

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${
                isDarkMode ? "bg-gray-700" : "bg-gray-100"
              }`}
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`md:hidden  px-4 pb-4 shadow-md transition-all duration-300 ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <Link
            to="/jobs"
            className={`block py-2  hover:text-blue-600 ${
              isDarkMode ? "text-white" : "text-gray-800"
            }`}
          >
            Jobs
          </Link>

          {currentUser && (
            <Link
              to={`/${currentUser.role}/dashboard`}
              className={`block py-2  hover:text-blue-600 ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Dashboard
            </Link>
          )}

          {currentUser ? (
            <div className="mt-2 border-t pt-2">
              <div className="flex items-center gap-2 py-1">
                <User className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-800 dark:text-white">
                  {currentUser.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-red-600 hover:underline mt-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/register"
                className={`${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                } hover:text-blue-600`}
              >
                Register
              </Link>
              <Link
                to="/login"
                className="block py-2 text-gray-700 dark:text-gray-300 hover:text-blue-600"
              >
                Login
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
