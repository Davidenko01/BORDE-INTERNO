import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function LoginScreen() {
  const { login } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email) {
      Alert.alert('Error', 'Ingrese un email');
      return;
    }
    if (!password) {
      Alert.alert('Error', 'Ingrese su contraseña');
      return;
    }
    try {
      await login(email, password);
    } catch (e) {
      alert('Login failed');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-[#251f31] px-6">
      <Text className="text-5xl font-extrabold text-green-400 tracking-widest mb-10 text-center drop-shadow-md">
        BORDE <Text className="text-white">INTERNO</Text>
      </Text>
      <View className="bg-[#333751] w-full rounded-2xl p-6 shadow-lg max-w-md">
        <Text className="text-3xl font-bold text-center text-[#09e984] mb-6">
          Iniciar Sesión
        </Text>

        <TextInput
          className="p-4 rounded-xl mb-4 text-black bg-[#534b6b] shadow-lg"
          placeholder="Email"
          placeholderTextColor="#dae9e2"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="p-4 rounded-xl mb-6 text-black bg-[#534b6b] shadow-lg"
          placeholder="Contraseña"
          placeholderTextColor="#dae9e2"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-[#09e984] p-4 rounded-xl mb-4 shadow-lg"
          onPress={handleLogin}
        >
          <Text className="text-black text-center font-bold text-lg">
            Entrar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text className="text-center text-[#09e984] font-medium">
            ¿No tenés cuenta? <Text className="underline">Registrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}