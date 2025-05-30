import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Liga } from "../types/liga";
import { Trophy } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

type Props = {
  liga: Liga;
};

const LigaCard: React.FC<Props> = ({ liga }) => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  return (
  <TouchableOpacity 
  className="relative bg-white rounded-xl shadow-md overflow-hidden transition-transform hover:scale-105"
  onPress={() => navigation.navigate("League", { id: liga.id })}
  >
      <View className= "h-[8px] w-full bg-black"/>
      <View className="p-4" >
        <View className="flex flex-row items-center space-x-4">
          {liga.emblem ? (
            <Image
              source={{ uri: liga.emblem }}
              className="w-12 h-12"
              resizeMode="contain"
            />
          ) : (
            <View 
              className="w-12 h-12 rounded-full flex items-center justify-center bg-black">
              <Trophy size={24} className="text-gray-700" />
            </View>
          )}
          <View className="ml-4">
            <Text className="font-bold text-gray-800">{liga.name}</Text>
            <Text className="text-sm text-gray-600">{liga.country}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default LigaCard;
