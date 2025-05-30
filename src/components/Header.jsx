 import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ShoppingCart, Menu, X } from "lucide-react";
import { toast } from "react-toastify";
import { logout } from "../redux/AuthSlice";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);

  const role = useSelector((state) => state.auth.role);
  const cartItems = useSelector((state) => state.cart.items) || {};
  const isLoggedIn = !!localStorage.getItem("token");

  const displayName = localStorage.getItem("displayName") || "User";

  const handleLogout = async () => {
    try {
      dispatch(logout());
      localStorage.removeItem("token");
      localStorage.removeItem("uid");
      localStorage.removeItem("role");
      localStorage.removeItem("displayName");
      toast.success("Logged out successfully!");
      navigate("/login");
      setMenuOpen(false);
    } catch (err) {
      toast.error("Logout failed.");
    }
  };

  return (
    <header className="bg-gray-900 text-gray-100 shadow-md px-4 py-3 flex justify-between items-center relative z-50">
      <Link to="/" className="text-2xl font-bold text-green-400">
        🍽️ FoodieZone
      </Link>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-4">
        {isLoggedIn && role === "user" && (
          <Link
            to="/cart"
            className="relative flex items-center text-gray-300 hover:text-green-400"
          >
            <ShoppingCart className="w-6 h-6" />
            {Object.keys(cartItems).length > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                {Object.keys(cartItems).length}
              </span>
            )}
          </Link>
        )}

        {isLoggedIn ? (
          role === "admin" ? (
            <Link
              to="/admin"
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              Admin Panel
            </Link>
          ) : (
            <Link
              to="/user"
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700"
            >
              User Panel
            </Link>
          )
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Login
          </Link>
        )}

        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        )}
      </nav>

      {/* Mobile menu toggle button */}
      <button
        className="md:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? (
          <X className="w-6 h-6 text-gray-100" />
        ) : (
          <Menu className="w-6 h-6 text-gray-100" />
        )}
      </button>

      {/* Mobile menu dropdown */}
      {menuOpen && (
        <nav className="transition-all duration-200 ease-out absolute top-16 right-4 bg-gray-800 rounded-xl shadow-lg w-56 flex flex-col p-4 gap-4 z-50 md:hidden border border-gray-700">
          {isLoggedIn && role === "user" && (
            <Link
              to="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative flex items-center text-gray-300 hover:text-green-400"
            >
              <ShoppingCart className="w-6 h-6 mr-2" />
              Cart
              {Object.keys(cartItems).length > 0 && (
                <span className="absolute -top-1 -right-3 bg-red-600 text-white text-xs rounded-full px-1">
                  {Object.keys(cartItems).length}
                </span>
              )}
            </Link>
          )}

          {isLoggedIn ? (
            role === "admin" ? (
              <Link
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-center"
              >
                Admin Panel
              </Link>
            ) : (
              <Link
                to="/user"
                onClick={() => setMenuOpen(false)}
                className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-center"
              >
                User Panel
              </Link>
            )
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 text-center"
            >
              Login
            </Link>
          )}

          {isLoggedIn && (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}
        </nav>
      )}
    </header>
  );
};

export default Header;
