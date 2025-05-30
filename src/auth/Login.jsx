 import React, { useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase/Firebase";
import { ref, get } from "firebase/database";   // import get from realtime db
import { ToastContainer, toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { login, setLoading, setError } from "../redux/AuthSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loading = useSelector((state) => state.auth.loading);

  const handleLogin = async () => {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      
      const userRef = ref(db, 'users/' + user.uid);
      const snapshot = await get(userRef);
  const token = await user.getIdToken();
localStorage.setItem("token", token);

      if (snapshot.exists()) {
        const userData = snapshot.val();
        dispatch(login({ uid: user.uid, role: userData.role }));
      
localStorage.setItem("role",userData.role);
localStorage.setItem("uid",user.uid);
       
        toast.success("Login successful!");

       
        if (userData.role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");   
        }
      } else {
        toast.error("User data not found!");
      }
    } catch (error) {
      dispatch(setError(error.message));
      toast.error("Login failed: " + error.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <>
      <ToastContainer position="top-center" />
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

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
            className="w-full mb-6 p-2 border rounded"
            disabled={loading}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="text-center mt-4">
            Don't have an account?{" "}
            <span
              className="text-blue-600 hover:underline cursor-pointer"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
