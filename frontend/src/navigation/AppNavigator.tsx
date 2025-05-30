import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import LeagueScreen from '../screens/LeagueScreen';
import { RootStackParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TeamMatchesScreen from '../screens/TeamMatchesScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

//Configura y maneja las queries y caché
const queryClient = new QueryClient();

export default function AppNavigator() {
  const { userToken } = useAuth();

  return (
    // Permite el uso de React Query
    <QueryClientProvider client={queryClient}>
      {/* Permite la navegación entre pantallas */}
      <NavigationContainer>
        {/* Define la estructura de navegación tipo pila */}
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken ? (
             <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="League" component={LeagueScreen} />
            <Stack.Screen name="Matches" component={TeamMatchesScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}