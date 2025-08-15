import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbarr = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Brand/logo */}
        <Link to="/" className="flex items-center">
          <span className="self-center text-2xl font-semibold whitespace-nowrap "></span>
        </Link>

        {/* Mobile menu button */}
        <button
          data-collapse-toggle="navbar-default"
          type="button"
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-default"
          aria-expanded="false"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-5 h-5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 17 14"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M1 1h15M1 7h15M1 13h15"
            />
          </svg>
        </button>

        {/* Navigation links */}
        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border rounded-lg md:flex-row md:space-x-8 md:mt-0 md:border-0">
            {token && (
              <>
                <li>
                  <Link
                    to="/dashboard"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/dashboard")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/user"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/user")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Users
                  </Link>
                </li>
                <li>
                  <Link
                    to="/role"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/role")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Roles
                  </Link>
                </li>
                <li>
                  <Link
                    to="/group"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/group")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Groups
                  </Link>
                </li>
                <li>
                  <Link
                    to="/module"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/module")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Modules
                  </Link>
                </li>
                <li>
                  <Link
                    to="/permission"
                    className={`block py-2 pl-3 pr-4 rounded md:p-0 ${
                      isActive("/permission")
                        ? "text-blue-700 dark:text-blue-500"
                        : "text-gray-900 hover:text-blue-700 dark:text-white dark:hover:text-blue-500"
                    }`}
                  >
                    Permissions
                  </Link>
                </li>
              </>
            )}
            <li>
              {token ? (
                <button
                  onClick={handleLogout}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0 hover:text-red-700 dark:text-white md:dark:hover:text-red-500"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="block py-2 pl-3 pr-4 text-gray-900 rounded md:p-0 hover:text-green-700 dark:text-white md:dark:hover:text-green-500"
                >
                  Login
                </button>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbarr;
