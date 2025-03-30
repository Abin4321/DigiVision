import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import supabase from "../../../SupabaseClient"; // Import Supabase client

const LatestRegisteredUsers = ({ title }) => {
  const [latestUsers, setLatestUsers] = useState([]);

  useEffect(() => {
    const fetchLatestUsers = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("name, email, profile_photo_url")
        .order("id", { ascending: false }) // Order by descending ID or creation timestamp
        .limit(2); // Fetch only the last two users

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setLatestUsers(data);
      }
    };

    fetchLatestUsers();
  }, []);

  return (
    <Card className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{title}</h5>
        <a
          href="/users-list"
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {latestUsers.map((user, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <img
                    alt={`${user.name}'s profile`}
                    src={user.profile_photo_url || "/images/default-profile.png"}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.email}
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

export default LatestRegisteredUsers;
