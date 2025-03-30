import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import supabase from "../../../SupabaseClient"; // Import Supabase client

const LatestMissingPersonReports = ({ title }) => {
  const [latestmissing, setlatestmissing] = useState([]);

  useEffect(() => {
    const fetchlatestmissing = async () => {
      const { data, error } = await supabase
        .from("missing_person_reports")
        .select("name, report_time, area_code")
        .order("id", { ascending: false }) // Order by descending ID or creation timestamp
        .limit(2); // Fetch only the last two users

      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setlatestmissing(data);
      }
    };

    fetchlatestmissing();
  }, []);

  return (
    <Card className="max-w-sm">
      <div className="mb-4 flex items-center justify-between">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">{title}</h5>
        <a
          href="/reports"
          className="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
        >
          View all
        </a>
      </div>
      <div className="flow-root">
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {latestmissing.map((user, index) => (
            <li key={index} className="py-3 sm:py-4">
              <div className="flex items-center space-x-4">
                
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.report_time}
                  </p>
                  <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                    {user.area_code}
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

export default LatestMissingPersonReports;
