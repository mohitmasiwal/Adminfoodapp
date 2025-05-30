 import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import Signup from "./auth/Signup";
import Login from "./auth/Login";
import Header from "./components/Header";
import Admin from "./components/Admin";
import UserPage from "./components/UserPage";
import Recipee from "./components/Recipee";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import User from "./components/User";
import Footer from "./components/Footer";

import { login } from "./redux/AuthSlice";
import { setCart } from "./redux/CartSlice";
import { onAuthStateChanged } from "firebase/auth";
import { get, ref } from "firebase/database";
import { auth, db } from "./firebase/Firebase";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true); // 👈 Add loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const storedRole = localStorage.getItem("role");
        dispatch(login({ uid: user.uid, role: storedRole }));

        try {
          const cartRef = ref(db, `carts/${user.uid}`);
          const snapshot = await get(cartRef);
          if (snapshot.exists()) {
            dispatch(setCart(snapshot.val()));
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        }
      }
      setLoading(false); // ✅ Wait until we know auth state
    });

    return () => unsubscribe();
  }, [dispatch]);

  const role = useSelector((state) => state.auth.role);
  const uid = useSelector((state) => state.auth.uid);
  const isLoggedIn = !!role && !!uid;

  if (loading) return <div>Loading...</div>; // ⏳ Prevent premature routing

  return (
    <Router>
      <Header />
       <Routes>
  <Route path="/login" element={isLoggedIn ? <Navigate to="/" /> : <Login />} />
  <Route path="/signup" element={isLoggedIn ? <Navigate to="/" /> : <Signup />} />
  <Route path="/recipee" element={<Recipee />} />
  <Route path="/cart" element={<Cart />} />
  <Route path="/orders" element={<Orders />} />

  {/* ✅ Public route */}
  <Route path="/user" element={<UserPage />} />

  {/* ✅ Protected admin route */}
  <Route
    path="/admin"
    element={
      isLoggedIn && role === "admin" ? <Admin /> : <Navigate to="/login" replace />
    }
  />

  <Route
    path="/user/profile"
    element={
      isLoggedIn && role === "user" ? <User /> : <Navigate to="/login" replace />
    }
  />

  {/* Default redirection */}
  <Route
    path="/"
    element={
      isLoggedIn ? (
        role === "admin" ? (
          <Navigate to="/admin" replace />
        ) : (
          <Navigate to="/user" replace />
        )
      ) : (
        <Navigate to="/login" replace />
      )
    }
  />

  <Route path="*" element={<Navigate to="/" replace />} />
</Routes>

      <Footer />
    </Router>
  );
}

export default App;
