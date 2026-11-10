import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Flame, 
  Trophy, 
  Clock, 
  Dumbbell, 
  CheckCircle2, 
  ArrowRight,
  Check
} from 'lucide-react';
import { getLocalDateString, formatDisplayDate } from '../utils/date';

interface CalendarScreenProps {
  onNavigateToExercises: () => void;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const WEEK_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const CalendarScreen: React.FC<CalendarScreenProps> = ({ onNavigateToExercises }) => {
  const { profile, workouts, calendarDays, isDayCompleted } = useAuth();

  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => getLocalDateString(new Date()));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDateStr(getLocalDateString(today));
  };

  // Calendar grid calculations
  const calendarGrid = useMemo(() => {
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
    // Week starts on Monday (0 = Mon, 6 = Sun)
    const normalizedFirstDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days: Array<{ dayNum: number; dateStr: string; isCurrentMonth: boolean }> = [];

    // Empty cells before start of month
    for (let i = 0; i < normalizedFirstDay; i++) {
      days.push({ dayNum: 0, dateStr: '', isCurrentMonth: false });
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      const formattedMonth = String(month + 1).padStart(2, '0');
      const formattedDay = String(d).padStart(2, '0');
      const dStr = `${year}-${formattedMonth}-${formattedDay}`;
      days.push({ dayNum: d, dateStr: dStr, isCurrentMonth: true });
    }

    return days;
  }, [year, month]);

  // Workouts for selected date
  const selectedDayWorkouts = useMemo(() => {
    return workouts.filter((w) => {
      const dateOnly = w.completedAt.includes('T') ? w.completedAt.split('T')[0] : w.completedAt;
      return dateOnly === selectedDateStr;
    });
  }, [workouts, selectedDateStr]);

  // Overall statistics
  const stats = useMemo(() => {
    const totalMinutes = workouts.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const totalCalories = workouts.reduce((acc, curr) => acc + (curr.caloriesBurned || 0), 0);

    // Current week workouts
    const now = new Date();
    const currentWeekStart = new Date(now);
    const day = now.getDay() || 7;
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(now.getDate() - day + 1);

    const weekWorkoutsCount = workouts.filter((w) => {
      const workoutDate = new Date(w.completedAt);
      return workoutDate >= currentWeekStart;
    }).length;

    // Accurate streak calculation
    const datesWithWorkout = new Set(
      workouts.map((w) => (w.completedAt.includes('T') ? w.completedAt.split('T')[0] : w.completedAt))
    );
    // Also include calendarDays
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
          const yStr = getLocalDateString(yesterday);
          if (datesWithWorkout.has(yStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 2);
            continue;
          }
        }
        break;
      }
    }

    return {
      totalMinutes,
      totalCalories,
      weekWorkoutsCount,
      streak,
    };
  }, [workouts, calendarDays]);

  const targetDays = profile?.weeklyTargetDays || 3;
  const todayStr = getLocalDateString(new Date());

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top Header */}
      <View className="px-5 pt-3 pb-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 flex-row items-center justify-between">
        <View>
          <Text className="text-sm font-bold text-white">Calendar & Progress</Text>
          <Text className="text-[11px] text-slate-400">Workout history and activity tracking</Text>
        </View>

        <TouchableOpacity
          onPress={handleGoToday}
          className="px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60"
        >
          <Text className="text-[11px] font-bold text-emerald-400">Today</Text>
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView className="flex-1 px-5 py-4 space-y-4">
        {/* Progression Overview Cards */}
        <View className="grid grid-cols-2 gap-2.5">
          {/* Streak Card */}
          <View className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-900 border border-amber-500/30">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-amber-300">Active Streak</Text>
              <Flame className="w-4 h-4 text-amber-400 fill-amber-400" />
            </View>
            <Text className="text-2xl font-black text-white">{stats.streak} {stats.streak === 1 ? 'day' : 'days'}</Text>
            <Text className="text-[10px] text-slate-400 mt-0.5">Consecutive training</Text>
          </View>

          {/* Weekly Target Card */}
          <View className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500/15 via-slate-900 to-slate-900 border border-emerald-500/30">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">This Week</Text>
              <Trophy className="w-4 h-4 text-emerald-400" />
            </View>
            <View className="flex-row items-baseline gap-1">
              <Text className="text-2xl font-black text-white">{stats.weekWorkoutsCount}</Text>
              <Text className="text-xs font-bold text-slate-400">/ {targetDays} sessions</Text>
            </View>
            {/* Progress Bar */}
            <View className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
              <View 
                className="h-full bg-emerald-400 rounded-full transition-all" 
                style={{ width: `${Math.min(100, (stats.weekWorkoutsCount / targetDays) * 100)}%` }} 
              />
            </View>
          </View>
        </View>

        {/* Calendar Navigator Card */}
        <View className="p-4 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          {/* Month Selector */}
          <View className="flex-row items-center justify-between pb-2 border-b border-slate-800/80">
            <TouchableOpacity
              onPress={handlePrevMonth}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-slate-300" />
            </TouchableOpacity>

            <Text className="text-xs font-black text-white uppercase tracking-wider">
              {MONTH_NAMES[month]} {year}
            </Text>

            <TouchableOpacity
              onPress={handleNextMonth}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-slate-300" />
            </TouchableOpacity>
          </View>

          {/* Weekday Labels */}
          <View className="grid grid-cols-7 gap-1 text-center">
            {WEEK_DAYS.map((wd, i) => (
              <Text key={i} className="text-[10px] font-bold text-slate-400 uppercase py-1">
                {wd}
              </Text>
            ))}
          </View>

          {/* Days Grid */}
          <View className="grid grid-cols-7 gap-1">
            {calendarGrid.map((item, idx) => {
              if (!item.isCurrentMonth) {
                return <View key={idx} className="h-9" />;
              }

              const hasWorkout = isDayCompleted(item.dateStr);
              const isSelected = selectedDateStr === item.dateStr;
              const isToday = todayStr === item.dateStr;

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedDateStr(item.dateStr)}
                  className={`h-9 rounded-xl items-center justify-center relative transition-all ${
                    isSelected && hasWorkout
                      ? 'bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/30'
                      : isSelected 
                      ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20' 
                      : hasWorkout 
                      ? 'bg-emerald-500/25 border-2 border-emerald-400 text-emerald-200 font-black shadow-md shadow-emerald-500/20' 
                      : isToday 
                      ? 'border border-slate-700 bg-slate-800/60' 
                      : 'hover:bg-slate-800/50'
                  }`}
                >
                  <Text className={`text-xs ${
                    isSelected 
                      ? 'font-black text-slate-950' 
                      : hasWorkout 
                      ? 'font-black text-emerald-300' 
                      : isToday 
                      ? 'font-bold text-white' 
                      : 'text-slate-300'
                  }`}>
                    {item.dayNum}
                  </Text>

                  {/* Workout check badge */}
                  {hasWorkout && (
                    <View className={`absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full items-center justify-center border ${
                      isSelected ? 'bg-slate-950 border-emerald-400' : 'bg-emerald-500 border-slate-950'
                    }`}>
                      <Check className={`w-2.5 h-2.5 ${isSelected ? 'text-emerald-400' : 'text-slate-950'} stroke-[3]`} />
                    </View>
                  )}

                  {/* Workout dot indicator */}
                  {hasWorkout && !isSelected && (
                    <View className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Selected Date Workout Details */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-400" />
              <Text className="text-xs font-bold text-white">
                Details for {formatDisplayDate(selectedDateStr)}
              </Text>
            </View>
            <View className={`px-2 py-0.5 rounded-full border ${
              selectedDayWorkouts.length > 0 || isDayCompleted(selectedDateStr)
                ? 'bg-emerald-500/20 border-emerald-500/40' 
                : 'bg-slate-800 border-slate-700'
            }`}>
              <Text className={`text-[10px] font-bold ${
                selectedDayWorkouts.length > 0 || isDayCompleted(selectedDateStr)
                  ? 'text-emerald-400'
                  : 'text-slate-300'
              }`}>
                {selectedDayWorkouts.length > 0 
                  ? `${selectedDayWorkouts.length} logged`
                  : isDayCompleted(selectedDateStr)
                  ? 'Workout Completed ✓'
                  : '0 sessions'}
              </Text>
            </View>
          </View>

          {selectedDayWorkouts.length > 0 ? (
            <View className="space-y-2 pt-1">
              {selectedDayWorkouts.map((w) => (
                <View
                  key={w.id}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex-row items-center justify-between"
                >
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-8 h-8 rounded-lg bg-emerald-500/15 items-center justify-center">
                      <Dumbbell className="w-4 h-4 text-emerald-400" />
                    </View>
                    <View>
                      <Text className="text-xs font-bold text-white">{w.exerciseName}</Text>
                      <Text className="text-[10px] text-slate-400">
                        {w.durationMinutes} min • ~{w.caloriesBurned} kcal
                      </Text>
                    </View>
                  </View>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <Text className="text-[10px] font-bold text-emerald-400">Logged</Text>
                  </View>
                </View>
              ))}
            </View>
          ) : isDayCompleted(selectedDateStr) ? (
            <View className="p-3 rounded-xl bg-slate-950 border border-emerald-500/30 flex-row items-center justify-between">
              <View className="flex-row items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <Text className="text-xs font-bold text-emerald-300">Daily session marked complete in calendar</Text>
              </View>
              <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                Completed ✓
              </Text>
            </View>
          ) : (
            <View className="py-4 items-center justify-center text-center space-y-2">
              <Text className="text-xs text-slate-400">
                No workouts recorded for this date.
              </Text>
              {selectedDateStr === todayStr && (
                <TouchableOpacity
                  onPress={onNavigateToExercises}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 flex-row items-center gap-1.5 transition-all shadow-md shadow-emerald-500/20"
                >
                  <Text className="text-xs font-bold text-slate-950">Start a workout now</Text>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Global Summary Stats */}
        <View className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
          <Text className="text-xs font-bold text-white uppercase tracking-wider">
            FitHome Lifetime Achievements
          </Text>

          <View className="grid grid-cols-3 gap-2 text-center pt-1 font-mono">
            <View className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <Text className="text-base font-black text-white">{workouts.length}</Text>
              <Text className="text-[10px] text-slate-400 uppercase">Workouts</Text>
            </View>
            <View className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <Text className="text-base font-black text-teal-400">{stats.totalMinutes}m</Text>
              <Text className="text-[10px] text-slate-400 uppercase">Active Time</Text>
            </View>
            <View className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
              <Text className="text-base font-black text-amber-400">~{stats.totalCalories}</Text>
              <Text className="text-[10px] text-slate-400 uppercase">Calories</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
