import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import SideNav from "./SideNav";
import { useAuth } from "../context/AuthContext";

export default function NavBar() {
  const [isSideNavOpen, setIsSideNavOpen] = useState<boolean>(false);
  const { logout } = useAuth();
  

  const toggleSideNav = (): void => {
    setIsSideNavOpen(!isSideNavOpen);
  };

  const closeSideNav = (): void => {
    setIsSideNavOpen(false);
  };

  const handleSignOut = async (): Promise<void> => {
    closeSideNav();
    try {
      await logout();
    } catch (error) {
      
    }
  };

  return (
    <>
      <View className="bg-black px-4 py-3 flex-row items-center justify-between w-full relative z-10">
        <Text className="text-white text-xl font-bold text-center flex-1">
          BORDE INTERNO
        </Text>
        
        <TouchableOpacity 
          className="absolute right-4 p-2 rounded-full active:bg-gray-800"
          onPress={toggleSideNav}
          activeOpacity={0.7}
        >
          <Ionicons 
            name={isSideNavOpen ? "close" : "menu"} 
            size={24} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <SideNav 
        isOpen={isSideNavOpen}
        onClose={closeSideNav}
        onSignOut={handleSignOut}
      />
    </>
  );
}