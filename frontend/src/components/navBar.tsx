import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function NavBar() {
  const navigation = useNavigation();

  return (
    <View className="bg-black px-4 py-3 flex-row items-center justify-between w-full">
      <Text className="text-white text-xl font-bold text-center flex-1">BORDE INTERNO</Text>
      <TouchableOpacity className="absolute right-4">
        <Ionicons name="menu" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}
