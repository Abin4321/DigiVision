import React, { useState, useEffect } from "react";
import Navbar from "../../../components/Navbar/Navbar.jsx";
import Sidebar from "../../../components/Sidebar/Sidebar.jsx";
import ChangePassword from "../../../components/ChangePassword/ChangePassword.jsx";
import supabase from "../../../SupabaseClient";
import RecentCriminalsAdded from "./RecentCriminalsAdded"
import LatestNotification from "./LatestNotification.jsx";

const HomeCriminal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [criminalCount, setCriminalCount] = useState(0);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    const fetchCriminalCount = async () => {
      const { data, error } = await supabase.from("criminal_db").select("*", { count: "exact" });
      if (!error) setCriminalCount(data.length);
    };

    const fetchNotificationsCount = async () => {
      const { data, error } = await supabase.from("criminal_notification").select("*", { count: "exact" });
      if (!error) setNotificationsCount(data.length);
    };

    fetchCriminalCount();
    fetchNotificationsCount();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar openModal={openModal} />
        <main className="p-6 flex-1 overflow-y-auto bg-black">
          <div className="bg-gray-900 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Criminal Tracker Dashboard Overview
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="flex items-center p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-md">
                <div className="p-3 bg-gray-600 rounded-full">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 12a4 4 0 100-8 4 4 0 000 8zm0 1c-3.33 0-10 1.67-10 5v1h20v-1c0-3.33-6.67-5-10-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-bold text-white">Total Records in criminal_db Table</h3>
                  <p className="text-2xl font-semibold text-white">{criminalCount}</p>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg shadow-md">
                <div className="p-3 bg-green-700 rounded-full">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="currentColor"
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
                  <h3 className="text-lg font-bold text-white">Notifications Sent to Authorities</h3>
                  <p className="text-2xl font-semibold text-white">{notificationsCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-900 shadow-lg rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Latest Updates</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="col-span-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white shadow-md">
                <RecentCriminalsAdded title="Recent Criminals Added" />
              </div>
              <div className="col-span-1 bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-4 text-white shadow-md">
                <LatestNotification title="Recent Notifications Sent" />
              </div>
            </div>
          </div>


          <ChangePassword isOpen={isModalOpen} onClose={closeModal} />
        </main>
      </div>
    </div>
  );
};

export default HomeCriminal;
