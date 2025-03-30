import React, { useState } from "react";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Alert, ScrollView, Button, Image } from "react-native";
import { supabase } from "../../lib/supabase";
import { CustomButton, FormField } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";
import * as ImagePicker from "expo-image-picker";
import { Video as ExpoVideo } from "expo-av"; // Import ExpoVideo for video playback

const Create = () => {
  const { user } = useGlobalContext();
  const [uploading, setUploading] = useState(false); // For submit button
  const [image, setImage] = useState(null); // Image URI state
  const [video, setVideo] = useState(null); // Video URI state

  const [form, setForm] = useState({
    name: "",
    age: "",
    identificationMark: "",
    timeOfMissing: "",
    placeOfMissing: ""
  });

  // Function to handle image picking
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1], // Square aspect ratio
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri); // Set the selected image URI
    }
  };

  // Function to handle video picking
  const pickVideo = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access media library is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setVideo(result.assets[0].uri); // Set the selected video URI
    }
  };

  const uploadFile = async (uri, fileType) => {
    const fileExtension = uri.split(".").pop(); // Get the file extension
    const fileName = `${user.id}_${Date.now()}.${fileExtension}`; // Unique file name

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(fileType === 'image' ? 'missing-person-photos' : 'missing-person-videos')
      .upload(fileName, {
        uri,
        type: fileType === 'image' ? `image/${fileExtension}` : `video/${fileExtension}`,
      });

    if (error) {
      throw error; // Throw error if upload fails
    }

    return data.path; // Return the path of the uploaded file
  };

  const submit = async () => {
    if (
      form.name === "" ||
      form.age === "" ||
      form.identificationMark === "" ||
      form.timeOfMissing === "" ||
      form.placeOfMissing === "" 
    ) {
      return Alert.alert("Please provide all fields");
    }

    setUploading(true);
    try {
      const currentTime = new Date().toISOString();

      // Upload the image and get the URI
      const photoUri = image ? await uploadFile(image, 'image') : null;
      // Upload the video and get the URI
      const videoUri = video ? await uploadFile(video, 'video') : null;

      const { error } = await supabase
        .from("missing_person_reports")
        .insert({
          user_id: user.id, // Automatically upload current user's ID
          name: form.name,
          age: parseInt(form.age, 10),
          identification_mark: form.identificationMark,
          time_of_missing: form.timeOfMissing,
          place_of_missing: form.placeOfMissing,
          photo_url: photoUri, // Upload the selected image URI
          video_url: videoUri, // Upload the selected video URI
          report_time: currentTime,
          status:false,
          area_code:user.area_code,
        });

      if (error) throw error;
      Alert.alert("Success", "Report submitted successfully");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setUploading(false);
      setForm({
        name: "",
        age: "",
        identificationMark: "",
        timeOfMissing: "",
        placeOfMissing: "",
      });
      setImage(null); // Clear image after submission
      setVideo(null); // Clear video after submission
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 my-6">
        <Text className="text-2xl text-white font-semibold">Report Missing Person</Text>

        <FormField
          title="Name of Missing Person"
          value={form.name}
          placeholder="Enter name..."
          handleChangeText={(e) => setForm({ ...form, name: e })}
          otherStyles="mt-10"
        />

        <FormField
          title="Age"
          value={form.age}
          placeholder="Enter age..."
          handleChangeText={(e) => setForm({ ...form, age: e })}
          otherStyles="mt-4"
          keyboardType="numeric"
        />

        <FormField
          title="Identification Mark"
          value={form.identificationMark}
          placeholder="Identification mark..."
          handleChangeText={(e) => setForm({ ...form, identificationMark: e })}
          otherStyles="mt-4"
        />

        <FormField
          title="Time of Missing"
          value={form.timeOfMissing}
          placeholder="Enter time (HH:MM)..."
          handleChangeText={(e) => setForm({ ...form, timeOfMissing: e })}
          otherStyles="mt-4"
        />

        <FormField
          title="Place of Missing"
          value={form.placeOfMissing}
          placeholder="Enter place..."
          handleChangeText={(e) => setForm({ ...form, placeOfMissing: e })}
          otherStyles="mt-4"
        />


        {/* Upload Photo */}
        <View className="mt-7 space-y-2">
          <Text className="text-lg font-bold text-gray-800">Upload Photo</Text>
          <View className="w-full h-48 bg-gray-200 rounded-2xl flex justify-center items-center shadow-md">
            {image ? (
              <Image source={{ uri: image }} className="w-full h-full rounded-2xl" />
            ) : (
              <Text className="text-sm text-gray-500">No photo selected</Text>
            )}
          </View>
          <Button title="Pick an image from gallery" onPress={pickImage} color="#007BFF" />
        </View>

        {/* Upload Video */}
        <View className="mt-7 space-y-2">
          <Text className="text-lg font-bold text-gray-800">Upload Video</Text>
          <View className="w-full h-48 bg-gray-200 rounded-2xl flex justify-center items-center shadow-md">
            {video ? (
              <ExpoVideo
                source={{ uri: video }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
                isLooping
                shouldPlay
              />
            ) : (
              <Text className="text-sm text-gray-500">No video selected</Text>
            )}
          </View>
          <Button title="Pick a video from gallery" onPress={pickVideo} color="#28A745" />
        </View>


        <CustomButton
          title="Submit Report"
          handlePress={submit}
          containerStyles="mt-7"
          isLoading={uploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
