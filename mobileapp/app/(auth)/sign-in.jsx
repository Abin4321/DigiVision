import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";
import { supabase } from "../../lib/supabase"; // Import Supabase client
import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
  
    setSubmitting(true);
  
    try {
      // Sign in user
      const { error, data } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      });
  
      if (error) {
        Alert.alert("Error", error.message);
        return;
      }
  
      const { user } = data;
  
      // Fetch user profile from the profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
  
      if (profileError) {
        Alert.alert("Error", profileError.message);
      } else {
        setUser(profile); // Store the user profile
        setIsLogged(true);
        Alert.alert("Success", "User signed in successfully");
        router.replace("/home");
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
//           className="w-full flex justify-center h-full px-4 my-6"
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
//             Log in to <Text className="text-secondary-300">DigiVision</Text>
//           </Text>

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
//           />

//           <CustomButton
//             title="Sign In"
//             handlePress={submit}
//             containerStyles="mt-7"
//             isLoading={isSubmitting}
//           />

//           <View className="flex justify-center pt-5 flex-row gap-2">
//             <Text className="text-lg text-gray-100 font-pregular">
//               Don't have an account?
//             </Text>
//             <Link
//               href="/sign-up"
//               className="text-lg font-psemibold text-secondary-300"
//             >
//               Signup
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
      <View className="w-full flex items-center px-6 py-12">
        <Image source={images.logo} resizeMode="contain" className="w-[250px] h-[120px]" />

        <Text className="text-2xl font-semibold text-white mt-6">
          Log in to <Text className="text-secondary-300">DigiVision</Text>
        </Text>

        {/* Form Fields */}
        <View className="w-full max-w-[350px] mt-6 space-y-4">
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            keyboardType="email-address"
          />

<FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />
        </View>

        {/* Sign-In Button */}
        <CustomButton
          title="Sign In"
          handlePress={submit}
          containerStyles="mt-7 w-full max-w-[300px]"
          isLoading={isSubmitting}
        />

        {/* Sign-Up Option */}
        <View className="flex flex-row gap-2 mt-5">
          <Text className="text-lg text-gray-100">Don't have an account?</Text>
          <Link href="/sign-up" className="text-lg font-semibold text-secondary-300">
            Sign up
          </Link>
        </View>
      </View>
    </ScrollView>
  </SafeAreaView>
);
};

export default SignIn;
