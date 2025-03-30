import { useEffect, useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Image, Text, TouchableOpacity, Alert, StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import { supabase } from "../../lib/supabase";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const [profilePhoto, setProfilePhoto] = useState(user?.profile_photo_url || null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.id) return;
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("profile_photo_url")
          .eq("id", user.id)
          .single();

        if (error) throw new Error(error.message);
        if (data) {
          setUser((prevUser) => ({
            ...prevUser,
            profile_photo_url: data.profile_photo_url,
          }));
          setProfilePhoto(data.profile_photo_url);
        }
      } catch (error) {
        Alert.alert("Error", "Could not fetch profile information.");
      }
    };

    fetchUserProfile();
  }, [user, setUser]);

  const pickProfilePhoto = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedPhoto = result.assets[0].uri;
      setProfilePhoto(selectedPhoto);
      uploadProfilePhoto(selectedPhoto);
    }
  };

  const uploadProfilePhoto = async (selectedPhoto) => {
    if (!selectedPhoto) return;
    const fileExtension = selectedPhoto.split(".").pop();
    const fileName = `profile_${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("Profile_pic")
      .upload(fileName, {
        uri: selectedPhoto,
        type: `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`,
      });

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }

    const { data: publicURLData, error: urlError } = supabase.storage
      .from("Profile_pic")
      .getPublicUrl(fileName);

    if (urlError) {
      Alert.alert("Error", urlError.message);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ profile_photo_url: publicURLData.publicUrl })
      .eq("id", user.id);

    if (updateError) {
      Alert.alert("Error", updateError.message);
      return;
    }

    setUser((prevUser) => ({
      ...prevUser,
      profile_photo_url: publicURLData.publicUrl,
    }));
  };

  const logout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "OK", onPress: handleLogout },
    ]);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLogged(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileContainer}>
        
        {/* Logout Button */}
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Image source={icons.logout} style={styles.logoutIcon} />
        </TouchableOpacity>

        {/* Profile Photo */}
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: profilePhoto || "https://via.placeholder.com/150",
            }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.label}>Profile Photo</Text>

        {/* Change Profile Button */}
        <TouchableOpacity onPress={pickProfilePhoto} style={styles.button}>
          <Text style={styles.buttonText}>Change Profile Photo</Text>
        </TouchableOpacity>

        {/* User Details */}
        <View style={styles.detailsCard}>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userDetail}>📧 {user?.email}</Text>
          <Text style={styles.userDetail}>📞 {user?.phone}</Text>
          <Text style={styles.userDetail}>📍 {user?.place}</Text>
          <Text style={styles.userDetail}>📌 {user?.pincode}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E23", // Dark Background
    alignItems: "center",
    paddingTop: 20,
  },
  profileContainer: {
    alignItems: "center",
    width: "90%",
  },
  logoutButton: {
    alignSelf: "flex-end",
    padding: 10,
  },
  logoutIcon: {
    width: 24,
    height: 24,
    tintColor: "#9333ea",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "#9333ea",
    marginBottom: 10,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  label: {
    fontSize: 18,
    color: "#EEE",
    fontWeight: "600",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#9333ea",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
  detailsCard: {
    width: "100%",
    backgroundColor: "#1F1F39",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8, // For Android shadow
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#9333ea",
    marginBottom: 10,
  },
  userDetail: {
    fontSize: 16,
    color: "#A5A5A5",
    marginVertical: 3,
  },
});

export default Profile;
