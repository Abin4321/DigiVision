import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Alert, Button } from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { supabase } from "../../lib/supabase"; // Adjust the import based on your folder structure
import { useGlobalContext } from "../../context/GlobalProvider";
import { router } from "expo-router";

const ScanQRCode = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedData, setScannedData] = useState("");
  const [uploading, setUploading] = useState(false);
  const { user, setUser } = useGlobalContext(); // Get current user and function to update user state

  useEffect(() => {
    const getCameraPermission = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === "granted");
    };
    getCameraPermission();
  }, []);

  const validateAndSubmitAreaCode = async (areaCode) => {
    if (!/^\d{5}$/.test(areaCode)) {
      return Alert.alert("Error", "Invalid QR code. Please scan a valid 5-digit area code.");
    }

    setUploading(true);
    try {
      // Validate area code against database
      const { data, error } = await supabase
        .from("area_code")
        .select("area_code, name")
        .eq("area_code", areaCode);

      if (error) throw error;
      if (data.length === 0) {
        Alert.alert("Error", "Area code not found.");
        return;
      }

      // If valid, update user profile and navigate
      const place = data[0].name;
      Alert.alert("Success", `Connected to area code ${areaCode} (${place}).`);

      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, email: user.email, area_code: areaCode });

      if (updateError) throw updateError;

      setUser((prevUser) => ({ ...prevUser, area_code: code }));


      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred.");
    } finally {
      setUploading(false);
    }
  };

  const handleBarCodeScanned = ({ data }) => {
    setScanned(true);
    setScannedData(data);
    validateAndSubmitAreaCode(data); // Validate scanned data as area code
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Requesting for camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>No access to camera.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {scanned ? (
        <>
          <Text style={styles.text}>
            {uploading ? "Submitting..." : `Scanned Data: ${scannedData}`}
          </Text>
          <Button title="Scan Again" onPress={() => setScanned(false)} disabled={uploading} />
        </>
      ) : (
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
  },
  text: {
    color: "white",
    fontSize: 20,
    textAlign: "center",
  },
});

export default ScanQRCode;
