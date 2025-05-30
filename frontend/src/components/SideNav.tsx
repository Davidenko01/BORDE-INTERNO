import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {SafeAreaView} from 'react-native-safe-area-context';

const { width: screenWidth } = Dimensions.get("window");
const SIDENAV_WIDTH = Math.min(280, screenWidth * 0.8); // Maximo 280px o 80%
const NAVBAR_HEIGHT = 47;

interface MenuItem {
  id: number;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}

interface SideNavProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
}

export default function SideNav({ isOpen, onClose, onSignOut }: SideNavProps) {
  const slideAnim = useRef(new Animated.Value(SIDENAV_WIDTH)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [isVisible, setIsVisible] = useState<boolean>(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SIDENAV_WIDTH,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsVisible(false);
      });
    }
  }, [isOpen, slideAnim, overlayOpacity]);

   if (!isVisible && !isOpen) {
    return null;
  }

  const menuItems: MenuItem[] = [
    { 
      id: 1, 
      title: "Home", 
      icon: "home-outline", 
      onPress: () => console.log("Home pressed") 
    },
    { 
      id: 2, 
      title: "Profile", 
      icon: "person-outline", 
      onPress: () => console.log("Profile pressed") 
    },
    { 
      id: 3, 
      title: "Settings", 
      icon: "settings-outline", 
      onPress: () => console.log("Settings pressed") 
    },
    { 
      id: 4, 
      title: "Help", 
      icon: "help-circle-outline", 
      onPress: () => console.log("Help pressed") 
    },
  ];

  const handleMenuItemPress = (item: MenuItem): void => {
    item.onPress();
    onClose();
  };

  return (
    <SafeAreaView className="absolute inset-0 z-50" pointerEvents={isOpen ? "auto" : "none"}>
      {/* Overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          className="absolute inset-0 bg-black"
          style={{
            opacity: overlayOpacity,
          }}
        />
      </TouchableWithoutFeedback>

      {/* Side Navigation */}
      <Animated.View
        className="absolute right-0 top-0 bottom-0 bg-white shadow-2xl"
        style={{
          width: SIDENAV_WIDTH,
          transform: [{ translateX: slideAnim }],
        }}
      >
        <SafeAreaView className="flex-1">
          {/* Header */}
          <View className="bg-black px-4 border-b border-gray-200" style={{ height: NAVBAR_HEIGHT }}>
            <View className="flex-row items-center justify-between">
              <Text className="text-white text-lg font-bold">Menu</Text>
              <TouchableOpacity
                onPress={onClose}
                className="p-2 rounded-full active:bg-gray-800"
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Menu Content */}
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="py-4">
              <View className="py-2">
                {menuItems.map((item: MenuItem) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center px-4 py-4 active:bg-gray-50"
                    onPress={() => handleMenuItemPress(item)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={item.icon} size={24} color="#6B7280" />
                    <Text className="text-gray-900 text-base font-medium ml-4">
                      {item.title}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Divider */}
              <View className="border-t border-gray-200 my-2" />

              {/* Sign Out */}
              <TouchableOpacity
                className="flex-row items-center px-4 py-4 active:bg-red-50"
                onPress={onSignOut}
                activeOpacity={0.7}
              >
                <Ionicons name="log-out-outline" size={24} color="#EF4444" />
                <Text className="text-red-500 text-base font-medium ml-4">
                  Sign Out
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>

          {/* Footer */}
          <View className="px-4 py-4 border-t border-gray-200">
            <Text className="text-gray-400 text-xs text-center">
              Version 1.0.0
            </Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </SafeAreaView>
  );
}