import React, { useEffect, useState } from "react";
import supabase from "../../../SupabaseClient"; // Import Supabase client
import Sidebar from "../../../components/Sidebar/Sidebar"; // Import Sidebar component

const AdminNotification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        // Fetch notifications with user and missing person report details
        const { data, error } = await supabase
          .from("notification")
          .select(`
            id,
            notification_message,
            notification_datetime,
            user_id,
            missing_person_id,
            profiles (
              id,
              email,
              name
            ),
            missing_person_reports (
              id,
              name,
              time_of_missing,
              place_of_missing,
              report_time
            )
          `)
          .order("notification_datetime", { ascending: false });

        if (error) throw new Error(error.message);

        setNotifications(data || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();

    // Subscribe to real-time updates for notifications
    const subscription = supabase
      .channel("realtime:notification")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notification" },
        (payload) => {
          console.log("Change received!", payload);

          // Update notifications based on the event type
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setNotifications((prev) =>
              prev.map((item) =>
                item.id === payload.new.id ? payload.new : item
              )
            );
          } else if (payload.eventType === "DELETE") {
            setNotifications((prev) =>
              prev.filter((item) => item.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 bg-secondary overflow-y-auto">
        <h1 className="text-4xl font-semibold text-white text-center mb-8">
          Admin Notifications
        </h1>

        <div className="bg-white rounded shadow-md p-4">
          {notifications.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {notifications.map((notification) => {
                const user = notification.profiles || {};
                const report = notification.missing_person_reports || {};

                return (
                  <li
                    key={notification.id}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between"
                  >
                    <div>
                      <p className="text-gray-800 font-medium text-sm">
                        {notification.notification_message}
                      </p>
                      <small className="text-gray-500 text-xs">
                        {new Date(
                          notification.notification_datetime
                        ).toLocaleString()}
                      </small>

                      {/* User Info */}
                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">
                          Sent to: {user.name || "N/A"} ({user.email || "N/A"})
                        </p>
                      </div>

                      {/* Report Info */}
                      <div className="mt-2">
                        {report ? (
                          <>
                            <p className="text-gray-600 text-sm">
                              Missing Person: {report.name || "N/A"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Time of Missing:{" "}
                              {report.time_of_missing || "N/A"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Place of Missing:{" "}
                              {report.place_of_missing || "N/A"}
                            </p>
                            <p className="text-gray-600 text-sm">
                              Report Time:{" "}
                              {new Date(
                                report.report_time
                              ).toLocaleString()}
                            </p>
                          </>
                        ) : (
                          <p className="text-gray-500 text-sm">
                            No associated report data.
                          </p>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">
              No notifications available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminNotification;
