import React from "react";
import { SafeAreaView, Text, ScrollView, StyleSheet, View } from "react-native";
import { FontAwesome5 } from '@expo/vector-icons'; // For icons
import { useRouter } from "expo-router";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

const QuickGuide = () => {
    const router=useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Quick Guide</Text>
        
        <View style={styles.section} >
          <FontAwesome5 name="wifi" size={24} color="#9333ea" style={styles.icon} />
          <Text style={styles.title} onPress={() => router.push("/components/EmptyState")} >1. Connect to a Network <FontAwesome5 name="mouse-pointer" style={styles.icon} size={14}/></Text>
          <Text style={styles.content} >
            - Scan the <Text style={styles.highlight} onPress={() => router.push("/connectnetwork/ScanQRCode")}>QR code</Text> or enter the <Text style={styles.highlight} onPress={() => router.push("/connectnetwork/EnterAreaCode")}>area code</Text> to connect.{"\n"}
            - The QR code can be found in <Text style={styles.highlight}>nearby public places</Text>.
          </Text>
        </View>
        
        <View style={styles.section}  >
          <FontAwesome5 name="upload" size={24} color="#9333ea" style={styles.icon} />
          <Text style={styles.title} onPress={() => router.push("/(tabs)/create")} >2. Upload Missing Person Details </Text>
          <Text style={styles.content}>
            - Go to the <Text style={styles.highlight} onPress={() => router.push("/(tabs)/create")}>Upload Tab</Text>.{"\n"}
            - Record a video of the missing person’s <Text style={styles.highlight}>face only</Text>.{"\n"}
            - Fill in the required details and submit.
          </Text>
        </View>
        
        <View style={styles.section}  >
          <FontAwesome5 name="user" size={24} color="#9333ea" style={styles.icon} />
          <Text style={styles.title} onPress={() => router.push("/user/recents")} >3. Recent Missing Submission History and Status <FontAwesome5 name="mouse-pointer" style={styles.icon} size={14}/></Text>
          <Text style={styles.content}>
            - Visit the <Text style={styles.highlight} onPress={() => router.push("/user/recents")}>Recents</Text>tab to view your recent missing submission history and status.{"\n"}
          </Text>
        </View>

        <View style={styles.section} >
          <FontAwesome5 name="bell" size={24} color="#9333ea" style={styles.icon} />
          <Text style={styles.title} onPress={() => router.push("/(tabs)/notification")} >4. Notifications & Updates <FontAwesome5 name="mouse-pointer" style={styles.icon} size={14}/></Text>
          <Text style={styles.content}>
            - Check the <Text style={styles.highlight} onPress={() => router.push("/(tabs)/notification")}>Notifications Tab</Text> for updates.{"\n"}
            - Two sections:{"\n"}
            &nbsp;  • <Text style={styles.highlight}>Admin Messages</Text>: Updates from the admin.{"\n"}
            &nbsp;  • <Text style={styles.highlight}>Status Updates</Text>: Report status updates.
          </Text>
        </View>
        
        <View style={styles.section}  >
          <FontAwesome5 name="user" size={24} color="#9333ea" style={styles.icon} />
          <Text style={styles.title} onPress={() => router.push("/(tabs)/profile")} >5. Profile Management <FontAwesome5 name="mouse-pointer" style={styles.icon} size={14}/></Text>
          <Text style={styles.content}>
            - Visit the <Text style={styles.highlight} onPress={() => router.push("/(tabs)/profile")}>Profile Tab</Text> to view your account.{"\n"}
            - Change your <Text style={styles.highlight}>profile picture</Text> if needed.
          </Text>
        </View>
        
        <Text style={styles.footer}>Stay connected and help in finding missing persons effectively!</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0E0E23",
    padding: 20,
    paddingTop:20,
  },
  header: {
    paddingTop:20,
    fontSize: 28,
    fontWeight: "bold",
    color: "#e0e0e0",
    textAlign: "center",
    marginBottom: 30,
  },
  section: {
    backgroundColor: "#1F1F39",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  icon: {
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#EEEEEE",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    color: "#A5A5A5",
    lineHeight: 24,
  },
  highlight: {
    color: "#9333ea",
    fontWeight: "bold",
  },
  footer: {
    fontSize: 16,
    color: "#9333ea",
    textAlign: "center",
    marginTop: 20,
  },
});

export default QuickGuide;
