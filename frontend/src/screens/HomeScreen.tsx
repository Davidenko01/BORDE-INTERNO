import React from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { Liga } from "../types/liga";
import LigaCard from "../components/ligaCard";
import NavBar from "../components/navBar";
import { DIR_IP_API } from '@env'; 

const fetchLigas = async (): Promise<Liga[]> => {
  const res = await fetch(`http://${DIR_IP_API}/api/ligas`);
  if (!res.ok) throw new Error("Error al obtener las ligas");
  return res.json();
};

export default function HomeScreen() {
  const { data: ligas, isLoading, error } = useQuery<Liga[]>({
    queryKey: ["ligas"],
    queryFn: fetchLigas,
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar/>
      <ScrollView className="px-4">
        <Text className="mx-4 mt-7 text-3xl leading-none font-extrabold text-green-800 text-center">BIENVENIDO A</Text>
        <Text className="mx-4 text-3xl font-extrabold leading-none text-black text-center mb-4">BORDE INTERNO</Text>

        <Text className="text-black text-base leading-6 text-center mb-5 mx-2">
          Para los amantes del fútbol y los verdaderos apasionados. Nos especializamos en brindarte{" "}
          <Text className="text-green-800 font-semibold">tablas</Text>,{" "}
          <Text className="text-blue-800 font-semibold">resultados</Text> y{" "}
          <Text className="text-red-800 font-semibold">estadísticas</Text> en tiempo real de las principales ligas del mundo.
        </Text>

        <Text className="text-2xl font-bold text-gray-800 mt-2 mb-5">Nuestras Ligas</Text>
        {isLoading && <ActivityIndicator size="large" color="#00FF00" />}
        {error && <Text className="text-red-400">Error al cargar las ligas</Text>}
        <View className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ligas?.map((liga) => (
            <LigaCard key={liga.id} liga={liga} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
