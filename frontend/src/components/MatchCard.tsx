import React from 'react';
import { View, Text, Image } from 'react-native';
import { MatchCardProps } from '../types/partido';

const MatchCard = ({ homeTeam, awayTeam, date }: MatchCardProps) => {
  const homeWins = homeTeam.goals > awayTeam.goals;
  const awayWins = awayTeam.goals > homeTeam.goals;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <View className="bg-white mx-4 rounded-lg shadow-sm border border-gray-200 p-4">
      <View className="flex-row items-center">
        
        {/* Equipo Local */}
        <View className="w-20 relative">
          {/* Barra lateral: Verde ganó, Rojo perdió */}
          {homeWins && (
            <View className="absolute -left-4 top-0 bottom-0 w-1 bg-green-500 rounded-full" />
          )}
          {awayWins && (
            <View className="absolute -left-4 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
          )}
          <View className="items-center">
            <Image
              source={{ uri: homeTeam.logo }}
              className="w-10 h-10 mb-2"
              resizeMode="contain"
            />
            <Text 
              className="text-xs font-semibold text-gray-800 text-center leading-3"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {homeTeam.name}
            </Text>
          </View>
        </View>

        {/* Goles Local */}
        <View className="w-12 items-center">
          <Text className="text-xl font-bold text-gray-900">
            {homeTeam.goals}
          </Text>
        </View>

        {/* Fecha */}
        <View className="flex-1 items-center px-2">
          <Text className="text-xs font-medium text-gray-700 text-center mb-1">
            {formatDate(date)}
          </Text>
          <Text className="text-sm font-semibold text-gray-900">
            {formatTime(date)}
          </Text>
        </View>

        {/* Goles Visitante */}
        <View className="w-12 items-center">
          <Text className="text-xl font-bold text-gray-900">
            {awayTeam.goals}
          </Text>
        </View>

        {/* Equipo Visitante */}
        <View className="w-20 relative">
          {/* Barra lateral: Verde ganó, Rojo perdió */}
          {awayWins && (
            <View className="absolute -right-4 top-0 bottom-0 w-1 bg-green-500 rounded-full" />
          )}
          {homeWins && (
            <View className="absolute -right-4 top-0 bottom-0 w-1 bg-red-500 rounded-full" />
          )}
          <View className="items-center">
            <Image
              source={{ uri: awayTeam.logo }}
              className="w-10 h-10 mb-2"
              resizeMode="contain"
            />
            <Text 
              className="text-xs font-semibold text-gray-800 text-center leading-3"
              numberOfLines={2}
              ellipsizeMode="tail"
            >
              {awayTeam.name}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default MatchCard;