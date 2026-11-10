/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MobileFrame } from './components/MobileFrame';
import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { Flame } from 'lucide-react';

function FitnessAppContent() {
  const { user, isGuest, loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center p-6 bg-slate-950">
        <View className="w-16 h-16 rounded-3xl bg-emerald-500/15 border border-emerald-500/30 items-center justify-center animate-bounce">
          <Flame className="w-8 h-8 text-emerald-400 fill-emerald-400" />
        </View>
        <Text className="mt-4 text-sm font-semibold text-slate-300">Starting FitHome...</Text>
        <Text className="text-xs text-slate-400 mt-1">Connecting to Firebase Cloud Services</Text>
        <ActivityIndicator size="small" color="#10b981" className="mt-4" />
      </View>
    );
  }

  if (user || isGuest) {
    return <HomeScreen />;
  }

  return <AuthScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <MobileFrame>
        <FitnessAppContent />
      </MobileFrame>
    </AuthProvider>
  );
}
