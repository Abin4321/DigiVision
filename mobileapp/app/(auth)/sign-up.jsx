import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { TouchableOpacity,View, Text, ScrollView, Dimensions, Alert, Image,Button } from "react-native";
import * as ImagePicker from "expo-image-picker"; // Image Picker
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { supabase } from "../../lib/supabase"; // Import Supabase client
import { useGlobalContext } from "../../context/GlobalProvider";

const SignUp = () => {
  
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(null);
  

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    place: "",
    pincode: "",
    profile_photo_url: "", // Optional, could be a file upload URL later
  });

  // Function to handle profile photo picking
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
      setProfilePhoto(result.assets[0].uri); // Set the selected photo URI
    }
  };

  // Function to upload profile photo
  const uploadProfilePhoto = async () => {
    if (!profilePhoto) return null;

    const fileExtension = profilePhoto.split(".").pop();
    const fileName = `profile_${Date.now()}.${fileExtension}`;

    const { data, error } = await supabase.storage
      .from("Profile_pic")
      .upload(fileName, {
        uri: profilePhoto,
        type: `image/${fileExtension === 'png' ? 'png' : 'jpeg'}`, // Handle JPEG and PNG types
      });

    if (error) {
      Alert.alert("Error", error.message);
      throw error;
    }

// Construct the public URL for the uploaded image
const { data:publicURLData, error: urlError } = supabase.storage
.from("Profile_pic")
.getPublicUrl(fileName);

if (urlError) {
Alert.alert("Error", urlError.message);
throw urlError;
}

return publicURLData.publicUrl; // Return the public URL of the uploaded photo

    
  };


  const submit = async () => {
    if (
      form.name === "" ||
      form.email === "" ||
      form.password === "" ||
      form.phone === "" ||
      form.place === "" ||
      form.pincode === "" 
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);

    try {

// Upload profile photo and get the URL
const profilePhotoPath = await uploadProfilePhoto();
if (profilePhotoPath) {
  form.profile_photo_url = profilePhotoPath; // Set profile photo URL in form
}

      // Sign up user with email and password
      const { error, data } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (error) {
        Alert.alert("Error", error.message);
        return;
      }

      const { user } = data;

      // Insert the additional profile information in the profiles table
      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id, // Link profile to the user id
        name: form.name,
        email: form.email,
        phone: form.phone,
        place: form.place,
        pincode: form.pincode,
        profile_photo_url: form.profile_photo_url, // You can handle image upload separately
      });

      if (profileError) {
        Alert.alert("Error", profileError.message);
      } else {
        Alert.alert("Success", "Please check your inbox for email verification!");
        router.replace("/sign-in");
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

//   return (
//     <SafeAreaView className="bg-primary h-full">
//       <ScrollView>
//         <View
//           className="w-full flex items-center px-4 py-6"
//           style={{
//             minHeight: Dimensions.get("window").height - 100,
//           }}
//         >
//            <Image
//             source={images.logo}
//             resizeMode="contain"
//             className="w-[355px] h-[184px]"
//           /> 

//           <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
//             Sign Up to <Text className="text-secondary-300"> DigiVision </Text>
//           </Text>

//           {/* Profile Photo Upload Section */}
//           <View className="mt-7 space-y-4 items-center">
//   <Text className="text-lg font-bold text-gray-400">Upload Profile Photo</Text>
//   <View className="relative">
//     {/* Circular/Oval Frame */}
//     <View className="w-20 h-20 bg-gray-200 rounded-full overflow-hidden flex justify-center items-center shadow-md">
//       {profilePhoto ? (
//         <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
//       ) : (
//         <Text className="text-sm text-gray-500">No photo selected</Text>
//       )}
//     </View>
//     {/* "+" Button */}
//     <TouchableOpacity
//       onPress={pickProfilePhoto}
//       className="absolute bottom-0 right-0 bg-blue-500 w-10 h-10 rounded-full flex justify-center items-center shadow-lg"
//     >
//       <Text className="text-white text-xl font-bold">+</Text>
//     </TouchableOpacity>
//   </View>
// </View>


//           <FormField
//             title="Name"
//             value={form.name}
//             handleChangeText={(e) => setForm({ ...form, name: e })}
//             otherStyles="mt-7"
//           />

//           <FormField
//             title="Email"
//             value={form.email}
//             handleChangeText={(e) => setForm({ ...form, email: e })}
//             otherStyles="mt-7"
//             keyboardType="email-address"
//           />

//           <FormField
//             title="Password"
//             value={form.password}
//             handleChangeText={(e) => setForm({ ...form, password: e })}
//             otherStyles="mt-7"
//             secureTextEntry={true}
//           />

//           <FormField
//             title="Phone"
//             value={form.phone}
//             handleChangeText={(e) => setForm({ ...form, phone: e })}
//             otherStyles="mt-7"
//             keyboardType="phone-pad"
//           />

//           <FormField
//             title="Place"
//             value={form.place}
//             handleChangeText={(e) => setForm({ ...form, place: e })}
//             otherStyles="mt-7"
//           />

//           <FormField
//             title="Pincode"
//             value={form.pincode}
//             handleChangeText={(e) => setForm({ ...form, pincode: e })}
//             otherStyles="mt-7"
//             keyboardType="numeric"
//           />

         

          

          

//           <CustomButton
//             title="Sign Up"
//             handlePress={submit}
//             containerStyles="mt-7"
//             isLoading={isSubmitting}
//           />

//           <View className="flex justify-center pt-5 flex-row gap-2">
//             <Text className="text-lg text-gray-100 font-pregular">
//               Have an account already?
//             </Text>
//             <Link
//               href="/sign-in"
//               className="text-lg font-psemibold text-secondary-300"
//             >
//               Login
//             </Link>
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

return (
  <SafeAreaView className="bg-primary h-full">
    <ScrollView>
      <View className="w-full flex items-center px-4 py-10">
        <Image source={images.logo} resizeMode="contain" className="w-[250px] h-[120px]" />

        <Text className="text-2xl font-semibold text-white mt-6">
          Sign Up to <Text className="text-secondary-300">DigiVision</Text>
        </Text>

        {/* Profile Photo Upload */}
        <View className="mt-6 items-center">
          <Text className="text-lg font-semibold text-gray-400">Upload Profile Photo</Text>
          <TouchableOpacity onPress={pickProfilePhoto} className="mt-3">
            <View className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden shadow-md border-2 border-gray-500">
              {profilePhoto ? (
                <Image source={{ uri: profilePhoto }} className="w-full h-full" resizeMode="cover" />
              ) : (
                <Text className="text-gray-500 text-center pt-9">No Photo</Text>
              )}
            </View>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View className="w-full max-w-[350px] mt-6 space-y-4">
          <FormField title="Name" value={form.name} handleChangeText={(e) => setForm({ ...form, name: e })} />
          <FormField title="Email" value={form.email} handleChangeText={(e) => setForm({ ...form, email: e })} keyboardType="email-address" />

          <FormField title="Password" value={form.password} handleChangeText={(e) => setForm({ ...form, password: e })} otherStyles="mt-7"  />

          <FormField title="Phone" value={form.phone} handleChangeText={(e) => setForm({ ...form, phone: e })} keyboardType="phone-pad" />
          <FormField title="Place" value={form.place} handleChangeText={(e) => setForm({ ...form, place: e })} />
          <FormField title="Pincode" value={form.pincode} handleChangeText={(e) => setForm({ ...form, pincode: e })} keyboardType="numeric" />
        </View>

        {/* Sign-Up Button */}
        <CustomButton title="Sign Up" handlePress={submit} containerStyles="mt-7 w-full max-w-[300px]" isLoading={isSubmitting} />

        {/* Already have an account? */}
        <View className="flex flex-row gap-2 mt-5">
          <Text className="text-lg text-gray-100">Have an account already?</Text>
          <Link href="/sign-in" className="text-lg font-semibold text-secondary-300">
            Login
          </Link>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default SignUp;