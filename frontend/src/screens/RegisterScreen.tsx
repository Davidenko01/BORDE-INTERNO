import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('ERROR', 'Por favor completá todos los campos.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('ERROR', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      await register(email, password);
    } catch (e) {
      alert('Register failed');
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-purple-950 px-6">
      <Text className="text-5xl font-extrabold text-green-400 tracking-widest mb-10 text-center drop-shadow-md">
        BORDE <Text className="text-white">INTERNO</Text>
      </Text>
      <View className="bg-[#333751] w-full rounded-2xl p-6 shadow-lg max-w-md">
        <Text className="text-3xl font-bold text-center text-[#09e984] mb-6">
          Registro
        </Text>

        <TextInput
          className="p-4 rounded-xl mb-4 text-white bg-[#534b6b] shadow-lg"
          placeholder="Email"
          placeholderTextColor="#dae9e2"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          className="p-4 rounded-xl mb-4 text-white bg-[#534b6b] shadow-lg"
          placeholder="Contraseña"
          placeholderTextColor="#dae9e2"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TextInput
          className="p-4 rounded-xl mb-6 text-white bg-[#534b6b] shadow-lg"
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#dae9e2"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />
        <TouchableOpacity
          className="bg-[#09e984] p-4 rounded-xl mb-4 shadow-lg"
          onPress={handleRegister}
        >
          <Text className="text-black text-center font-bold text-lg">
            Registrarse
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-center text-[#09e984] font-medium">
            ¿Ya tenés cuenta? <Text className="underline">Iniciá sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}