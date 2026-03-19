import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert, Platform, Modal, FlatList, ActivityIndicator, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import NavBar from "../components/navBar";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQuery } from "@tanstack/react-query";
import { DIR_IP_API } from "@env";
import { Liga } from "../types/liga";
import { LigaCompleta } from "../types/ligaCompleta";

const fetchLigas = async (): Promise<Liga[]> => {
  const res = await fetch(`http://${DIR_IP_API}/api/ligas`);
  if (!res.ok) throw new Error("Error al obtener las ligas");
  return res.json();
};

const fetchTeamsByLeague = async (ligaId: number): Promise<LigaCompleta> => {
  const res = await fetch(`http://${DIR_IP_API}/api/tablas/?liga=${ligaId}`);
  if (!res.ok) throw new Error("Error al cargar los equipos");
  return res.json();
};

export default function CreateMatchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  
  // Estados para el formulario
  const [selectedLeagueId, setSelectedLeagueId] = useState<number | null>(null);
  const [selectedLeagueName, setSelectedLeagueName] = useState("");

  const [homeTeamId, setHomeTeamId] = useState<number | null>(null);
  const [homeTeamName, setHomeTeamName] = useState("");

  const [awayTeamId, setAwayTeamId] = useState<number | null>(null);
  const [awayTeamName, setAwayTeamName] = useState("");

  const [matchDate, setMatchDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [modalVisible, setModalVisible] = useState<'league' | 'home' | 'away' | null>(null);

  // Consultas a la API
  const { data: ligas, isLoading: isLoadingLigas } = useQuery<Liga[]>({
    queryKey: ["ligas"],
    queryFn: fetchLigas,
  });

  const { data: leagueData, isLoading: isLoadingTeams } = useQuery<LigaCompleta>({
    queryKey: ["leagueTeams", selectedLeagueId],
    queryFn: () => fetchTeamsByLeague(selectedLeagueId!),
    enabled: !!selectedLeagueId, // Solo se ejecuta si hay una liga seleccionada
  });

  // Extraemos la lista de equipos limpiando la respuesta de la tabla
  const teams = leagueData?.tabla?.map(t => t.team) || [];

  const onChangeDate = (event: any, selectedDate?: Date) => {
    // En Android, el calendario se cierra automáticamente, en iOS lo cerramos manualmente tras elegir
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (event.type === "set" && selectedDate) {
      setDate(selectedDate);
      // Formateamos la fecha a DD/MM/YYYY
      const day = String(selectedDate.getDate()).padStart(2, '0');
      const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
      const year = selectedDate.getFullYear();
      
      setMatchDate(`${day}/${month}/${year}`);
      
      if (Platform.OS === 'ios') {
        setShowPicker(false);
      }
    } else if (event.type === "dismissed") {
      setShowPicker(false);
    }
  };

  const createMatch = async () => {
    if (!selectedLeagueId || !homeTeamId || !awayTeamId || !matchDate) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    
    if (homeTeamId === awayTeamId) {
      Alert.alert("Error", "El equipo local y visitante no pueden ser el mismo.");
      return;
    }

    // Reiniciamos las horas a 0 para comparar únicamente las fechas (días)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(date);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj <= today) {
      Alert.alert("Error", "La fecha del partido debe ser posterior a la fecha actual.");
      return;
    }

    try {
      // Petición POST a tu backend para guardar el partido
      console.log("Datos del partido a crear:", {
        leagueId: selectedLeagueId,
        homeTeamId,
        awayTeamId,
        matchDate
      });
      
      Alert.alert("Éxito", "Partido creado correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Hubo un problema al crear el partido.");
    }
  };

  // Función para renderizar el contenido dinámico del Modal (Ligas o Equipos)
  const renderModalContent = () => {
    const isLeagueModal = modalVisible === 'league';
    const listData = isLeagueModal ? ligas : teams;
    const isLoading = isLeagueModal ? isLoadingLigas : isLoadingTeams;

    return (
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-2/3 p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              {isLeagueModal ? 'Selecciona una Liga' : 'Selecciona un Equipo'}
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(null)}>
              <Text className="text-red-500 font-bold text-base">Cerrar</Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator size="large" color="#3B82F6" className="mt-4" />
          ) : (
            <FlatList
              data={listData}
              keyExtractor={(item: any) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }: { item: any }) => {
                const itemName = isLeagueModal ? item.name : item.shortName;
                return (
                  <TouchableOpacity 
                    className="p-4 border-b border-gray-100 flex-row items-center"
                    onPress={() => {
                      if (isLeagueModal) {
                        setSelectedLeagueId(item.id);
                        setSelectedLeagueName(itemName);
                        // Limpiar equipos al cambiar de liga
                        setHomeTeamId(null);
                        setHomeTeamName("");
                        setAwayTeamId(null);
                        setAwayTeamName("");
                      } else if (modalVisible === 'home') {
                        setHomeTeamId(item.id);
                        setHomeTeamName(itemName);
                      } else if (modalVisible === 'away') {
                        setAwayTeamId(item.id);
                        setAwayTeamName(itemName);
                      }
                      setModalVisible(null);
                    }}
                  >
                    {!isLeagueModal && item.crest && (
                      <Image source={{ uri: item.crest }} className="w-8 h-8 mr-4" resizeMode="contain" />
                    )}
                    <Text className="text-lg text-gray-800">{itemName}</Text>
                  </TouchableOpacity>
                );
              }}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <NavBar />
      <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
        <Text className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Crear Próximo Partido
        </Text>

        <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <Text className="text-gray-700 font-medium mb-2">Liga</Text>
          <TouchableOpacity 
            className="bg-gray-100 p-4 rounded-xl mb-4"
            onPress={() => setModalVisible('league')}
          >
            <Text className={selectedLeagueName ? "text-gray-900" : "text-gray-400"}>
              {selectedLeagueName || "Seleccionar Liga"}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-700 font-medium mb-2">Equipo Local</Text>
          <TouchableOpacity 
            className="bg-gray-100 p-4 rounded-xl mb-4"
            onPress={() => {
              if (!selectedLeagueId) Alert.alert("Aviso", "Primero selecciona una liga.");
              else setModalVisible('home');
            }}
          >
            <Text className={homeTeamName ? "text-gray-900" : "text-gray-400"}>
              {homeTeamName || "Seleccionar Equipo Local"}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-700 font-medium mb-2">Equipo Visitante</Text>
          <TouchableOpacity 
            className="bg-gray-100 p-4 rounded-xl mb-4"
            onPress={() => {
              if (!selectedLeagueId) Alert.alert("Aviso", "Primero selecciona una liga.");
              else setModalVisible('away');
            }}
          >
            <Text className={awayTeamName ? "text-gray-900" : "text-gray-400"}>
              {awayTeamName || "Seleccionar Equipo Visitante"}
            </Text>
          </TouchableOpacity>

          <Text className="text-gray-700 font-medium mb-2">Fecha del Partido</Text>
          <TouchableOpacity 
            className="bg-gray-100 p-4 rounded-xl mb-8"
            onPress={() => setShowPicker(true)}
          >
            <Text className={matchDate ? "text-gray-900" : "text-gray-400"}>
              {matchDate || "Seleccionar en el calendario"}
            </Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={date}
              mode="date" // fuerza el modo grilla-calendario
              display="default"
              minimumDate={new Date()} //Restriccion fecha
              onChange={onChangeDate}
            />
          )}

          <TouchableOpacity
            className="bg-green-500 p-4 rounded-xl items-center shadow-sm"
            onPress={createMatch}
          >
            <Text className="text-white font-bold text-lg">Guardar Partido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal 
        visible={!!modalVisible} 
        animationType="slide" 
        transparent={true} 
        onRequestClose={() => setModalVisible(null)}
      >
        {renderModalContent()}
      </Modal>
    </SafeAreaView>
  );
}