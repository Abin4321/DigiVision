import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, StyleSheet, ScrollView, Image } from "react-native";
import { useRoute } from "@react-navigation/native"; // Import route to get navigation params
import { supabase } from "../../lib/supabase";

const RecentsClicked = () => {
  const [reportDetails, setReportDetails] = useState(null);
  const route = useRoute(); // Get the route to access passed parameters
  const { reportId } = route.params; // Extract report ID from navigation params

  // Fetch report details by ID
  const fetchReportDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("missing_person_reports")
        .select("*") // Fetch all fields
        .eq("id", reportId) // Filter by ID
        .single(); // Fetch a single report

      if (error) throw error;
      setReportDetails(data); // Set the report details
    } catch (error) {
      console.error("Error fetching report details:", error.message);
    }
  };

  useEffect(() => {
    fetchReportDetails();
  }, []);

  if (!reportDetails) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading report details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Report Details</Text>
      <ScrollView>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Name:</Text>
          <Text style={styles.value}>{reportDetails.name || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Age:</Text>
          <Text style={styles.value}>{reportDetails.age || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Identification Mark :</Text>
          <Text style={styles.value}>{reportDetails.identification_mark || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Place of Missing:</Text>
          <Text style={styles.value}>{reportDetails.place_of_missing || "N/A"}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Time of Missing:</Text>
          <Text style={styles.value}>{reportDetails.time_of_missing || "N/A"}</Text>
        </View>
        
        {reportDetails.photo_url && (
          <Image
            source={{ uri: reportDetails.photo_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#161622",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    color: "#fff",
    marginTop: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2e2e3c",
  },
  label: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
  },
  value: {
    fontSize: 16,
    color: "#fff",
  },
  image: {
    marginTop: 20,
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
});

export default RecentsClicked;
