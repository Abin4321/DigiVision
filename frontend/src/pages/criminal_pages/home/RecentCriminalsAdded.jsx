import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import supabase from "../../../SupabaseClient";

const RecentCriminalsAdded = ({ title }) => {
  const [recentCriminals, setRecentCriminals] = useState([]);

  useEffect(() => {
    const fetchRecentCriminals = async () => {
      const { data, error } = await supabase
        .from("criminal_db")
        .select("name,photo_url")
        .order("id", { ascending: false })
        .limit(2);

      if (error) {
        console.error("Error fetching criminals:", error);
      } else {
        setRecentCriminals(data);
      }
    };

    fetchRecentCriminals();
  }, []);

  return (
    <Card className="max-w-sm bg-gray-900 text-white shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none">{title}</h5>
        <a
          href="/Criminals-list"
          className="text-sm font-medium text-cyan-400 hover:underline"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-700">
          {recentCriminals.map((criminal, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                <div className="shrink-0">
                  <img
                    alt={`${criminal.name}'s profile`}
                    src={criminal.photo_url || "/images/default-profile.png"}
                    className="w-10 h-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{criminal.name}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default RecentCriminalsAdded;
