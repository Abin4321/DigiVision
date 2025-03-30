import { useState } from "react";
import { router } from "expo-router";
import { View, Text, Image, Modal, TouchableOpacity } from "react-native";
import { images } from "../constants";
import CustomButton from "./CustomButton";

const EmptyState = ({ title, subtitle }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleConnect = () => {
    setModalVisible(true);
  };

  return (
    <View className="flex justify-center items-center px-4">
      <Image
        source={images.empty}
        resizeMode="contain"
        className="w-[270px] h-[216px]"
      />

      <Text className="text-sm font-pmedium text-gray-100">{title}</Text>
      <Text className="text-xl text-center font-psemibold text-white mt-2">
        {subtitle}
      </Text>

      <CustomButton
        title="Connect with New Network"
        handlePress={handleConnect}
        containerStyles="w-full my-5"
      />

      {/* Modal for Options */}
      {modalVisible && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
            <View className="bg-white rounded-lg p-6 w-80">
              <Text className="text-lg font-psemibold text-center mb-4">
                Choose an option
              </Text>

              {/* Option to scan through camera */}
              <TouchableOpacity
                className="bg-secondary-300 p-4 rounded-lg mb-4"
                onPress={() => {
                  setModalVisible(false);
                  router.push("/connectnetwork/ScanQRCode"); // Navigate to the scan QR code screen
                }}
              >
                <Text className="text-white text-center">Scan QR Code</Text>
              </TouchableOpacity>

              {/* Option to enter URL */}
              <TouchableOpacity
                className="bg-secondary-300 p-4 rounded-lg"
                onPress={() => {
                  setModalVisible(false);
                  router.push("/connectnetwork/EnterAreaCode"); 
                }}
              >
                <Text className="text-white text-center">Enter Area Code</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default EmptyState;
