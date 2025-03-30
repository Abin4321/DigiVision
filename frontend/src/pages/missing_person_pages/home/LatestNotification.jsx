import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import supabase from "../../../SupabaseClient"; // Import Supabase client

const LatestNotification = ({ title }) => {
  const [latestNotifications, setLatestNotifications] = useState([]);

  useEffect(() => {
    const fetchLatestNotifications = async () => {
      const { data, error } = await supabase
        .from("notification")
        .select("notification_message, notification_datetime")
        .order("id", { ascending: false }) // Order by descending ID
        .limit(2); // Fetch only the last two notifications

      if (error) {
        console.error("Error fetching notifications:", error.message, error.details);
      } else {
        setLatestNotifications(data);
      }
    };

    fetchLatestNotifications();
  }, []);

  return (
    <Card className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{title}</h5>
        <a
          href="/notification"
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {latestNotifications.map((notification, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {notification.notification_message}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {new Date(notification.notification_datetime).toLocaleString()}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default LatestNotification;
