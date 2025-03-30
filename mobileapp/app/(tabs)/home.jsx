import React, { useState, useEffect } from "react";
import { SafeAreaView, Text, View, TouchableOpacity, Alert, Image } from "react-native";
import { useRouter } from "expo-router"; // Import useRouter
import { supabase } from "../../lib/supabase"; // Import supabase
import { useGlobalContext } from "../../context/GlobalProvider";
import { EmptyState } from "../../components";

const Home = () => {
  const [areaCodeName, setAreaCodeName] = useState(""); // State to hold area code name
  const router = useRouter(); // Initialize the router
  const { user, setUser, setIsLogged } = useGlobalContext(); // Access user data from context

  // Check if user is logged in and redirect to sign-in if not
  useEffect(() => {
    if (!user) {
      router.replace("/sign-in"); // Redirect to sign-in if user is not logged in
    }
  }, [user]);

  // Fetch user's area code from profiles and the corresponding place name
  useEffect(() => {
    const fetchAreaCode = async () => {
      if (!user || !user.id) return; // Prevent fetching if user is null

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("area_code")
          .eq("id", user.id) // Replace with the actual user ID
          .single();

        if (error) throw error;

        if (data && data.area_code) {
          // Fetch the place name associated with the area code
          const { data: areaCodeData, error: areaCodeError } = await supabase
            .from("area_code")
            .select("name")
            .eq("area_code", data.area_code)
            .single();

          if (areaCodeError) throw areaCodeError;

          setAreaCodeName(areaCodeData ? areaCodeData.name : "Unknown"); // Set the area code name
        }
      } catch (error) {
        console.error("Error fetching area code:", error);
      }
    };

    fetchAreaCode();
  }, [user]); // Dependency on user to avoid errors

  // Logout functionality
  const logout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: handleLogout },
    ]);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut(); // Sign out from Supabase
      if (error) throw error;
  
      setUser(null); // Clear user state
      setIsLogged(false); // Update login state
      router.replace("/sign-in"); // Navigate to sign-in page
    } catch (error) {
      console.error("Logout Error:", error);
      Alert.alert("Error", "Failed to logout. Please try again.");
    }
  };
  

  if (!user) {
    return null; // Prevent rendering Home UI until redirect happens
  }

//   return (
//     <SafeAreaView className="bg-primary flex-1">
//       <View className="flex my-10 px-4 space-y-6">
//         {/* Welcome Section */}
//         <View className="flex justify-between items-start flex-row mb-6">
//           <View>
//             <Text className="font-pmedium text-sm text-gray-100">
//               Welcome Back
//             </Text>
//             <Text className="text-2xl font-psemibold text-white">
//               {user.name}
//             </Text>
//           </View>

//           {/* Replace logoSmall with Logout Button */}
//           <TouchableOpacity
//             onPress={logout}
//             className="flex w-10 h-10 justify-center items-center bg-secondary-300 rounded-lg"
//           >
//             <Image
//               source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828479.png" }} // Example logout icon
//               className="w-6 h-6"
//               resizeMode="contain"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Tiles Section */}
//         <View className="flex flex-row justify-between space-x-4">
//           {/* Quick Guide Tile */}
//           <TouchableOpacity className="bg-secondary-300 p-4 rounded-lg flex-1">
//             <Text className="text-white text-lg font-psemibold">
//               Quick Guide
//             </Text>
//           </TouchableOpacity>

//           {/* Recents Tile */}
//           <TouchableOpacity
//             className="bg-secondary-300 p-4 rounded-lg flex-1"
//             onPress={() => router.push("/user/recents")} // Use router.push to navigate to the Recents page
//           >
//             <Text className="text-white text-lg font-psemibold">
//               Recents
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* EmptyState Section */}
//       <EmptyState
//         title="Recently Connected to"
//         subtitle={areaCodeName ? areaCodeName : "Unknown Area"}
//       />
//     </SafeAreaView>
//   );
// };

return (
  <SafeAreaView className="bg-primary flex-1 px-6 py-8">
    {/* Header Section */}
    <View className="flex-row justify-between items-center mb-6">
      {/* User Info */}
      <View >
        <Text className="font-pmedium text-sm text-gray-300 py-2">Welcome Back</Text>
        <Text className="text-3xl font-psemibold text-white">{user.name}</Text>
      </View>

      {/* Profile + Logout */}
      <TouchableOpacity onPress={logout} className="w-12 h-12 rounded-full bg-secondary-300 flex justify-center items-center shadow-lg">
        <Image
          source={{ uri: "https://cdn-icons-png.flaticon.com/512/1828/1828479.png" }}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>

    {/* Tiles Section */}
    <View className="flex-row justify-between space-x-4">
      {/* Quick Guide Tile */}
      <TouchableOpacity className="bg-secondary flex-1 p-5 rounded-xl shadow-md" onPress={() => router.push("/user/QuickGuide")}>
        <Text className="text-white text-lg font-psemibold">Quick Guide</Text>
      </TouchableOpacity>

      {/* Recents Tile */}
      <TouchableOpacity className="bg-secondary flex-1 p-5 rounded-xl shadow-md" onPress={() => router.push("/user/recents")}>
        <Text className="text-white text-lg font-psemibold">Recents</Text>
      </TouchableOpacity>
    </View>

    {/* Recently Connected Section */}
    <View className="mt-10">
      <EmptyState
        title="Recently Connected to"
        subtitle={areaCodeName ? areaCodeName : "Unknown Area"}
        className="mt-4"
      />
    </View>
  </SafeAreaView>
);
};

export default Home;
