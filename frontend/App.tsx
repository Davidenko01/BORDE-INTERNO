import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
import "./global.css";

export default function App() {
  return (
    <AuthProvider>  
      <AppNavigator />
    </AuthProvider>
  );
}