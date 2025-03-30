import { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, View, Text, Alert } from "react-native";
import { useGlobalContext } from "../../context/GlobalProvider";
import { supabase } from "../../lib/supabase";

const Notification = () => {
  const { user } = useGlobalContext(); // Access logged-in user from context
  const [notifications, setNotifications] = useState([]);
  const [importantUpdates, setImportantUpdates] = useState([]); // State for important updates
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !user.id) return; // Ensure the user is logged in

    const fetchData = async () => {
      try {
        // Fetch notifications
        const { data: notificationsData, error: notificationsError } = await supabase
          .from("notification")
          .select("id, notification_message, notification_datetime, missing_person_id")
          .eq("user_id", user.id);

        if (notificationsError) throw new Error(notificationsError.message);

        // Fetch associated missing person reports
        const missingPersonIds = notificationsData.map((n) => n.missing_person_id);
        const { data: reportData, error: reportError } = await supabase
          .from("missing_person_reports")
          .select("id, name, time_of_missing, place_of_missing, report_time")
          .in("id", missingPersonIds);

        if (reportError) throw new Error(reportError.message);

        // Merge notifications with reports
        const mergedNotifications = notificationsData.map((notification) => ({
          ...notification,
          missing_person_report: reportData.find(
            (report) => report.id === notification.missing_person_id
          ),
        }));

        setNotifications(mergedNotifications);

        // Fetch important updates (broadcast or user-specific)
        const { data: updatesData, error: updatesError } = await supabase
          .from("important_updates")
          .select("id, message, created_at, user_id")
          .or(`user_id.is.null,user_id.eq.${user.id}`); // Fetch updates for all or specific user

        if (updatesError) throw new Error(updatesError.message);

        setImportantUpdates(updatesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        Alert.alert("Error", "Could not fetch data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time subscriptions for notifications and important updates
    const notificationChannel = supabase
      .channel("notifications_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notification",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    const updatesChannel = supabase
      .channel("important_updates")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "important_updates",
          filter: `user_id.is.null,user_id.eq.${user.id}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setImportantUpdates((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(updatesChannel);
    };
  }, [user]);

  if (loading) {
    return (
      <SafeAreaView className="px-4 my-6 bg-primary h-full flex justify-center items-center">
        <Text className="text-lg text-white">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="px-4 my-6 bg-primary h-full">
      <Text className="text-2xl text-white font-bold mb-4">Notifications</Text>

      {/* Notifications Section */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => {
          const missingReport = item.missing_person_report;

          return (
            <View className="bg-secondary rounded-lg p-4 mb-3">
              <Text className="text-lg text-white font-bold">
                {item.notification_message}
              </Text>
              <Text className="text-gray-300 text-sm">
                {new Date(item.notification_datetime).toLocaleString()}
              </Text>
              {missingReport && (
                <View className="mt-2">
                  <Text className="text-gray-200">Name: {missingReport.name}</Text>
                  <Text className="text-gray-200">
                    Time of Missing: {missingReport.time_of_missing}
                  </Text>
                  <Text className="text-gray-200">
                    Place of Missing: {missingReport.place_of_missing}
                  </Text>
                  <Text className="text-gray-200">
                    Report Time: {new Date(missingReport.report_time).toLocaleString()}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <Text className="text-gray-300 text-center">
            No notifications found.
          </Text>
        }
      />

      {/* Important Updates Section */}
      <Text className="text-2xl text-white font-bold mt-6 mb-4">Important Updates</Text>
      <FlatList
        data={importantUpdates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-secondary rounded-lg p-4 mb-3">
            <Text className="text-lg text-white font-bold">{item.message}</Text>
            <Text className="text-gray-300 text-sm">
              {new Date(item.created_at).toLocaleString()}
            </Text>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-gray-300 text-center">
            No important updates found.
          </Text>
        }
      />
    </SafeAreaView>
  );
};

export default Notification;
