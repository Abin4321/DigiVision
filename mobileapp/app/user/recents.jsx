import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import { supabase } from "../../lib/supabase";

const Recents = () => {
  const [recentReports, setRecentReports] = useState([]);
  const [userId,setUserId]= useState(null);
  const navigation = useNavigation(); // Initialize navigation

  const fetchUserId = async ()=>{
    const {
      data:{user},
      error,
    }= await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user id:",error.message);
    }
    else{
      setUserId(user.id);
    }
  };

  const fetchRecentReports = async () => {
    if (!userId) return;
    try {
      const { data, error } = await supabase
        .from("missing_person_reports")
        .select("id, name")
        .eq("user_id",userId)
        .order("report_time", { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentReports(data || []);
    } catch (error) {
      console.error("Error fetching recent reports:", error.message);
    }
  };

  useEffect(()=>{
    fetchUserId();
  },[]);

  useEffect(() => {
    fetchRecentReports();
  }, [userId]);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Recent Missing Submissions</Text>
      {recentReports.length === 0 ? (
        <Text style={styles.emptyState}>No recent submissions found.</Text>
      ) : (
        <ScrollView style={styles.scrollView}>
          {recentReports.map((report) => (
            <TouchableOpacity
              key={report.id}
              style={styles.reportItem}
              onPress={() => navigation.navigate("user/RecentsClicked", { reportId: report.id })} // Navigate and pass the report ID
            >
              <Text style={styles.reportText}>{report.name || "Unnamed"}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
    paddingTop:40,
    marginTop: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  emptyState: {
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
  },
  scrollView: {
    marginTop: 10,
  },
  reportItem: {
    backgroundColor: "#2e2e3c",
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
  },
  reportText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});

export default Recents;
