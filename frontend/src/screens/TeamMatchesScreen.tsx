import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useNavigation, useRoute } from "@react-navigation/native";
import MatchCard from "../components/MatchCard";
import { RootStackParamList } from "../navigation/types";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import NavBar from "../components/navBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { DIR_IP_API } from "@env";

const PAGE_SIZE = 10;

async function fetchMatchData(
  teamId: number,
  competitionId: number,
  page: number,
) {
  const response = await fetch(
    `http://${DIR_IP_API}/api/partidos/?liga=${competitionId}&equipo=${teamId}&page=${page}&limit=${PAGE_SIZE}`,
  );
  if (!response.ok) throw new Error("Error al cargar los datos de la liga");
  return response.json();
}

async function fetchProximosPartidos(teamId: number, ligaId: number) {
  const response = await fetch(
    `http://${DIR_IP_API}/api/partidos/proximos?equipo_id=${teamId}`,
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

  const {
    data: matchesData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["teamMatches", teamId, competitionId],
    queryFn: ({ pageParam = 1 }) =>
      fetchMatchData(teamId, competitionId, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const { data: proximosData, isLoading: isLoadingProximos } = useQuery({
    queryKey: ["proximosPartidos", teamId, competitionId],
    queryFn: () => fetchProximosPartidos(teamId, competitionId),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
  });

  const allMatches = matchesData?.pages.flatMap((p) => p.matches) ?? [];
  const team = matchesData?.pages[0]?.team;
  const competition = matchesData?.pages[0]?.competition;
  const proximos = proximosData?.ligas?.[0]?.partidos ?? [];

  const handleEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  const renderJugado = ({ item: match, index }: { item: any; index: number }) => (
    <View className="mb-4">
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
  );

  const renderProximo = ({ item: match, index }: { item: any; index: number }) => (
    <View className="mb-4">
      <MatchCard
        homeTeam={{
          name: match.equipo_local?.nombre_corto,
          logo: match.equipo_local?.escudo,
          goals: null as any,
        }}
        awayTeam={{
          name: match.equipo_visitante?.nombre_corto,
          logo: match.equipo_visitante?.escudo,
          goals: null as any,
        }}
        date={match.fecha}
      />
    </View>
  );

  const renderFooter = () => {
    if (!isFetchingNextPage) return null;
    return (
      <View className="py-4 items-center">
        <ActivityIndicator size="small" color="#3B82F6" />
        <Text className="text-gray-400 text-sm mt-1">Cargando más...</Text>
      </View>
    );
  };

  const ListHeader = () => (
    <View className="bg-white border-b border-gray-200 px-2 py-4 mb-2">
      <Text className="text-2xl font-bold text-gray-900 text-center">
        {activeTab === "jugados" ? "Partidos" : "Próximos partidos"} -{" "}
        {team ?? "Team"}
      </Text>
      <Text className="text-sm text-gray-600 text-center mt-1">
        {competition ?? "Competition"}
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Cargando datos...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-red-500 text-center">
          Error: {(error as Error).message}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mt-4 p-3 bg-blue-500 rounded-lg"
        >
          <Text className="text-white font-medium">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar />

      <View className="flex-row bg-white border-b border-gray-200 px-4 pt-4">
        {(["jugados", "proximos"] as TabOption[]).map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            className={`flex-1 items-center pb-4 border-b-2 ${
              activeTab === tab ? "border-gray-700" : "border-transparent"
            }`}
          >
            <Text
              className={`font-semibold text-sm ${
                activeTab === tab ? "text-gray-700" : "text-gray-400"
              }`}
            >
              {tab === "jugados" ? "Partidos jugados" : "Próximos partidos"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === "jugados" ? (
        <FlatList
          data={allMatches}
          keyExtractor={(item, index) => String(item.id ?? index)}
          renderItem={renderJugado}
          ListHeaderComponent={ListHeader}
          ListFooterComponent={renderFooter}
          ListEmptyComponent={
            <View className="flex-1 items-center mt-10">
              <Text className="text-gray-400 text-base">No hay partidos jugados</Text>
            </View>
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.3}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={proximos}
          keyExtractor={(item, index) => String(item.partido_id ?? index)}
          renderItem={renderProximo}
          ListHeaderComponent={ListHeader}
          ListEmptyComponent={
            isLoadingProximos
              ? () => <ActivityIndicator className="mt-10" color="#3B82F6" />
              : () => (
                  <View className="flex-1 items-center mt-10">
                    <Text className="text-gray-400 text-base">No hay próximos partidos</Text>
                  </View>
                )
          }
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}