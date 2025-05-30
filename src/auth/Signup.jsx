 import React, { useRef, useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError } from "../redux/AuthSlice";
import { getDatabase, ref, set } from "firebase/database";

const ADMIN_SECRET_CODE = "SECRET123"; // Your secret admin signup code — move to env for real use

const Signup = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const [role, setRole] = useState("user");
  const adminCodeRef = useRef(null);
  const dispatch = useDispatch();
  const db = getDatabase();

  const loading = useSelector((state) => state.auth.loading);

  const handleSignup = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const selectedRole = role;
    const enteredAdminCode = adminCodeRef.current ? adminCodeRef.current.value : "";

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    if (selectedRole === "admin") {
      if (enteredAdminCode !== ADMIN_SECRET_CODE) {
        toast.error("Invalid admin code!");
        return;
      }
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user info including role
      await set(ref(db, "users/" + user.uid), {
        email: user.email,
        uid: user.uid,
        role: selectedRole,
      });

      dispatch(login({ uid: user.uid, role: selectedRole }));

      toast.success("Signup successful!");
    } catch (error) {
      dispatch(setError(error.message));
      toast.error("Signup failed: " + error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>

          <input
            type="email"
            placeholder="Email"
            ref={emailRef}
            className="w-full mb-4 p-2 border rounded"
            disabled={loading}
          />

          <input
            type="password"
            placeholder="Password"
            ref={passwordRef}
            className="w-full mb-4 p-2 border rounded"
            disabled={loading}
          />

          <select
            className="w-full mb-4 p-2 border rounded"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          {role === "admin" && (
            <input
              type="password"
              placeholder="Enter admin code"
              ref={adminCodeRef}
              className="w-full mb-4 p-2 border rounded"
              disabled={loading}
            />
          )}

          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Signup;
