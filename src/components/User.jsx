 import React, { useState, useEffect } from "react";
import { getAuth, updateProfile, sendEmailVerification } from "firebase/auth";
import { useDispatch } from "react-redux";
import { updateDisplayName } from "../redux/AuthSlice";  

const User = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const dispatch = useDispatch();

  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified || false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user) {
      setEmailVerified(user.emailVerified);
    }
  }, [user]);

  const handleProfileUpdate = async () => {
    try {
      await updateProfile(user, {
        displayName,
        photoURL,
      });

      await user.reload();  
      const updatedUser = auth.currentUser;

       
      dispatch(updateDisplayName(updatedUser.displayName));

      
      setDisplayName(updatedUser.displayName);
      setPhotoURL(updatedUser.photoURL);

      setMessage("Profile updated successfully.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  const handleSendVerification = async () => {
    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent. Please check your inbox.");
    } catch (error) {
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <p><strong>Email:</strong> {user?.email}</p>
      <p>
        <strong>Email Verified:</strong>{" "}
        <span className={emailVerified ? "text-green-600" : "text-red-600"}>
          {emailVerified ? "Yes" : "No"}
        </span>
      </p>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Display Name</label>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      <div className="mt-4">
        <label className="block mb-1 font-medium">Photo URL</label>
        <input
          type="text"
          value={photoURL}
          onChange={(e) => setPhotoURL(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>

      {photoURL && (
        <div className="mt-4">
          <p className="mb-1 font-medium">Preview:</p>
          <img src={photoURL} alt="Profile Preview" className="w-24 h-24 rounded-full" />
        </div>
      )}

      <div className="flex flex-col gap-3 mt-6">
        <button
          onClick={handleProfileUpdate}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>

        {!emailVerified && (
          <button
            onClick={handleSendVerification}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Send Email Verification
          </button>
        )}
      </div>

      {message && <p className="mt-4 text-sm text-blue-700">{message}</p>}
    </div>
  );
};

export default User;
