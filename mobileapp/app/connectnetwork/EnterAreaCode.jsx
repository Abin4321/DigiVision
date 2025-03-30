import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Alert, Button, TextInput } from "react-native";
import { supabase } from "../../lib/supabase";
import { useGlobalContext } from "../../context/GlobalProvider";

const EnterAreaCode = () => {
  const { user, setUser } = useGlobalContext(); // Get current user and function to update user state
  const [code, setCode] = useState(""); // State to hold the area code
  const [uploading, setUploading] = useState(false); // Loading state for submitting

  // Function to submit the area code
  const submitAreaCode = async () => {
    if (!/^\d{5}$/.test(code)) {
      return Alert.alert("Error", "Please enter a valid 5-digit numeric area code");
    }

    setUploading(true);
    try {
      // Check if the area code exists in the AreaCode table
      const { data, error } = await supabase
        .from("area_code")  // Check against AreaCode table
        .select("area_code, name") // Fetch area code and name
        .eq("area_code", code);

      if (error) throw error;
      if (data.length === 0) {
        Alert.alert("Error", "Area code not found");
        return;
      }

      // If area code exists, show the place (name)
      const place = data[0].name; // Get the place name
      Alert.alert("Success", `You have connected to area code ${code}, which corresponds to ${place}`);

      // Update the area code in the profiles table for the current user
      const { error: updateError } = await supabase
        .from("profiles")
        .upsert({ id: user.id, email:user.email, area_code: code });

      if (updateError) throw updateError;

      setUser((prevUser) => ({ ...prevUser, area_code: code }));

      // Navigate back after success
      router.push("/home");

    } catch (error) {
      Alert.alert("Error", error.message || "An unexpected error occurred");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="px-4 my-6">
        <Text className="text-2xl text-white font-semibold mb-4">Enter Area Code</Text>

        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Enter 5-digit area code"
          keyboardType="numeric"
          maxLength={5}
          className="bg-gray-200 text-lg p-4 rounded-md w-full mb-4"
        />

        <Button
          title={uploading ? "Submitting..." : "Submit Area Code"}
          onPress={submitAreaCode}
          disabled={uploading}
        />
      </View>
    </SafeAreaView>
  );
};

export default EnterAreaCode;
