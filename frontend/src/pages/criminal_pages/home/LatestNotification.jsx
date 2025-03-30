import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import supabase from "../../../SupabaseClient";

const LatestNotification = ({ title }) => {
  const [latestNotifications, setLatestNotifications] = useState([]);

  useEffect(() => {
    const fetchLatestNotifications = async () => {
      const { data, error } = await supabase
        .from("criminal_notification")
        .select("criminal_id, location, created_at, criminal_db(name)") // Proper join
        .order("created_at", { ascending: false }) // Order by timestamp
        .limit(2);

      if (error) {
        console.error("Error fetching notifications:", error.message);
      } else {
        setLatestNotifications(data || []);
      }
    };

    fetchLatestNotifications();
  }, []);

  return (
    <Card className="max-w-sm bg-gray-900 dark:bg-gray-900 text-white">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-white">{title}</h5>
        <a
          href="/notification"
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {latestNotifications.length > 0 ? (
            latestNotifications.map((notification, index) => (
              <li key={index} className="py-3 sm:py-4">
                <div className="flex items-center space-x-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">
                      {notification.criminal_db?.name || "Unknown"}
                    </p>
                    <p className="truncate text-sm text-gray-400">
                      {notification.location}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(notification.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </li>
            ))
          ) : (
            <p className="text-sm text-gray-400 text-center py-3">
              No recent notifications
            </p>
          )}
        </ul>
      </div>
    </Card>
  );
};

export default LatestNotification;
