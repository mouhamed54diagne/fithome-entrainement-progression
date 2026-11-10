import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Dumbbell, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2 
} from 'lucide-react';

export const AuthScreen: React.FC = () => {
  const { loginWithGoogle, loginAsGuest, loading, error, clearError } = useAuth();

  return (
    <View className="flex-1 justify-between p-6 bg-slate-950">
      {/* Brand Header */}
      <View className="pt-2">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-2.5">
            <View className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 items-center justify-center shadow-lg shadow-emerald-500/20">
              <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            </View>
            <View>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-xl font-bold tracking-tight text-white">
                  FitHome
                </Text>
                <Text className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  MOBILE
                </Text>
              </View>
              <Text className="text-xs text-slate-400">Smart Home Fitness & Tracking</Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800/80 border border-slate-700/60">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <Text className="text-[11px] text-slate-300">Firebase</Text>
          </View>
        </View>

        {/* Hero Visual Card */}
        <View className="mt-6 relative rounded-3xl overflow-hidden border border-slate-800 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 p-5 shadow-xl">
          <View className="absolute top-0 right-0 w-36 h-36 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 mb-3 border border-emerald-500/30 self-start">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <Text className="text-xs font-medium text-emerald-300">100% Bodyweight Routines</Text>
          </View>

          <Text className="text-2xl font-extrabold text-white leading-tight">
            Transform your living room into your personal gym.
          </Text>

          <Text className="text-xs text-slate-400 mt-2 leading-relaxed">
            Zero equipment needed, daily interactive workouts, and a personalized training plan adapted to your fitness level.
          </Text>

          {/* Quick value features */}
          <View className="mt-4 flex-row gap-2">
            <View className="flex-1 flex-row items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
              <Dumbbell className="w-4 h-4 text-emerald-400 shrink-0" />
              <Text className="text-slate-300 font-medium text-xs">Guided Workouts</Text>
            </View>
            <View className="flex-1 flex-row items-center gap-2 p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/40">
              <Calendar className="w-4 h-4 text-teal-400 shrink-0" />
              <Text className="text-slate-300 font-medium text-xs">Progress Calendar</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Auth Actions Section */}
      <View className="my-6 space-y-4">
        {error && (
          <View className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex-row items-start justify-between gap-2">
            <View className="flex-row items-start gap-2 flex-1">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <Text className="text-rose-300 text-xs flex-1">{error}</Text>
            </View>
            <TouchableOpacity onPress={clearError}>
              <Text className="text-rose-400 hover:text-white text-xs underline font-semibold ml-1">
                Dismiss
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="space-y-3">
          {/* Google Sign-in Touchable Button */}
          <TouchableOpacity
            onPress={() => loginWithGoogle()}
            disabled={loading}
            className="w-full flex-row items-center justify-center gap-3 py-3.5 px-4 rounded-2xl bg-white shadow-lg active:scale-[0.98] transition-all disabled:opacity-60"
          >
            {loading ? (
              <ActivityIndicator size="small" color="#020617" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <Text className="text-slate-950 font-bold text-sm">
              {loading ? 'Signing in...' : 'Continue with Google'}
            </Text>
          </TouchableOpacity>

          {/* Guest / Fast Preview Touchable Button */}
          <TouchableOpacity
            onPress={() => loginAsGuest()}
            disabled={loading}
            className="w-full flex-row items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-800/90 text-slate-200 border border-slate-700/60 active:scale-[0.98] transition-all"
          >
            <Text className="text-slate-200 font-medium text-xs">Try in Guest Mode</Text>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
          </TouchableOpacity>
        </View>

        {/* Security & Cloud info footer */}
        <View className="pt-2 flex-row items-center justify-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <Text className="text-[11px] text-slate-400">Secure Firebase Cloud Authentication</Text>
        </View>
      </View>

      {/* Footer step hint */}
      <View className="pt-3 border-t border-slate-900 items-center" />
    </View>
  );
};
