import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import MatchCard from "../components/MatchCard";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Partidos } from "../types/partido";
import NavBar from "../components/navBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { DIR_IP_API } from "@env";

async function fetchMatchData(
  teamId: number,
  competitionId: number,
): Promise<Partidos> {
  const response = await fetch(
    `http://${DIR_IP_API}/api/partidos/?liga=${competitionId}&equipo=${teamId}`,
  );
  if (!response.ok) throw new Error("Error al cargar los datos de la liga");
  return response.json();
}

async function fetchProximosPartidos(teamId: number, ligaId: number) {
  const response = await fetch(
   `http://${DIR_IP_API}/api/partidos/proximos?equipo_id=${teamId}`
  );
  if (!response.ok) throw new Error("Error al cargar próximos partidos");
  return response.json();
}


type TabOption = "jugados" | "proximos";

export default function TeamMatchesScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute();
  const { teamId, competitionId } = route.params as {
    teamId: number;
    competitionId: number;
  };

  const [activeTab, setActiveTab] = useState<TabOption>("jugados");


  //Solicitud API externa
  const {data: matchesData,isLoading,isError,error,} = useQuery({
    queryKey: ["teamMatches", teamId, competitionId],
    queryFn: () => fetchMatchData(teamId, competitionId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  //Solicitud info local
  const { data: proximosData, isLoading: isLoadingProximos } = useQuery({
    queryKey: ["proximosPartidos", teamId, competitionId],
    queryFn: () => fetchProximosPartidos(teamId, competitionId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
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

  const allMatches = matchesData?.matches || [];
  const team = matchesData?.team;
  const competition = matchesData?.competition;
  // Extraemos los partidos anidados dentro del arreglo "ligas"
  const proximos = proximosData?.ligas?.[0]?.partidos || [];

  // Filtrar partidos según el tab activo
  const now = new Date();
  const filteredMatches = allMatches.filter((match) => {
    const matchDate = new Date(match.date);
    return activeTab === "jugados"
      ? matchDate < now
      : matchDate >= now;
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar />


      <View className="flex-row bg-white border-b border-gray-200 px-4 pt-4">
        <TouchableOpacity
          onPress={() => setActiveTab("jugados")}
          className={`flex-1 items-center pb-4 border-b-2 ${
            activeTab === "jugados"? "border-gray-700": "border-transparent"}`}>
          <Text className={`font-semibold text-sm ${activeTab === "jugados" ? "text-gray-700" : "text-gray-400"}`}>
            Partidos jugados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab("proximos")}
          className={`flex-1 items-center pb-4 border-b-2 ${activeTab === "proximos" ? "border-gray-700": "border-transparent"}`}>
          <Text className={`font-semibold text-sm ${activeTab === "proximos" ? "text-gray-700" : "text-gray-400"}`}>
            Próximos partidos
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="bg-white border-b border-gray-200 px-2 py-4">
          <Text className="text-2xl font-bold text-gray-900 text-center">
            {activeTab === "jugados" ? "Partidos" : "Próximos partidos"} - {team || "Team"}
          </Text>
          <Text className="text-sm text-gray-600 text-center mt-1">
            {competition || "Competition"} • {filteredMatches.length} partidos
          </Text>
        </View>

        {/* Lista de partidos */}
        <View className="py-4">
          {activeTab === "jugados" && filteredMatches.length === 0 && (
            <View className="flex-1 items-center mt-10">
              <Text className="text-gray-400 text-base">
                No hay partidos jugados
              </Text>
            </View>
          )}

          {activeTab === "proximos" && proximos.length === 0 && (
            <View className="flex-1 items-center mt-10">
              <Text className="text-gray-400 text-base">
                No hay próximos partidos
              </Text>
            </View>
          )}

          {activeTab === "jugados" && filteredMatches.map((match, index) => (
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

          {activeTab === "proximos" && proximos.map((match: any, index: number) => (
              <View key={match.partido_id || index} className="mb-4">
                <MatchCard
                  homeTeam={{
                    name: match.equipo_local?.nombre,
                    logo: match.equipo_local?.escudo,
                    goals: null as any,
                  }}
                  awayTeam={{
                    name: match.equipo_visitante?.nombre,
                    logo: match.equipo_visitante?.escudo,
                    goals: null as any,
                  }}
                  date={match.fecha}
                />
              </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}