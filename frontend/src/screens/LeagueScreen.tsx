import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { TeamRow } from "../components/tableRow";
import { LigaCompleta } from "../types/ligaCompleta";
import NavBar from "../components/navBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";

async function fetchLeagueData(id: number): Promise<LigaCompleta> {
  const response = await fetch(
    `http://192.168.0.97:3001/api/tablas/?liga=${id}`
  );
  if (!response.ok) throw new Error("Error al cargar los datos de la liga");
  return response.json();
}

export default function LeagueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { id } = route.params as { id: number };

  // Consulta para los datos de la liga
  const {
    data: league,
    isLoading,
    error,
  } = useQuery<LigaCompleta>({
    queryKey: ["league", id],
    queryFn: () => fetchLeagueData(id),
  });

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

  if (!league) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">No se encontraron datos</Text>
      </View>
    );
  }
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar/>
      <ScrollView className="flex-1 p-2" contentContainerStyle={{ paddingBottom: 12 }}>
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="mr-4 p-2 active:bg-green-100 rounded-full"
          >
            <ArrowLeft size={24} className="text-gray-800" />
          </TouchableOpacity>

          <View className="flex-row items-center">
            {league.emblem && (
              <Image
                source={{ uri: league.emblem }}
                className="w-20 h-20 mr-4"
                resizeMode="contain"
              />
            )}
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {league.name}
              </Text>
              <Text className="text-gray-600">Tabla de Posiciones</Text>
            </View>
          </View>
        </View>

        <ScrollView horizontal className="bg-white rounded-xl shadow-md overflow-hidden">
          <View>
            <View className="flex-row bg-gray-50 py-3 px-4">
              <Text className="w-10 text-sm text-left text-gray-600">Pos</Text>
              <Text className="w-40 text-sm text-left text-gray-600">Equipo</Text>
              <Text className="w-10 text-sm text-center text-gray-600">PJ</Text>
              <Text className="w-10 text-sm text-center text-gray-600">G</Text>
              <Text className="w-10 text-sm text-center text-gray-600">E</Text>
              <Text className="w-10 text-sm text-center text-gray-600">P</Text>
              <Text className="w-10 text-sm text-center text-gray-600">GF</Text>
              <Text className="w-10 text-sm text-center text-gray-600">GC</Text>
              <Text className="w-10 text-sm text-center text-gray-600">DG</Text>
              <Text className="w-12 text-sm text-center font-semibold text-gray-600">
                Pts
              </Text>
            </View>

            {league?.tabla?.map((team) => (
              <TouchableOpacity key={team.team.id} onPress={() => navigation.navigate("Matches", { teamId: team.team.id, competitionId: id })}>
                <TeamRow
                  position={team.position}
                  team={{
                    id: team.team.id,
                    name: team.team.shortName,
                    logo: team.team.crest,
                  }}
                  points={team.points}
                  played={team.playedGames}
                  won={team.won}
                  drawn={team.draw}
                  lost={team.lost}
                  goalsFor={team.goalsFor}
                  goalsAgainst={team.goalsAgainst}
                  goalsDiff={team.goalDifference}
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
}
