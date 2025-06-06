import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute } from '@react-navigation/native';
import MatchCard from '../components/MatchCard';
import { RootStackParamList } from '../navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Partidos } from '../types/partido';
import NavBar from '../components/navBar';
import { SafeAreaView } from "react-native-safe-area-context";
import { DIR_IP_API } from '@env'; 

async function fetchMatchData(teamId: number, competitionId: number): Promise<Partidos> {
  console.log("fetching matches");
  const response = await fetch(
    `http://${DIR_IP_API}/api/partidos/?liga=${competitionId}&equipo=${teamId}`
  );
  if (!response.ok) throw new Error("Error al cargar los datos de la liga");
  return response.json();
}

export default function TeamMatchesScreen() {    
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { teamId, competitionId } = route.params as {teamId: number, competitionId: number};
  const [displayedMatches, setDisplayedMatches] = useState(10);

  // Fetch Partidos del equipo en la competición
  const {
    data: matchesData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['teamMatches', teamId, competitionId],
    queryFn: () => fetchMatchData(teamId, competitionId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  //Cuando se pulsa el boton de cargar mas
  const handleLoadMore = () => {
    setDisplayedMatches(prev => Math.min(prev + 5, matchesData?.matches?.length || 0));
  };

if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Cargando datos...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">Error: {error.message}</Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 p-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const matches = matchesData?.matches || [];
  const team = matchesData?.team;
  const competition = matchesData?.competition;
  const visibleMatches = matches.slice(0, displayedMatches);
  const hasMoreMatches = displayedMatches < matches.length;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-white border-b border-gray-200 px-2 py-4">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            Partidos - {team || 'Team'}
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-1">
            {competition || 'Competition'} • {matches.length} matches
          </Text>
        </View>
        <View className="py-4">
          {visibleMatches.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">No matches found</Text>
              <Text className="text-gray-400 text-sm mt-2">
                No hay partidos de este equipo para esta competición.
              </Text>
            </View>
          ) : (
            <>
              {visibleMatches.map((match, index) => (
                <View key={match.id || index} className="mb-4">
                  <MatchCard
                    homeTeam={{
                      name: match.homeTeam.shortName,
                      logo: match.homeTeam.crest,
                      goals: match.score.home,
                    }}
                    awayTeam={{
                      name: match.awayTeam.shortName,
                      logo: match.awayTeam.crest,
                      goals: match.score.away,
                    }}
                    date={match.date}
          
                  />
                </View>
              ))}

              {hasMoreMatches && (
                <View className="px-4 py-6">
                  <TouchableOpacity
                    onPress={handleLoadMore}
                    className="bg-blue-500 py-4 rounded-lg shadow-sm"
                    activeOpacity={0.8}
                  >
                    <Text className="text-white text-center font-semibold text-base">
                      Más Partidos ({matches.length - displayedMatches} restantes)
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {!hasMoreMatches && matches.length > 5 && (
                <View className="px-4 py-6">
                  <Text className="text-gray-500 text-center text-sm">
                    No hay más partidos para mostrar.
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};