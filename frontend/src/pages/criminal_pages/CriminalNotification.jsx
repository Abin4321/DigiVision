import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import supabase from "../../SupabaseClient";

const CriminalNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("criminal_notification")
        .select("criminal_id, location, created_at, found_snap, criminal_db(name)")
        .order("created_at", { ascending: false });
  
      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setNotifications(data || []);
      }
      setLoading(false);
    };
  
    fetchNotifications();
  
    const subscription = supabase
      .channel("criminal_notifications_channel") // Unique channel name
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "criminal_notification" },
        async (payload) => {
          console.log("New notification received:", payload);
          fetchNotifications(); // Refetch notifications to update state
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(subscription); // Unsubscribe on unmount
    };
  }, []);
  

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6 flex-1 overflow-y-auto bg-black">
          <div className="bg-gray-900 shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-6">
              Criminal Notifications Overview
            </h2>
            <div className="bg-gray-900 shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Latest Notifications</h3>
              {loading ? (
                <p className="text-white">Loading...</p>
              ) : notifications.length > 0 ? (
                <ul className="divide-y divide-gray-700">
                  {notifications.map((notification, index) => (
                    <li key={index} className="py-4 flex items-center gap-4">
                      {notification.found_snap && (
                        <img
                          src={notification.found_snap}
                          alt="Criminal Snapshot"
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      <div>
                        <p className="text-lg font-semibold text-white">
                          {notification.criminal_db?.name || "Unknown"}
                        </p>
                        <p className="text-sm text-gray-300">Location: {notification.location}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(notification.created_at).toLocaleString()}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400">No notifications available.</p>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CriminalNotification;
