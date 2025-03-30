import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ChangePassword from "../../../components/ChangePassword/ChangePassword.jsx";
import LatestRegisteredUsers from "./LatestRegisteredUsers.jsx";
import LatestMissingPersonReports from "./LatestMissingPersonReports.jsx";
import LatestNotification from "./LatestNotification.jsx";
import supabase from "../../../SupabaseClient.js";


const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [counts, setCounts] = useState({
    registeredUsers: 0,
    missingReports: 0,
    notifications: 0,
  });

  // Fetch counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetch counts from Supabase tables
        const { count: profilesCount } = await supabase
          .from("profiles")
          .select("*", { count: "exact" });

        const { count: missingReportsCount } = await supabase
          .from("missing_person_reports")
          .select("*", { count: "exact" });

        const { count: notificationsCount } = await supabase
          .from("notification")
          .select("*", { count: "exact" });

        // Update state with the counts
        setCounts({
          registeredUsers: profilesCount || 0,
          missingReports: missingReportsCount || 0,
          notifications: notificationsCount || 0,
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
        toast.error("Failed to fetch data from Supabase.");
      }
    };

    fetchCounts();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-secondary">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <Navbar openModal={openModal} />
        <main className="p-6 flex-1 overflow-y-auto">
          <ToastContainer position="top-right" autoClose={3000} />

          {/* Dashboard Overview */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Missing Persons Dashboard Overview</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Registered Users */}
              <div className="flex items-center p-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md">
                <div className="p-3 bg-blue-800 rounded-full">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 1c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">Registered Users</h3>
                  <p className="text-2xl font-semibold text-white">{counts.registeredUsers}</p>
                </div>
              </div>

              {/* Missing Person Reports */}
              <div className="flex items-center p-4 bg-gradient-to-r from-red-500 to-red-700 rounded-lg shadow-md">
                <div className="p-3 bg-red-800 rounded-full">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V6h2v3z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">Missing Reports</h3>
                  <p className="text-2xl font-semibold text-white">{counts.missingReports}</p>
                </div>
              </div>

              {/* Notifications Sent */}
              <div className="flex items-center p-4 bg-gradient-to-r from-green-500 to-green-700 rounded-lg shadow-md">
                <div className="p-3 bg-green-800 rounded-full">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 12h2v-2H9v2zm0-4h2V6H9v2z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm2-6a2 2 0 11-4 0 2 2 0 014 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">Notifications Sent</h3>
                  <p className="text-2xl font-semibold text-white">{counts.notifications}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Responsive Tiles for Latest Updates */}
          <div className="bg-gray-600 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-400 mb-4 text-white">Latest Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1">
                <LatestRegisteredUsers title="Registered Users" />
              </div>
              <div className="col-span-1">
                <LatestMissingPersonReports title="Missing Person Reports" />
              </div>
              <div className="col-span-1">
                <LatestNotification title="Notifications" />
              </div>
            </div>
          </div>

          {/* Password Change Modal */}
          <ChangePassword isOpen={isModalOpen} onClose={closeModal} />
        </main>
      </div>
    </div>
  );
};

export default Home;
