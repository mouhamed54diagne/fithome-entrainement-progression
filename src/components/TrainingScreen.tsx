import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { 
  WORKOUT_PROGRAMS, 
  FitnessLevel, 
  DayWorkoutProgram, 
  LevelProgram 
} from '../data/programs';
import { ProgramWorkoutPlayer } from './ProgramWorkoutPlayer';
import { useAuth } from '../context/AuthContext';
import { WorkoutLog } from '../firebase';
import { 
  Calendar as CalendarIcon, 
  Dumbbell, 
  Flame, 
  Clock, 
  CheckCircle2, 
  Play, 
  Moon, 
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Check
} from 'lucide-react';
import { getCurrentWeekDates, getFranceDayOfWeek } from '../utils/date';

interface TrainingScreenProps {
  onWorkoutCompleted?: (log: WorkoutLog) => void;
}

export const TrainingScreen: React.FC<TrainingScreenProps> = ({ onWorkoutCompleted }) => {
  const { 
    profile, 
    updateProfile, 
    isDayCompleted, 
    isExerciseCompleted, 
    toggleExerciseCompleted 
  } = useAuth();

  // If user already has a level in profile, use it; otherwise null to trigger first-time level selection
  const [selectedLevel, setSelectedLevel] = useState<FitnessLevel | null>(
    profile?.fitnessLevel || null
  );
  const [isChangingLevel, setIsChangingLevel] = useState<boolean>(false);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [activeWorkoutDay, setActiveWorkoutDay] = useState<DayWorkoutProgram | null>(null);
  const [isPlayerOpen, setIsPlayerOpen] = useState<boolean>(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Update selectedLevel when profile changes
  useEffect(() => {
    if (profile?.fitnessLevel && !selectedLevel) {
      setSelectedLevel(profile.fitnessLevel);
    }
  }, [profile?.fitnessLevel]);

  // Compute current day of week (Monday = 1, Sunday = 7)
  const currentDayOfWeek = useMemo(() => getFranceDayOfWeek(new Date()), []);

  // Compute exact dates of current week (Monday to Sunday) using local date strings
  const currentWeekDates = useMemo(() => getCurrentWeekDates(new Date()), []);

  // Auto-select today's day of week on initial load
  useEffect(() => {
    setSelectedDayIndex(currentDayOfWeek - 1);
  }, [currentDayOfWeek]);

  const activeProgram: LevelProgram = WORKOUT_PROGRAMS[selectedLevel || 'intermediate'];

  const [activeWorkoutDate, setActiveWorkoutDate] = useState<string>(() => {
    const dates = getCurrentWeekDates(new Date());
    const dow = getFranceDayOfWeek(new Date());
    return dates[dow - 1] || dates[0];
  });

  const handleSelectLevel = async (level: FitnessLevel) => {
    setSelectedLevel(level);
    setIsChangingLevel(false);
    try {
      await updateProfile({ fitnessLevel: level });
    } catch (err) {
      console.error('Update level error:', err);
    }
  };

  const handleOpenWorkout = (dayProg: DayWorkoutProgram) => {
    if (dayProg.isRest) return;
    setActiveWorkoutDay(dayProg);
    const targetDateForDay = currentWeekDates[dayProg.dayOfWeek - 1] || currentWeekDates[selectedDayIndex];
    setActiveWorkoutDate(targetDateForDay);
    setIsPlayerOpen(true);
  };

  // Determine status for each day of the 7-day program
  const getDayStatus = (dayNum: number, isRest: boolean) => {
    const dateStr = currentWeekDates[dayNum - 1];
    const completed = isDayCompleted(dateStr);

    if (completed) {
      return { label: 'Completed ✓', status: 'completed' as const };
    }
    if (dayNum === currentDayOfWeek) {
      if (isRest) {
        return { label: "Today's Rest", status: 'rest' as const };
      }
      return { label: "Today's Workout", status: 'today' as const };
    }
    if (isRest) {
      return { label: 'Rest Day', status: 'rest' as const };
    }
    if (dayNum < currentDayOfWeek) {
      return { label: 'Past', status: 'passed' as const };
    }
    return { label: 'Upcoming', status: 'upcoming' as const };
  };

  // 1. FIRST-TIME LEVEL SELECTION (or when user clicks Change Level)
  if (!selectedLevel || isChangingLevel) {
    return (
      <View className="flex-1 bg-slate-950 px-5 py-6 justify-between">
        <ScrollView className="flex-1 space-y-4">
          {/* Header */}
          <View className="space-y-1.5 pt-2">
            <View className="flex-row items-center gap-2">
              <View className="w-9 h-9 rounded-2xl bg-emerald-500/15 items-center justify-center">
                <Layers className="w-5 h-5 text-emerald-400" />
              </View>
              <Text className="text-lg font-black text-white">Choose Your Fitness Level</Text>
            </View>
            <Text className="text-xs text-slate-400 leading-relaxed">
              Your 7-day home training schedule will be automatically customized and calibrated to this level.
            </Text>
          </View>

          {/* 3 Level Cards */}
          <View className="space-y-3 pt-2">
            {/* Beginner Card */}
            <TouchableOpacity
              onPress={() => handleSelectLevel('beginner')}
              className={`p-4 rounded-3xl border text-left transition-all space-y-2.5 ${
                selectedLevel === 'beginner' 
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
                  <Text className="text-[10px] font-bold text-emerald-300 uppercase">Level 1</Text>
                </View>
                <Text className="text-[11px] text-slate-400 font-semibold">3 sessions / week</Text>
              </View>

              <View>
                <Text className="text-base font-black text-white">Beginner</Text>
                <Text className="text-xs text-emerald-400 font-medium">Gentle restart & solid movement foundations</Text>
              </View>

              <Text className="text-[11px] text-slate-400 leading-relaxed">
                Low-impact bodyweight exercises (Gentle Squats, Knee Push-Ups, Core Plank, Glute Bridge). 2 sets per exercise with comfortable rest periods.
              </Text>

              <View className="pt-2 border-t border-slate-800/80 flex-row items-center justify-between">
                <Text className="text-[10px] text-slate-400">Average duration: 15 - 20 min</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-emerald-400">Select</Text>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Intermediate Card */}
            <TouchableOpacity
              onPress={() => handleSelectLevel('intermediate')}
              className={`p-4 rounded-3xl border text-left transition-all space-y-2.5 ${
                selectedLevel === 'intermediate' 
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-500/30">
                  <Text className="text-[10px] font-bold text-teal-300 uppercase">Level 2</Text>
                </View>
                <Text className="text-[11px] text-slate-400 font-semibold">5 sessions / week</Text>
              </View>

              <View>
                <Text className="text-base font-black text-white">Intermediate</Text>
                <Text className="text-xs text-teal-400 font-medium">Balanced split: Upper, Lower, Core, Full Body & Cardio</Text>
              </View>

              <Text className="text-[11px] text-slate-400 leading-relaxed">
                Comprehensive weekly routine (Classic Push-Ups, Lunges, Dips, Burpees, Mountain Climbers). 3 sets per exercise, invigorating intensity.
              </Text>

              <View className="pt-2 border-t border-slate-800/80 flex-row items-center justify-between">
                <Text className="text-[10px] text-slate-400">Average duration: 22 - 26 min</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-teal-400">Select</Text>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-400" />
                </View>
              </View>
            </TouchableOpacity>

            {/* Advanced Card */}
            <TouchableOpacity
              onPress={() => handleSelectLevel('advanced')}
              className={`p-4 rounded-3xl border text-left transition-all space-y-2.5 ${
                selectedLevel === 'advanced' 
                  ? 'bg-emerald-500/15 border-emerald-500/60 shadow-lg shadow-emerald-500/10' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <View className="flex-row items-center justify-between">
                <View className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                  <Text className="text-[10px] font-bold text-amber-300 uppercase">Level 3</Text>
                </View>
                <Text className="text-[11px] text-slate-400 font-semibold">5 intensive sessions / week</Text>
              </View>

              <View>
                <Text className="text-base font-black text-white">Advanced</Text>
                <Text className="text-xs text-amber-400 font-medium">Explosive power, high volume & athletic density</Text>
              </View>

              <Text className="text-[11px] text-slate-400 leading-relaxed">
                Demanding calisthenics & plyometrics (Jump Squats, Pike Push-Ups, V-Ups, Sprint Burpees, HIIT). 4 sets, short rest intervals.
              </Text>

              <View className="pt-2 border-t border-slate-800/80 flex-row items-center justify-between">
                <Text className="text-[10px] text-slate-400">Average duration: 25 - 30 min</Text>
                <View className="flex-row items-center gap-1">
                  <Text className="text-xs font-bold text-amber-400">Select</Text>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {isChangingLevel && (
          <View className="pt-3 border-t border-slate-900">
            <TouchableOpacity
              onPress={() => setIsChangingLevel(false)}
              className="w-full py-2.5 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center"
            >
              <Text className="text-xs font-semibold text-slate-300">Cancel & Keep Current Plan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }

  // 2. MAIN 7-DAY WEEKLY WORKOUT PROGRAM VIEW
  const selectedDayProgram = activeProgram.days[selectedDayIndex];
  const selectedDateStr = currentWeekDates[selectedDayIndex];
  const selectedDayStatus = getDayStatus(selectedDayProgram.dayOfWeek, selectedDayProgram.isRest);

  const handleToggleExercise = async (exId: string, exName: string) => {
    try {
      const isNowDone = await toggleExerciseCompleted(selectedDateStr, exId, exName, 3, 20);
      if (isNowDone) {
        setFeedbackToast(`"${exName}" completed! Progress logged in calendar ✓`);
      } else {
        setFeedbackToast(`Exercise unchecked.`);
      }
      setTimeout(() => setFeedbackToast(null), 3000);
    } catch (e) {
      console.warn('Toggle exercise error:', e);
    }
  };

  return (
    <View className="flex-1 bg-slate-950">
      {/* Top Header with Level Switcher */}
      <View className="px-5 pt-3 pb-3 bg-slate-900/90 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-20 space-y-3">
        <View className="flex-row items-center justify-between">
          <View>
            <View className="flex-row items-center gap-1.5">
              <Text className="text-sm font-bold text-white">Weekly Training Plan</Text>
              <View className="px-2 py-0.2 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Text className="text-[10px] font-bold text-emerald-400">7 DAYS</Text>
              </View>
            </View>
            <Text className="text-[11px] text-slate-400">
              Current Level: <Text className="text-emerald-400 font-bold">{activeProgram.levelNameEn}</Text>
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => setIsChangingLevel(true)}
            className="flex-row items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60"
            title="Change difficulty level"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-300" />
            <Text className="text-[11px] font-bold text-slate-300">Change</Text>
          </TouchableOpacity>
        </View>

        {/* 7 Days of the Week Selector Bar */}
        <View className="grid grid-cols-7 gap-1">
          {activeProgram.days.map((d, idx) => {
            const isSelected = selectedDayIndex === idx;
            const isToday = d.dayOfWeek === currentDayOfWeek;
            const dateStr = currentWeekDates[idx];
            const dateDayNum = dateStr ? Number(dateStr.split('-')[2]) : idx + 1;
            const statusInfo = getDayStatus(d.dayOfWeek, d.isRest);
            const isCompleted = statusInfo.status === 'completed';

            return (
              <TouchableOpacity
                key={d.dayOfWeek}
                onPress={() => setSelectedDayIndex(idx)}
                className={`py-2 px-1 rounded-2xl items-center justify-center border transition-all relative ${
                  isSelected && isCompleted
                    ? 'bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/30'
                    : isSelected 
                    ? 'bg-emerald-500 border-emerald-400 shadow-md shadow-emerald-500/20' 
                    : isCompleted 
                    ? 'bg-emerald-500/25 border-2 border-emerald-400 shadow-sm shadow-emerald-500/25' 
                    : isToday 
                    ? 'bg-emerald-500/15 border-emerald-500/60' 
                    : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800'
                }`}
              >
                {/* Day Letter */}
                <Text className={`text-[10px] uppercase tracking-tighter ${
                  isSelected 
                    ? 'text-slate-950 font-black' 
                    : isCompleted 
                    ? 'text-emerald-300 font-black' 
                    : isToday 
                    ? 'text-emerald-400 font-bold' 
                    : 'text-slate-400 font-medium'
                }`}>
                  {d.dayNameEn.substring(0, 3)}
                </Text>

                {/* Day Date of Month */}
                <Text className={`text-xs ${
                  isSelected 
                    ? 'text-slate-950 font-black' 
                    : isCompleted 
                    ? 'text-emerald-200 font-black' 
                    : isToday 
                    ? 'text-white font-black' 
                    : 'text-slate-300 font-semibold'
                }`}>
                  {dateDayNum}
                </Text>

                {/* Status Indicator Icon */}
                <View className="mt-0.5">
                  {isCompleted ? (
                    <View className={`w-4 h-4 rounded-full items-center justify-center ${isSelected ? 'bg-slate-950' : 'bg-emerald-500'}`}>
                      <Check className={`w-2.5 h-2.5 ${isSelected ? 'text-emerald-400' : 'text-slate-950'} stroke-[3]`} />
                    </View>
                  ) : d.isRest ? (
                    <Moon className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : 'text-slate-500'}`} />
                  ) : (
                    <Dumbbell className={`w-3.5 h-3.5 ${isSelected ? 'text-slate-950' : isToday ? 'text-emerald-400' : 'text-slate-400'}`} />
                  )}
                </View>

                {/* Completed green indicator badge */}
                {isCompleted && !isSelected && (
                  <View className="absolute -top-1 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                )}

                {/* Today's indicator dot */}
                {isToday && !isSelected && !isCompleted && (
                  <View className="absolute -top-1 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Floating feedback toast */}
      {feedbackToast && (
        <View className="mx-5 mt-3 p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 flex-row items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <Text className="text-xs font-bold text-emerald-300">{feedbackToast}</Text>
        </View>
      )}

      {/* Selected Day Workout Details */}
      <ScrollView className="flex-1 px-5 py-4 space-y-4">
        {/* Selected Day Status & Title Hero Card */}
        <View className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3 relative overflow-hidden">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800">
              <CalendarIcon className="w-3.5 h-3.5 text-emerald-400" />
              <Text className="text-xs font-bold text-white">
                {selectedDayProgram.dayNameEn} ({selectedDateStr})
              </Text>
            </View>

            {/* Day Status Pill */}
            <View className={`px-2.5 py-1 rounded-full border ${
              selectedDayStatus.status === 'completed'
                ? 'bg-emerald-500/25 border-emerald-400 text-emerald-300 shadow-md shadow-emerald-500/20'
                : selectedDayStatus.status === 'today'
                ? 'bg-emerald-500 border-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                : selectedDayStatus.status === 'rest'
                ? 'bg-slate-800 border-slate-700 text-slate-300'
                : 'bg-slate-800/60 border-slate-700 text-slate-400'
            }`}>
              <Text className={`text-[10px] font-bold uppercase tracking-wider ${
                selectedDayStatus.status === 'today' ? 'text-slate-950 font-black' : selectedDayStatus.status === 'completed' ? 'text-emerald-300 font-bold' : ''
              }`}>
                {selectedDayStatus.label}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-lg font-black text-white">{selectedDayProgram.title}</Text>
            <Text className="text-xs text-slate-300 mt-1 leading-relaxed">{selectedDayProgram.shortDescription}</Text>
          </View>

          {!selectedDayProgram.isRest && (
            <View className="flex-row items-center justify-between pt-2 border-t border-slate-800/80 text-xs text-slate-300">
              <View className="flex-row items-center gap-3">
                <View className="flex-row items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-400" />
                  <Text className="text-xs text-slate-300 font-semibold">{selectedDayProgram.estimatedDurationMinutes} min</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <Text className="text-xs text-slate-300 font-semibold">~{selectedDayProgram.estimatedCalories} kcal</Text>
                </View>
              </View>

              <TouchableOpacity
                onPress={() => handleOpenWorkout(selectedDayProgram)}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 transition-all flex-row items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Play className="w-3.5 h-3.5 text-slate-950 fill-slate-950" />
                <Text className="text-xs font-black text-slate-950">
                  {selectedDayStatus.status === 'completed' ? 'Restart' : 'Start'}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* REST DAY VIEW */}
        {selectedDayProgram.isRest ? (
          <View className="p-6 rounded-3xl bg-slate-900 border border-slate-800 items-center justify-center text-center space-y-3 py-8">
            <View className="w-14 h-14 rounded-full bg-teal-500/15 border border-teal-500/30 items-center justify-center">
              <Moon className="w-7 h-7 text-teal-400" />
            </View>
            <View className="space-y-1">
              <Text className="text-base font-bold text-white">Recovery & Rest Day</Text>
              <Text className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Rest is an essential pillar of your fitness journey! Muscles repair, rebuild, and grow stronger during recovery.
              </Text>
            </View>

            <View className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-left w-full space-y-1.5 mt-2">
              <Text className="text-[11px] font-bold text-teal-300 uppercase">Coach's Tips for Today:</Text>
              <Text className="text-xs text-slate-400">• Drink at least 1.5 to 2L of water to stay well hydrated</Text>
              <Text className="text-xs text-slate-400">• Go for a light walk or do 5 minutes of gentle mobility stretches</Text>
              <Text className="text-xs text-slate-400">• Aim for 7 to 8 hours of quality sleep to optimize muscle recovery</Text>
            </View>
          </View>
        ) : (
          /* WORKOUT EXERCISES LIST VIEW */
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Scheduled Exercises ({selectedDayProgram.exercises.length})
              </Text>
              <TouchableOpacity onPress={() => handleOpenWorkout(selectedDayProgram)}>
                <Text className="text-xs font-bold text-emerald-400">Guided Workout Mode →</Text>
              </TouchableOpacity>
            </View>

            {selectedDayProgram.exercises.map((ex, idx) => {
              const done = isExerciseCompleted(selectedDateStr, ex.id);

              return (
                <View
                  key={ex.id}
                  className={`p-3.5 rounded-2xl border transition-all space-y-2.5 shadow-md ${
                    done 
                      ? 'bg-slate-900/90 border-emerald-500/50' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <View className="flex-row items-start justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className={`w-8 h-8 rounded-xl items-center justify-center border ${
                        done ? 'bg-emerald-500 border-emerald-400' : 'bg-emerald-500/15 border-emerald-500/30'
                      }`}>
                        {done ? (
                          <Check className="w-4 h-4 text-slate-950 stroke-[3]" />
                        ) : (
                          <Text className="text-xs font-bold text-emerald-400">{idx + 1}</Text>
                        )}
                      </View>
                      <View>
                        <Text className={`text-xs font-bold ${done ? 'text-emerald-300' : 'text-white'}`}>
                          {ex.name}
                        </Text>
                        <Text className="text-[11px] text-emerald-400">{ex.targetMuscle}</Text>
                      </View>
                    </View>

                    <View className="flex-row items-center gap-2">
                      <View className="px-2.5 py-1 rounded-xl bg-slate-800 border border-slate-700">
                        <Text className="text-[11px] font-bold text-slate-200">
                          {ex.sets} sets
                        </Text>
                      </View>

                      {/* Direct Clickable Checkbox/Validation Button */}
                      <TouchableOpacity
                        onPress={() => handleToggleExercise(ex.id, ex.name)}
                        className={`px-3 py-1 rounded-xl flex-row items-center gap-1.5 border transition-all cursor-pointer ${
                          done 
                            ? 'bg-emerald-500/20 border-emerald-400' 
                            : 'bg-slate-800/80 hover:bg-emerald-500/10 border-slate-700'
                        }`}
                        title={done ? 'Click to uncheck' : 'Complete this exercise now'}
                      >
                        <CheckCircle2 className={`w-3.5 h-3.5 ${done ? 'text-emerald-400' : 'text-slate-400'}`} />
                        <Text className={`text-[11px] font-bold ${done ? 'text-emerald-300' : 'text-slate-300'}`}>
                          {done ? 'Done ✓' : 'Complete'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text className="text-[11px] text-slate-400 leading-relaxed">
                    {ex.description}
                  </Text>

                  <View className="pt-2 border-t border-slate-800/80 flex-row items-center justify-between text-[11px]">
                    <View className="flex-row items-center gap-1.5">
                      <Text className="text-slate-400">Reps:</Text>
                      <Text className="text-white font-bold">{ex.reps}</Text>
                    </View>

                    <View className="flex-row items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <Text className="text-slate-400">Rest:</Text>
                      <Text className="text-slate-300 font-semibold">{ex.restSeconds}s</Text>
                    </View>
                  </View>
                </View>
              );
            })}

            {/* Bottom Big Start Workout CTA */}
            <View className="pt-2">
              <TouchableOpacity
                onPress={() => handleOpenWorkout(selectedDayProgram)}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all flex-row items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Play className="w-4 h-4 text-slate-950 fill-slate-950" />
                <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                  Start {selectedDayProgram.dayNameEn} Workout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Program Workout Runner Modal */}
      <ProgramWorkoutPlayer
        workoutDay={activeWorkoutDay}
        targetDate={activeWorkoutDate}
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        onWorkoutCompleted={(log) => {
          onWorkoutCompleted?.(log);
        }}
      />
    </View>
  );
};
