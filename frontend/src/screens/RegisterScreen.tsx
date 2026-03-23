import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

interface Errors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterScreen() {
  const { register } = useAuth();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [registerError, setRegisterError] = useState('');

  const validate = (): boolean => {
    const newErrors: Errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      newErrors.email = 'Ingrese un email';
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Ingrese un formato de email válido';
    }

    if (!password) {
      newErrors.password = 'Ingrese una contraseña';
    } else if (password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = 'Debe contener al menos una mayúscula';
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = 'Debe contener al menos un número';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      newErrors.password = 'Debe contener al menos un carácter especial (!@#$...)';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmá tu contraseña';
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    setRegisterError('');
    if (!validate()) return;
    try {
      await register(email, password);
    } catch (e) {
      setRegisterError('Error al registrarse. Intentá de nuevo.');
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

        {/* Email */}
        <TextInput
          className={`p-4 rounded-xl text-white bg-[#534b6b] shadow-lg ${errors.email ? 'border border-red-400' : 'mb-4'}`}
          placeholder="Email"
          placeholderTextColor="#dae9e2"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          autoCapitalize="none"
        />
        {errors.email && (
          <Text className="text-red-400 text-sm mt-1 mb-3 ml-1">{errors.email}</Text>
        )}

        {/* Contraseña */}
        <TextInput
          className={`p-4 rounded-xl text-white bg-[#534b6b] shadow-lg ${errors.password ? 'border border-red-400' : 'mb-4'}`}
          placeholder="Contraseña"
          placeholderTextColor="#dae9e2"
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
          }}
          secureTextEntry
        />
        {errors.password && (
          <Text className="text-red-400 text-sm mt-1 mb-3 ml-1">{errors.password}</Text>
        )}

        {/* Confirmar Contraseña */}
        <TextInput
          className={`p-4 rounded-xl text-white bg-[#534b6b] shadow-lg ${errors.confirmPassword ? 'border border-red-400' : 'mb-6'}`}
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#dae9e2"
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
          }}
          secureTextEntry
        />
        {errors.confirmPassword && (
          <Text className="text-red-400 text-sm mt-1 mb-5 ml-1">{errors.confirmPassword}</Text>
        )}

        <TouchableOpacity
          className="bg-[#09e984] p-4 rounded-xl mb-4 shadow-lg"
          onPress={handleRegister}
        >
          <Text className="text-black text-center font-bold text-lg">Registrarse</Text>
        </TouchableOpacity>

        {registerError && (
          <Text className="text-red-400 text-sm text-center mb-3">{registerError}</Text>
        )}

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text className="text-center text-[#09e984] font-medium">
            ¿Ya tenés cuenta? <Text className="underline">Iniciá sesión</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}