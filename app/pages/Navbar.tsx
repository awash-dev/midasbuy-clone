"use client";
import { auth } from "@/Firebase";
import { useState, useEffect } from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const Navbar = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const profileImageUrl = user.photoURL;
      setProfileImage(profileImageUrl);
      localStorage.setItem("profilePic", profileImageUrl);
      console.log("Profile Image URL:", profileImageUrl);
    } catch (error) {
      console.error("Error during login:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedProfilePic = localStorage.getItem("profilePic");
    if (storedProfilePic) {
      setProfileImage(storedProfilePic);
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setProfileImage(user.photoURL);
      } else {
        setProfileImage(null);
        localStorage.removeItem("profilePic");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div className="w-full h-[80px] bg-blue-950/90 flex items-center">
      <div className="container flex items-center justify-around xl:justify-between text-center">
        <div>
          <h1 className="h1 sm:pl-20 pl-5 text-[25px]">TOP-UP</h1>
        </div>
        <div>
          <ul className="hidden xl:flex sm:gap-4">
            <li>
              <a className="hover:border-b-2" href="/">
                Home
              </a>
            </li>
            <li>
              <a className="hover:border-b-2" href="/about">
                About
              </a>
            </li>
            <li>
              <a className="hover:border-b-2" href="/contact">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div>
          <div className="relative">
            {profileImage ? (
              <div className="flex items-center">
                <img
                  onClick={handleSignOut}
                  src={profileImage}
                  width={60}
                  height={60}
                  alt="Profile"
                  className="rounded-full cursor-pointer"
                />
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="border-2 text-[20px] px-6 p-2 rounded-[9px] hover:bg-white hover:text-black transition-all duration-300"
                disabled={loading} // Disable button while loading
              >
                {loading ? "Loading..." : "Login"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
