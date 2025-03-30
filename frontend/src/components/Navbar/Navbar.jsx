import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Navbar = ({ openModal }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [trackingMode, setTrackingMode] = useState("criminal");

  useEffect(() => {
    // Check local storage for user data (simulating user login state)
    const user = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(user);
    const savedMode = localStorage.getItem("trackingMode") || "criminal";
    setTrackingMode(savedMode);
  }, []);

  const handleLogout = () => {
    // Clear session and user data
    localStorage.setItem("Session", "true");
    localStorage.removeItem("StudentDetails");
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    navigate("/");
  };

 
  const toggleTrackingMode = () => {
    const newMode = trackingMode === "criminal" ? "missing" : "criminal";
    setTrackingMode(newMode);
    localStorage.setItem("trackingMode", newMode);
    window.location.href = newMode === "missing" ? "/home" : "/home-criminal";
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <header
      className={`${
        trackingMode === "criminal" ? "bg-black" : "bg-secondary"
      } shadow flex items-center justify-between p-4`}
    >
      <h1 className="text-lg font-semibold text-white">
        Welcome, {currentUser?.name || "Admin"}
      </h1>
      <div className="flex items-center space-x-4">

      <div className="flex items-center space-x-3">
  <span className="text-white font-semibold text-md">Criminal Tracker</span>
  <label className="relative inline-flex items-center cursor-pointer">
    <input
      type="checkbox"
      className="sr-only peer"
      checked={trackingMode === "missing"}
      onChange={toggleTrackingMode}
    />
    <div
  className={`w-11 h-5 ${
    trackingMode === "criminal" ? "bg-gray-300" : "bg-gradient-to-r from-sky-400 via-light-blue-500 to-sky-400"
  } rounded-full shadow-md transition-all duration-300 relative`}
>

      <div
        className={`absolute top-1 w-4 h-3 bg-white rounded-full shadow-lg transition-all duration-300 ${
          trackingMode === "missing" ? "left-6" : "left-1"
        }`}
      ></div>
    </div>
  </label>
  <span className="text-white font-semibold text-md">Missing Person Tracker</span>
</div>







        {/* Dropdown */}
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center space-x-2 focus:outline-none text-white"
          >
            <span>{!currentUser ? "Admin" : currentUser.name}</span>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
              <button
                onClick={openModal}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-md p-2"
          aria-label="Logout"
        >
          <FaSignOutAlt className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
