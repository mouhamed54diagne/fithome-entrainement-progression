import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  Target, 
  Activity, 
  Dumbbell, 
  HeartPulse, 
  Zap, 
  Check, 
  LogOut, 
  Scale, 
  Ruler, 
  Flame, 
  Copy, 
  CheckCheck,
  Sparkles,
  ArrowLeft
} from 'lucide-react';
import { UserProfileData } from '../firebase';

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&auto=format&fit=crop&q=80',
];

interface ProfileScreenProps {
  onBackToHome: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ onBackToHome }) => {
  const { profile, updateProfile, logout, isGuest, firestoreConnected } = useAuth();

  const [displayName, setDisplayName] = useState<string>(profile?.displayName || '');
  const [photoURL, setPhotoURL] = useState<string>(profile?.photoURL || '');
  const [level, setLevel] = useState<UserProfileData['fitnessLevel']>(profile?.fitnessLevel || 'beginner');
  const [goal, setGoal] = useState<UserProfileData['goal']>(profile?.goal || 'general_health');
  const [targetDays, setTargetDays] = useState<number>(profile?.weeklyTargetDays || 3);
  const [weightKg, setWeightKg] = useState<string>(profile?.weightKg ? String(profile.weightKg) : '');
  const [heightCm, setHeightCm] = useState<string>(profile?.heightCm ? String(profile.heightCm) : '');
  
  const [saving, setSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [copiedUid, setCopiedUid] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setPhotoURL(profile.photoURL || '');
      setLevel(profile.fitnessLevel || 'beginner');
      setGoal(profile.goal || 'general_health');
      setTargetDays(profile.weeklyTargetDays || 3);
      setWeightKg(profile.weightKg ? String(profile.weightKg) : '');
      setHeightCm(profile.heightCm ? String(profile.heightCm) : '');
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const parsedWeight = weightKg ? parseFloat(weightKg) : undefined;
      const parsedHeight = heightCm ? parseFloat(heightCm) : undefined;

      await updateProfile({
        displayName: displayName.trim() || 'FitHome Athlete',
        photoURL: photoURL.trim(),
        fitnessLevel: level,
        goal: goal,
        weeklyTargetDays: targetDays,
        weightKg: !isNaN(Number(parsedWeight)) ? parsedWeight : undefined,
        heightCm: !isNaN(Number(parsedHeight)) ? parsedHeight : undefined,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Profile save error:', err);
    } finally {
      setSaving(false);
    }
  };

  const copyUidToClipboard = () => {
    if (profile?.uid) {
      navigator.clipboard?.writeText(profile.uid);
      setCopiedUid(true);
      setTimeout(() => setCopiedUid(false), 2000);
    }
  };

  // BMI Calculation if weight and height are provided
  const weight = parseFloat(weightKg);
  const height = parseFloat(heightCm) / 100;
  const bmi = weight > 0 && height > 0 ? (weight / (height * height)).toFixed(1) : null;

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return { label: 'Underweight', color: 'text-amber-400' };
    if (bmiVal < 25) return { label: 'Normal weight', color: 'text-emerald-400' };
    if (bmiVal < 30) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Attention advised', color: 'text-rose-400' };
  };

  const goals = [
    { id: 'weight_loss', label: 'Weight Loss', desc: 'Burn calories & high-energy cardio', icon: Flame },
    { id: 'muscle_gain', label: 'Muscle Building', desc: 'Strength, core & functional tone', icon: Dumbbell },
    { id: 'endurance', label: 'Endurance & Stamina', desc: 'Aerobic fitness & HIIT circuits', icon: Activity },
    { id: 'flexibility', label: 'Mobility & Recovery', desc: 'Stretching, active recovery & posture', icon: HeartPulse },
    { id: 'general_health', label: 'Health & Vitality', desc: 'Stay active, agile & energized', icon: Zap },
  ] as const;

  const levels = [
    { id: 'beginner', label: 'Beginner', desc: 'Gentle workout pace (0-1 session/week)' },
    { id: 'intermediate', label: 'Intermediate', desc: 'Regular training (2-3 sessions/week)' },
    { id: 'advanced', label: 'Advanced', desc: 'High intensity & challenge (4+ sessions/week)' },
  ] as const;

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top Mobile Bar Header */}
      <View className="px-5 pt-3 pb-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 flex-row items-center justify-between">
        <TouchableOpacity 
          onPress={onBackToHome}
          className="flex-row items-center gap-1.5 p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-slate-300" />
          <Text className="text-xs font-semibold text-slate-300">Back</Text>
        </TouchableOpacity>

        <Text className="text-sm font-bold text-white">Profile & Preferences</Text>

        <TouchableOpacity
          onPress={() => logout()}
          className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
        </TouchableOpacity>
      </View>

      {/* Main Profile Scrollable Body */}
      <ScrollView className="flex-1 px-5 py-4 space-y-5">
        {/* Success Toast */}
        {saveSuccess && (
          <View className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex-row items-center gap-2">
            <CheckCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <Text className="text-xs font-semibold text-emerald-300">
              Profile updated and synchronized with Cloud Firestore!
            </Text>
          </View>
        )}

        {/* Hero Profile Card */}
        <View className="p-5 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-850 border border-slate-800 shadow-xl space-y-4">
          <View className="flex-row items-center gap-4">
            <View className="relative">
              {photoURL ? (
                <Image
                  source={{ uri: photoURL }}
                  alt={displayName}
                  className="w-16 h-16 rounded-full ring-4 ring-emerald-500/30 object-cover"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-slate-800 border-2 border-emerald-500/50 items-center justify-center">
                  <UserIcon className="w-8 h-8 text-emerald-400" />
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </View>

            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="text-base font-extrabold text-white" numberOfLines={1}>
                  {displayName || 'FitHome Athlete'}
                </Text>
              </View>
              
              <View className="flex-row items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <Text className="text-xs text-slate-400 truncate max-w-[190px]">
                  {profile?.email || 'guest@fithome.app'}
                </Text>
              </View>

              <View className="flex-row items-center gap-2 mt-2">
                <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <Text className="text-[10px] font-semibold text-emerald-400">
                    {isGuest ? 'Guest Mode' : 'Firebase Verified'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Avatar Chooser */}
          <View className="pt-3 border-t border-slate-800/80">
            <Text className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Choose Avatar
            </Text>
            <View className="flex-row items-center gap-2">
              {AVATAR_PRESETS.map((url, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setPhotoURL(url)}
                  className={`p-0.5 rounded-full border-2 transition-all ${
                    photoURL === url ? 'border-emerald-400 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image source={{ uri: url }} className="w-9 h-9 rounded-full object-cover" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Editable Personal Identity */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Text className="text-xs font-bold text-white uppercase tracking-wider flex-row items-center gap-2">
            Personal Information
          </Text>

          <View className="space-y-1.5">
            <Text className="text-[11px] text-slate-400">Full Name / Display Name</Text>
            <View className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus-within:border-emerald-500 transition-colors">
              <TextInput
                value={displayName}
                onChangeText={setDisplayName}
                placeholder="Enter your name or nickname"
                placeholderTextColor="#64748b"
                className="text-xs text-white w-full"
              />
            </View>
          </View>
        </View>

        {/* Fitness Goal Selection */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Primary Fitness Goal
            </Text>
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          </View>

          <View className="space-y-2">
            {goals.map((g) => {
              const Icon = g.icon;
              const isSelected = goal === g.id;
              return (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setGoal(g.id)}
                  className={`w-full flex-row items-center justify-between p-3 rounded-2xl border transition-all ${
                    isSelected 
                      ? 'bg-emerald-500/15 border-emerald-500/60' 
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <View className="flex-row items-center gap-3">
                    <View className={`p-2 rounded-xl ${isSelected ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </View>
                    <View>
                      <Text className={`text-xs font-bold ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {g.label}
                      </Text>
                      <Text className="text-[10px] text-slate-400">{g.desc}</Text>
                    </View>
                  </View>
                  {isSelected && <Check className="w-4 h-4 text-emerald-400" />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fitness Level & Frequency */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <Text className="text-xs font-bold text-white uppercase tracking-wider">
            Fitness Level & Frequency
          </Text>

          {/* Level */}
          <View className="space-y-1.5">
            <Text className="text-[11px] text-slate-400">Current Fitness Level</Text>
            <View className="flex-row gap-2">
              {levels.map((l) => {
                const isSelected = level === l.id;
                return (
                  <TouchableOpacity
                    key={l.id}
                    onPress={() => setLevel(l.id)}
                    className={`flex-1 py-2.5 px-2 rounded-xl border items-center justify-center transition-all ${
                      isSelected 
                        ? 'bg-emerald-500 border-emerald-400 shadow-sm' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Text className={`text-xs font-bold ${isSelected ? 'text-slate-950' : 'text-slate-300'}`}>
                      {l.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Frequency target per week */}
          <View className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[11px] text-slate-400">Weekly Workout Sessions Target</Text>
              <View className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Text className="text-xs font-bold text-emerald-400">{targetDays} sessions</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1.5">
              {[2, 3, 4, 5, 6].map((num) => (
                <TouchableOpacity
                  key={num}
                  onPress={() => setTargetDays(num)}
                  className={`flex-1 py-2 rounded-xl border items-center justify-center transition-all ${
                    targetDays === num 
                      ? 'bg-emerald-500 border-emerald-400' 
                      : 'bg-slate-950 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <Text className={`text-xs font-bold ${targetDays === num ? 'text-slate-950' : 'text-slate-300'}`}>
                    {num}d
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Physical Metrics (Weight & Height for BMI) */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-bold text-white uppercase tracking-wider">
              Body Metrics & BMI (Optional)
            </Text>
            <Scale className="w-3.5 h-3.5 text-teal-400" />
          </View>

          <View className="flex-row gap-3">
            {/* Weight */}
            <View className="flex-1 space-y-1">
              <Text className="text-[11px] text-slate-400">Weight (kg)</Text>
              <View className="flex-row items-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
                <Scale className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <TextInput
                  value={weightKg}
                  onChangeText={setWeightKg}
                  placeholder="e.g. 72"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  className="text-xs text-white w-full"
                />
              </View>
            </View>

            {/* Height */}
            <View className="flex-1 space-y-1">
              <Text className="text-[11px] text-slate-400">Height (cm)</Text>
              <View className="flex-row items-center px-3 py-2 rounded-xl bg-slate-950 border border-slate-800">
                <Ruler className="w-3.5 h-3.5 text-slate-400 mr-2" />
                <TextInput
                  value={heightCm}
                  onChangeText={setHeightCm}
                  placeholder="e.g. 178"
                  placeholderTextColor="#64748b"
                  keyboardType="numeric"
                  className="text-xs text-white w-full"
                />
              </View>
            </View>
          </View>

          {/* BMI Result Card */}
          {bmi && (
            <View className="mt-2 p-3 rounded-xl bg-slate-950 border border-slate-800 flex-row items-center justify-between">
              <View>
                <Text className="text-[10px] text-slate-400 uppercase">Body Mass Index (BMI)</Text>
                <Text className="text-sm font-black text-white">{bmi} kg/m²</Text>
              </View>
              <View className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800">
                <Text className={`text-xs font-bold ${getBmiCategory(parseFloat(bmi)).color}`}>
                  {getBmiCategory(parseFloat(bmi)).label}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Cloud Firestore & Security Diagnostics */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <Text className="text-xs font-bold text-white uppercase tracking-wider">
            Firebase Security & Cloud Sync
          </Text>

          <View className="text-[11px] bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2 font-mono">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-400 text-xs">Cloud Status:</Text>
              <Text className="text-emerald-400 font-bold text-xs">
                {firestoreConnected ? 'Connected & Online ✓' : 'Initialized ✓'}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-slate-400 text-xs">Firebase UID:</Text>
              <TouchableOpacity 
                onPress={copyUidToClipboard}
                className="flex-row items-center gap-1.5 text-slate-300 hover:text-white"
              >
                <Text className="text-slate-300 text-[11px] font-mono truncate max-w-[140px]">
                  {profile?.uid}
                </Text>
                {copiedUid ? (
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Save Button */}
        <View className="pt-2 pb-6">
          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all disabled:opacity-60 flex-row items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            {saving ? (
              <>
                <ActivityIndicator size="small" color="#020617" />
                <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                  Saving to Firestore...
                </Text>
              </>
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4 text-slate-950" />
                <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                  Profile Updated!
                </Text>
              </>
            ) : (
              <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                Save My Profile
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
