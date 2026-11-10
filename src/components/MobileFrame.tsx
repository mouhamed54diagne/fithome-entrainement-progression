import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Smartphone, Monitor, Wifi, Battery, Signal } from 'lucide-react';

interface MobileFrameProps {
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({ children }) => {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);
  const currentTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <View className="min-h-screen bg-slate-950 items-center justify-start p-2 sm:p-4 selection:bg-emerald-500 selection:text-white">
      {/* Top Device Bar Switcher */}
      <View className="w-full max-w-md mb-3 flex-row items-center justify-between px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 backdrop-blur-md">
        <View className="flex-row items-center gap-2">
          <View className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <Text className="font-semibold text-slate-300 text-xs">FitHome Mobile</Text>
        </View>
        <View className="flex-row items-center gap-1 bg-slate-800 p-0.5 rounded-full">
          <TouchableOpacity
            onPress={() => setIsMobileMode(true)}
            className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
              isMobileMode ? 'bg-emerald-500 shadow-sm' : ''
            }`}
          >
            <Smartphone className={`w-3.5 h-3.5 ${isMobileMode ? 'text-slate-950' : 'text-slate-400'}`} />
            <Text className={`text-xs font-semibold ${isMobileMode ? 'text-slate-950' : 'text-slate-400'}`}>Mobile</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setIsMobileMode(false)}
            className={`flex-row items-center gap-1 px-2.5 py-1 rounded-full ${
              !isMobileMode ? 'bg-emerald-500 shadow-sm' : ''
            }`}
          >
            <Monitor className={`w-3.5 h-3.5 ${!isMobileMode ? 'text-slate-950' : 'text-slate-400'}`} />
            <Text className={`text-xs font-semibold ${!isMobileMode ? 'text-slate-950' : 'text-slate-400'}`}>Full View</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Container */}
      <View
        className={`w-full transition-all duration-300 overflow-hidden ${
          isMobileMode
            ? 'max-w-[410px] h-[844px] rounded-[44px] border-[8px] border-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] bg-slate-950 relative ring-1 ring-slate-700/50'
            : 'max-w-2xl min-h-[750px] rounded-3xl border border-slate-800 shadow-2xl bg-slate-950'
        }`}
      >
        {/* iOS-style Top Status Bar (Only in Mobile Frame) */}
        {isMobileMode && (
          <View className="w-full pt-3 px-7 pb-2 flex-row items-center justify-between text-[13px] select-none z-30">
            <Text className="text-slate-300 font-semibold text-xs">{currentTime}</Text>
            <View className="w-28 h-4 bg-slate-900 rounded-full mx-auto -mt-1 items-center justify-center">
              <View className="w-2.5 h-2.5 rounded-full bg-slate-950" />
            </View>
            <View className="flex-row items-center gap-1.5">
              <Signal className="w-3.5 h-3.5 text-slate-400" />
              <Wifi className="w-3.5 h-3.5 text-slate-400" />
              <Battery className="w-4 h-4 text-emerald-400" />
            </View>
          </View>
        )}

        {/* Content Area */}
        <View className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {children}
        </View>

        {/* Mobile Bottom Home Indicator */}
        {isMobileMode && (
          <View className="w-full py-2 items-center justify-center bg-slate-950/80 backdrop-blur-sm z-30">
            <View className="w-32 h-1 bg-slate-700 rounded-full" />
          </View>
        )}
      </View>
    </View>
  );
};
