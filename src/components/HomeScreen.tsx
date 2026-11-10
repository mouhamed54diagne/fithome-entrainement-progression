import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { ProfileScreen } from './ProfileScreen';
import { TrainingScreen } from './TrainingScreen';
import { CalendarScreen } from './CalendarScreen';
import { ProgramWorkoutPlayer } from './ProgramWorkoutPlayer';
import { WORKOUT_PROGRAMS, DayWorkoutProgram } from '../data/programs';
import { 
  LogOut, 
  Flame, 
  Dumbbell, 
  Calendar as CalendarIcon, 
  Settings, 
  Sparkles, 
  User as UserIcon, 
  Home, 
  ChevronRight,
  Play,
  Layers
} from 'lucide-react';

import { getLocalDateString, getFranceDayOfWeek, getCurrentWeekDates } from '../utils/date';

export const HomeScreen: React.FC = () => {
  const { user, profile, logout, isGuest, workouts, calendarDays, isDayCompleted } = useAuth();
  const [activeTab, setActiveTab] = useState<'home' | 'training' | 'calendar' | 'profile'>('home');
  const [activeProgramDay, setActiveProgramDay] = useState<DayWorkoutProgram | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);

  // Retrieve weekly program according to user's fitness level
  const userLevel = profile?.fitnessLevel || 'intermediate';
  const program = WORKOUT_PROGRAMS[userLevel];

  // Current day of the week (1 = Monday, 7 = Sunday)
  const currentDayOfWeek = useMemo(() => getFranceDayOfWeek(new Date()), []);

  const todayWorkout: DayWorkoutProgram = program.days[currentDayOfWeek - 1] || program.days[0];

  // Check if today's workout has been completed
  const todayStr = getLocalDateString(new Date());
  const isTodayCompleted = isDayCompleted(todayStr);

  // Calculate streak and current week's workout count
  const targetDays = profile?.weeklyTargetDays || (userLevel === 'beginner' ? 3 : 5);
  const now = new Date();
  const currentWeekStart = new Date(now);
  const day = currentDayOfWeek;
  currentWeekStart.setHours(0, 0, 0, 0);
  currentWeekStart.setDate(now.getDate() - day + 1);

  const weekWorkoutsCount = workouts.filter((w) => {
    return new Date(w.completedAt) >= currentWeekStart;
  }).length;

  const datesWithWorkout = new Set(
    workouts.map((w) => (w.completedAt.includes('T') ? w.completedAt.split('T')[0] : w.completedAt))
  );
  Object.entries(calendarDays).forEach(([dStr, dayObj]) => {
    if (dayObj.completed) datesWithWorkout.add(dStr);
  });

  let streak = 0;
  const checkDate = new Date();
  while (true) {
    const dStr = getLocalDateString(checkDate);
    if (datesWithWorkout.has(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (streak === 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (datesWithWorkout.has(getLocalDateString(yesterday))) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 2);
          continue;
        }
      }
      break;
    }
  }

  const handleStartTodayWorkout = () => {
    if (todayWorkout.isRest) {
      setActiveTab('training');
      return;
    }
    setActiveProgramDay(todayWorkout);
    setIsPlayerOpen(true);
  };

  const renderTabContent = () => {
    if (activeTab === 'training') {
      return (
        <TrainingScreen />
      );
    }

    if (activeTab === 'calendar') {
      return (
        <CalendarScreen 
          onNavigateToExercises={() => setActiveTab('training')} 
        />
      );
    }

    if (activeTab === 'profile') {
      return (
        <ProfileScreen 
          onBackToHome={() => setActiveTab('home')} 
        />
      );
    }

    // Default: Home Dashboard
    return (
      <View className="flex-1 justify-between bg-slate-950">
        {/* Top Mobile Bar */}
        <View className="px-5 pt-3 pb-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 flex-row items-center justify-between">
          <TouchableOpacity 
            onPress={() => setActiveTab('profile')}
            className="flex-row items-center gap-3"
          >
            <View className="relative">
              {profile?.photoURL ? (
                <Image
                  source={{ uri: profile.photoURL }}
                  alt={profile.displayName}
                  className="w-10 h-10 rounded-full ring-2 ring-emerald-500/60 object-cover"
                />
              ) : (
                <View className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 items-center justify-center">
                  <Text className="text-slate-300 font-bold">
                    {profile?.displayName?.charAt(0) || <UserIcon className="w-5 h-5 text-slate-400" />}
                  </Text>
                </View>
              )}
              <View className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-slate-900" />
            </View>

            <View>
              <View className="flex-row items-center gap-1.5">
                <Text className="text-sm font-bold text-white max-w-[140px]" numberOfLines={1}>
                  {profile?.displayName || 'Athlete'}
                </Text>
                {isGuest && (
                  <Text className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Demo
                  </Text>
                )}
              </View>
              <View className="flex-row items-center gap-1">
                <View className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <Text className="text-[11px] text-slate-400">
                  {program.levelNameEn} Plan
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <View className="flex-row items-center gap-1.5">
            <TouchableOpacity
              onPress={() => setActiveTab('profile')}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Edit Profile & Preferences"
            >
              <Settings className="w-4 h-4 text-slate-300" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => logout()}
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4 text-rose-400" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Scrollable Dashboard Body */}
        <ScrollView className="flex-1 px-5 py-4 space-y-4">
          {/* TODAY'S SCHEDULED WORKOUT HERO BANNER */}
          <View className="relative rounded-3xl overflow-hidden p-5 bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 shadow-xl shadow-emerald-950/40 space-y-3">
            <View className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl pointer-events-none" />
            
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-1 bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-emerald-300" />
                <Text className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                  Today's Workout • {todayWorkout.dayNameEn}
                </Text>
              </View>

              {isTodayCompleted ? (
                <View className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                  <Text className="text-[10px] font-bold text-slate-950">Completed ✓</Text>
                </View>
              ) : todayWorkout.isRest ? (
                <Text className="text-xs font-semibold text-emerald-200">Rest & Recovery</Text>
              ) : (
                <Text className="text-xs font-semibold text-emerald-100">
                  {todayWorkout.estimatedDurationMinutes} min
                </Text>
              )}
            </View>

            <View>
              <Text className="text-xl font-black tracking-tight leading-tight text-white">
                {todayWorkout.title}
              </Text>
              <Text className="text-xs text-emerald-100/80 mt-1">
                {todayWorkout.shortDescription}
              </Text>
            </View>

            <View className="pt-2 border-t border-white/15 flex-row items-center justify-between">
              <TouchableOpacity
                onPress={handleStartTodayWorkout}
                className="px-3.5 py-2 rounded-xl bg-white shadow-lg active:scale-95 transition-all flex-row items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <Text className="text-slate-950 text-xs font-black uppercase tracking-wider">
                  {todayWorkout.isRest ? 'View Week Plan' : isTodayCompleted ? 'Repeat Session' : 'Start Workout'}
                </Text>
              </TouchableOpacity>

              <View className="flex-row items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-300 fill-amber-300" />
                <Text className="text-xs font-bold text-emerald-100">{streak} {streak === 1 ? 'day' : 'days'} streak</Text>
              </View>
            </View>
          </View>

          {/* 7-DAY WORKOUT SCHEDULE SHORTCUT CARD */}
          <TouchableOpacity
            onPress={() => setActiveTab('training')}
            className="p-4 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-3 shadow-md"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-2xl bg-emerald-500/15 items-center justify-center">
                  <Layers className="w-5 h-5 text-emerald-400" />
                </View>
                <View>
                  <Text className="text-xs font-bold text-white">7-Day Schedule ({program.levelNameEn})</Text>
                  <Text className="text-[10px] text-slate-400">Structured progressive plan</Text>
                </View>
              </View>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </View>

            {/* Quick mini 7-day pill row */}
            <View className="grid grid-cols-7 gap-1 pt-1">
              {program.days.map((d, idx) => {
                const isToday = d.dayOfWeek === currentDayOfWeek;
                const weekDates = getCurrentWeekDates(new Date());
                const dateStr = weekDates[idx];
                const isCompleted = isDayCompleted(dateStr);

                return (
                  <View
                    key={d.dayOfWeek}
                    className={`py-1.5 rounded-xl items-center justify-center border relative ${
                      isCompleted
                        ? 'bg-emerald-500/25 border-emerald-400'
                        : isToday 
                        ? 'bg-emerald-500/20 border-emerald-500/50' 
                        : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    <Text className={`text-[9px] font-bold uppercase ${
                      isCompleted ? 'text-emerald-300' : isToday ? 'text-emerald-400' : 'text-slate-400'
                    }`}>
                      {d.dayNameEn.substring(0, 3)}
                    </Text>
                    {isCompleted && (
                      <View className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-0.5" />
                    )}
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>

          {/* Weekly Progress Tracker Card */}
          <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-emerald-400" />
                <Text className="text-xs font-bold text-white">Weekly Target</Text>
              </View>
              <Text className="text-xs font-bold text-emerald-400">
                {weekWorkoutsCount} / {targetDays} sessions
              </Text>
            </View>

            <View className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <View 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all"
                style={{ width: `${Math.min(100, (weekWorkoutsCount / targetDays) * 100)}%` }}
              />
            </View>

            <View className="flex-row items-center justify-between pt-1">
              <Text className="text-[11px] text-slate-400">
                {weekWorkoutsCount >= targetDays 
                  ? '🎉 Weekly goal achieved!' 
                  : `${Math.max(0, targetDays - weekWorkoutsCount)} more session${targetDays - weekWorkoutsCount > 1 ? 's' : ''} to reach goal`}
              </Text>
              <TouchableOpacity onPress={() => setActiveTab('calendar')}>
                <Text className="text-[11px] font-semibold text-emerald-400">Calendar →</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Workout History */}
          <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold text-white uppercase tracking-wider">
                Recent Completed Workouts
              </Text>
              <TouchableOpacity onPress={() => setActiveTab('calendar')}>
                <Text className="text-[10px] font-semibold text-emerald-400">Full History</Text>
              </TouchableOpacity>
            </View>

            {workouts.length > 0 ? (
              <View className="space-y-2">
                {workouts.slice(0, 3).map((w) => (
                  <View
                    key={w.id}
                    className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex-row items-center justify-between"
                  >
                    <View className="flex-row items-center gap-2.5">
                      <View className="w-7 h-7 rounded-lg bg-emerald-500/15 items-center justify-center">
                        <Dumbbell className="w-3.5 h-3.5 text-emerald-400" />
                      </View>
                      <View>
                        <Text className="text-xs font-bold text-white">{w.exerciseName}</Text>
                        <Text className="text-[10px] text-slate-400">
                          {w.durationMinutes} min • ~{w.caloriesBurned} kcal
                        </Text>
                      </View>
                    </View>
                    <Text className="text-[10px] text-slate-400">
                      {new Date(w.completedAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <View className="py-3 items-center justify-center text-center space-y-1.5">
                <Text className="text-xs text-slate-400">
                  No workouts completed this week yet.
                </Text>
                <TouchableOpacity
                  onPress={() => setActiveTab('training')}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40"
                >
                  <Text className="text-xs font-bold text-emerald-300">Start My Routine</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <View className="flex-1 justify-between bg-slate-950">
      {renderTabContent()}

      {/* Shared Bottom Native Mobile Tab Bar */}
      <View className="px-4 py-2 bg-slate-900/95 border-t border-slate-800/80 backdrop-blur-md flex-row items-center justify-around z-30">
        <TouchableOpacity
          onPress={() => setActiveTab('home')}
          className="flex-col items-center gap-1 py-1 px-3 rounded-xl"
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <Text className={`text-[10px] ${activeTab === 'home' ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('training')}
          className="flex-col items-center gap-1 py-1 px-3 rounded-xl"
        >
          <Dumbbell className={`w-5 h-5 ${activeTab === 'training' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <Text className={`text-[10px] ${activeTab === 'training' ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>Programs</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('calendar')}
          className="flex-col items-center gap-1 py-1 px-3 rounded-xl"
        >
          <CalendarIcon className={`w-5 h-5 ${activeTab === 'calendar' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <Text className={`text-[10px] ${activeTab === 'calendar' ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>Calendar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('profile')}
          className="flex-col items-center gap-1 py-1 px-3 rounded-xl"
        >
          <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'text-emerald-400' : 'text-slate-400'}`} />
          <Text className={`text-[10px] ${activeTab === 'profile' ? 'font-bold text-emerald-400' : 'text-slate-400'}`}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Program Workout Runner Modal */}
      <ProgramWorkoutPlayer
        workoutDay={activeProgramDay}
        targetDate={todayStr}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
      />
    </View>
  );
};
