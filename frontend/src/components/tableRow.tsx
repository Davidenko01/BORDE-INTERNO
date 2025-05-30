import React from 'react';
import { View, Text, Image } from 'react-native';
import { TeamRowProps } from '../types/row';

export const TeamRow = ({
  position,
  team,
  points,
  played,
  won,
  drawn,
  lost,
  goalsFor,
  goalsAgainst,
  goalsDiff,
}: TeamRowProps) => {

    const goalDiffColor = goalsDiff > 0 ? 'text-green-600' : goalsDiff < 0 ? 'text-red-600' : 'text-gray-800';
  return (
    <View className="flex-row border-t border-gray-100 bg-white px-2 py-3">
      <View className="w-12 justify-center items-center">
        <Text className="font-semibold text-gray-800">{position}</Text>
      </View>

      <View className="w-40 flex-row items-center">
        <Image source={{ uri: team.logo }} className="w-6 h-6 mr-2" resizeMode="contain" />
        <Text className="font-medium text-gray-800">{team.name}</Text>
      </View>

      <Text className="w-10 text-center text-gray-700">{played}</Text>
      <Text className="w-10 text-center text-gray-700">{won}</Text>
      <Text className="w-10 text-center text-gray-700">{drawn}</Text>
      <Text className="w-10 text-center text-gray-700">{lost}</Text>
      <Text className="w-10 text-center text-gray-700">{goalsFor}</Text>
      <Text className="w-10 text-center text-gray-700">{goalsAgainst}</Text>
      <View className="w-12 items-center">
        <Text className={`font-medium ${goalDiffColor}`}>
          {goalsDiff > 0 ? '+' : ''}
          {goalsDiff}
        </Text>
      </View>
      <Text className="w-12 text-center font-semibold text-gray-800">{points}</Text>
    </View>
  );
};