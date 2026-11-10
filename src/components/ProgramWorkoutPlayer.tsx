import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { DayWorkoutProgram, ProgramExerciseStep } from '../data/programs';
import { useAuth } from '../context/AuthContext';
import { WorkoutLog } from '../firebase';
import { 
  Play, 
  Pause, 
  Check, 
  CheckCircle2, 
  X, 
  Flame, 
  Clock, 
  Trophy, 
  Dumbbell, 
  SkipForward, 
  List, 
  Volume2, 
  VolumeX,
  ArrowRight
} from 'lucide-react';

import { getLocalDateString } from '../utils/date';

interface ProgramWorkoutPlayerProps {
  workoutDay: DayWorkoutProgram | null;
  targetDate?: string; // e.g. "2026-11-06"
  isOpen: boolean;
  onClose: () => void;
  onWorkoutCompleted?: (log: WorkoutLog) => void;
}

// Sound effects using Web Audio API
function playTone(frequency: number, duration: number = 0.12, volume: number = 0.15) {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export const ProgramWorkoutPlayer: React.FC<ProgramWorkoutPlayerProps> = ({
  workoutDay,
  targetDate,
  isOpen,
  onClose,
  onWorkoutCompleted
}) => {
  const { recordWorkout } = useAuth();
  const [justValidatedMessage, setJustValidatedMessage] = useState<string | null>(null);

  // Phases: 'prep' (3-2-1), 'active' (doing exercise), 'rest' (between sets), 'completed'
  const [phase, setPhase] = useState<'prep' | 'active' | 'rest' | 'completed'>('prep');
  const [prepCountdown, setPrepCountdown] = useState<number>(3);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentSet, setCurrentSet] = useState<number>(1);

  // Timers
  const [restTimeLeft, setRestTimeLeft] = useState<number>(30);
  const [exerciseTimeLeft, setExerciseTimeLeft] = useState<number>(0);
  const [setElapsedSeconds, setSetElapsedSeconds] = useState<number>(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showExerciseList, setShowExerciseList] = useState<boolean>(false);

  // Firestore saving state
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [savedLog, setSavedLog] = useState<WorkoutLog | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const currentExercise: ProgramExerciseStep | undefined = workoutDay?.exercises[currentExerciseIndex];
  const totalExercises = workoutDay?.exercises.length || 0;

  // Initialize and automatically start with 3-2-1 Countdown when player opens
  useEffect(() => {
    if (isOpen && workoutDay && workoutDay.exercises.length > 0) {
      setPhase('prep');
      setPrepCountdown(3);
      setCurrentExerciseIndex(0);
      setCurrentSet(1);
      setSetElapsedSeconds(0);
      setTotalSecondsElapsed(0);
      setIsPaused(false);
      setIsSaving(false);
      setSavedLog(null);
      setShowExerciseList(false);

      if (workoutDay.exercises[0].isTimeBased && workoutDay.exercises[0].durationSeconds) {
        setExerciseTimeLeft(workoutDay.exercises[0].durationSeconds);
      } else {
        setExerciseTimeLeft(0);
      }
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }, [isOpen, workoutDay]);

  // Main Timer Loop
  useEffect(() => {
    if (!isOpen || isPaused || phase === 'completed') {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      // 1. Preparation Phase (3... 2... 1... GO !)
      if (phase === 'prep') {
        setPrepCountdown((prev) => {
          if (soundEnabled && prev > 1) {
            playTone(550, 0.1);
          }
          if (prev <= 1) {
            if (soundEnabled) playTone(880, 0.25);
            setPhase('active');
            setSetElapsedSeconds(0);
            return 0;
          }
          return prev - 1;
        });
        return;
      }

      // Total session time accumulator
      setTotalSecondsElapsed((prev) => prev + 1);

      // 2. Rest Phase Countdown
      if (phase === 'rest') {
        setRestTimeLeft((prev) => {
          if (soundEnabled && prev <= 4 && prev > 1) {
            playTone(480, 0.08);
          }
          if (prev <= 1) {
            if (soundEnabled) playTone(750, 0.2);
            setPhase('active');
            setSetElapsedSeconds(0);
            return 0;
          }
          return prev - 1;
        });
      }

      // 3. Active Exercise Phase
      if (phase === 'active') {
        setSetElapsedSeconds((prev) => prev + 1);

        // For duration-based exercises (e.g. Plank 45s)
        if (currentExercise?.isTimeBased && exerciseTimeLeft > 0) {
          setExerciseTimeLeft((prev) => {
            if (soundEnabled && prev <= 4 && prev > 1) {
              playTone(520, 0.08);
            }
            if (prev <= 1) {
              if (soundEnabled) playTone(800, 0.2);
              handleCompleteSet();
              return 0;
            }
            return prev - 1;
          });
        }
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, phase, exerciseTimeLeft, currentExercise, soundEnabled]);

  if (!isOpen || !workoutDay || workoutDay.exercises.length === 0) return null;

  // Called when user clicks "Complete Set" or timer ends
  const handleCompleteSet = async () => {
    if (!currentExercise) return;

    if (soundEnabled) {
      playTone(700, 0.12);
    }

    if (currentSet < currentExercise.sets) {
      // Move to next set within current exercise
      setCurrentSet((s) => s + 1);
      setPhase('rest');
      setRestTimeLeft(currentExercise.restSeconds || 30);
      setSetElapsedSeconds(0);
      if (currentExercise.isTimeBased && currentExercise.durationSeconds) {
        setExerciseTimeLeft(currentExercise.durationSeconds);
      }
    } else {
      // All sets done for this exercise -> validate this exercise immediately!
      await validateCurrentExercise();
      handleAdvanceNextExercise();
    }
  };

  // Directly validates current exercise and marks the target date in calendar immediately
  const validateCurrentExercise = async () => {
    if (!currentExercise || !workoutDay) return;
    try {
      const minutes = Math.max(1, Math.round(setElapsedSeconds / 60) || 3);
      const calories = Math.round(minutes * 7) || 20;
      const dateToUse = targetDate || getLocalDateString(new Date());

      const log = await recordWorkout({
        exerciseId: currentExercise.id,
        exerciseName: `${currentExercise.name} (${workoutDay.dayNameEn})`,
        category: 'strength',
        durationMinutes: minutes,
        caloriesBurned: calories,
        completedAt: `${dateToUse}T12:00:00.000Z`,
        notes: `Exercise "${currentExercise.name}" completed (${currentExercise.sets} sets) for ${workoutDay.dayNameEn} (${dateToUse}).`
      });

      setSavedLog(log);
      onWorkoutCompleted?.(log);

      setJustValidatedMessage(`"${currentExercise.name}" completed for ${workoutDay.dayNameEn} (${dateToUse})! ✓`);
      setTimeout(() => setJustValidatedMessage(null), 3500);
    } catch (err) {
      console.warn('Validate exercise error:', err);
    }
  };

  const handleAdvanceNextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      const nextIndex = currentExerciseIndex + 1;
      const nextEx = workoutDay.exercises[nextIndex];
      setCurrentExerciseIndex(nextIndex);
      setCurrentSet(1);
      setPhase('rest');
      setRestTimeLeft(nextEx.restSeconds || 30);
      setSetElapsedSeconds(0);
      if (nextEx.isTimeBased && nextEx.durationSeconds) {
        setExerciseTimeLeft(nextEx.durationSeconds);
      }
    } else {
      // Completed entire workout!
      setPhase('completed');
      if (soundEnabled) {
        playTone(660, 0.15);
        setTimeout(() => playTone(880, 0.3), 150);
      }
      triggerSaveWorkout();
    }
  };

  const handleSkipRest = () => {
    setPhase('active');
    setRestTimeLeft(0);
    setSetElapsedSeconds(0);
  };

  const formatSeconds = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m > 0 ? `${m}m ` : ''}${s < 10 && m > 0 ? '0' : ''}${s}s`;
  };

  const triggerSaveWorkout = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const minutes = Math.max(1, Math.round(totalSecondsElapsed / 60) || workoutDay.estimatedDurationMinutes);
      const calories = workoutDay.estimatedCalories || Math.round(minutes * 9);
      const dateToUse = targetDate || getLocalDateString(new Date());

      const workoutData = {
        exerciseId: `program_day_${workoutDay.dayOfWeek}`,
        exerciseName: `${workoutDay.title} (${workoutDay.dayNameEn})`,
        category: 'strength' as const,
        durationMinutes: minutes,
        caloriesBurned: calories,
        completedAt: `${dateToUse}T12:00:00.000Z`,
        notes: `Full ${workoutDay.dayNameEn} session completed for ${dateToUse}: ${totalExercises} exercises logged.`
      };

      const logged = await recordWorkout(workoutData);
      setSavedLog(logged);
      onWorkoutCompleted?.(logged);
    } catch (err) {
      console.error('Save workout error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  // Immediate validation of the entire day session at any time
  const handleImmediateValidateSession = async () => {
    await triggerSaveWorkout();
    setPhase('completed');
  };

  return (
    <View className="fixed inset-0 z-50 items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
      <View className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-[36px] overflow-hidden shadow-2xl flex-1 max-h-[92vh] justify-between">
        
        {/* Top Native Bar */}
        <View className="px-5 pt-4 pb-3 flex-row items-center justify-between border-b border-slate-900 bg-slate-950/90 z-20">
          <View className="flex-row items-center gap-2">
            <View className="w-8 h-8 rounded-xl bg-emerald-500/15 items-center justify-center">
              <Dumbbell className="w-4 h-4 text-emerald-400" />
            </View>
            <View>
              <Text className="text-xs font-bold text-white max-w-[170px]" numberOfLines={1}>
                {workoutDay.dayNameEn} • {workoutDay.title}
              </Text>
              <Text className="text-[10px] text-slate-400">
                {phase === 'prep' 
                  ? 'Get Ready...' 
                  : phase === 'completed' 
                  ? 'Workout Complete!' 
                  : `Exercise ${currentExerciseIndex + 1} of ${totalExercises}`}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5">
            <TouchableOpacity
              onPress={() => setSoundEnabled(!soundEnabled)}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900"
              title={soundEnabled ? 'Mute sound' : 'Enable sound'}
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowExerciseList(!showExerciseList)}
              className={`p-1.5 rounded-full bg-slate-900 ${showExerciseList ? 'text-emerald-400' : 'text-slate-400'}`}
              title="View exercise list"
            >
              <List className="w-4 h-4" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white bg-slate-900 transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Optional Overlay: Full Exercises List Drawer */}
        {showExerciseList && (
          <View className="p-4 bg-slate-900 border-b border-slate-800 space-y-2 max-h-56 overflow-y-auto z-30">
            <View className="flex-row items-center justify-between pb-1 border-b border-slate-800">
              <Text className="text-xs font-bold text-white uppercase">Today's Exercises ({totalExercises} total)</Text>
              <TouchableOpacity onPress={() => setShowExerciseList(false)}>
                <Text className="text-[10px] text-emerald-400 font-bold">Close</Text>
              </TouchableOpacity>
            </View>
            {workoutDay.exercises.map((ex, i) => (
              <View 
                key={ex.id}
                className={`p-2 rounded-xl flex-row items-center justify-between ${
                  i === currentExerciseIndex ? 'bg-emerald-500/15 border border-emerald-500/40' : 'bg-slate-950/60'
                }`}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="text-[10px] font-bold text-emerald-400">{i + 1}.</Text>
                  <Text className="text-xs font-bold text-white">{ex.name}</Text>
                </View>
                <Text className="text-[10px] text-slate-400">{ex.sets}x {ex.reps}</Text>
              </View>
            ))}
          </View>
        )}

        {/* 1. PREPARATION PHASE (3... 2... 1... GO !) */}
        {phase === 'prep' && (
          <View className="flex-1 items-center justify-center p-6 space-y-5">
            <View className="items-center space-y-2 text-center">
              <View className="px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30">
                <Text className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Get Ready!
                </Text>
              </View>
              <Text className="text-xl font-black text-white">{currentExercise?.name}</Text>
              <Text className="text-xs text-slate-400">{currentExercise?.description}</Text>
            </View>

            {/* Giant Countdown Pulse */}
            <View className="relative w-44 h-44 rounded-full border-4 border-emerald-400/40 items-center justify-center shadow-xl shadow-emerald-500/20">
              <View className="absolute inset-0 rounded-full bg-emerald-500/20 blur-2xl animate-ping" />
              <Text className="text-7xl font-black text-emerald-400">{prepCountdown}</Text>
            </View>

            <Text className="text-xs text-slate-400 font-medium">
              Assume starting posture
            </Text>
          </View>
        )}

        {/* 2. ACTIVE EXERCISE STAGE */}
        {phase === 'active' && currentExercise && (
          <View className="flex-1 justify-between p-4 space-y-3">
            {/* Exercise Header & Set Info */}
            <View className="space-y-2">
              <View className="flex-row items-center justify-between text-xs">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-[11px] font-bold text-slate-400 uppercase">
                    Exercise {currentExerciseIndex + 1} / {totalExercises}
                  </Text>
                  <View className="px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                    <Text className="text-[10px] text-emerald-400 font-semibold">{currentExercise.targetMuscle}</Text>
                  </View>
                </View>
                <Text className="text-xs font-black text-emerald-400">
                  Set {currentSet} of {currentExercise.sets}
                </Text>
              </View>

              {/* Progress bar */}
              <View className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                <View 
                  className="h-full bg-emerald-400 rounded-full transition-all"
                  style={{ width: `${((currentExerciseIndex + (currentSet / currentExercise.sets)) / totalExercises) * 100}%` }}
                />
              </View>
            </View>

            {/* Exercise Title Card */}
            <View className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-center items-center">
              <Text className="text-lg font-black text-white text-center">{currentExercise.name}</Text>
              <Text className="text-[11px] text-slate-400 text-center mt-0.5">{currentExercise.description}</Text>
            </View>

            {/* Main Target Display Card */}
            {currentExercise.isTimeBased ? (
              /* Time-based target */
              <View className="p-4 rounded-3xl bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-900 border border-emerald-500/40 items-center justify-center space-y-2">
                <Text className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  TIME REMAINING
                </Text>
                <View className="w-28 h-28 rounded-full border-4 border-emerald-400 items-center justify-center relative shadow-lg shadow-emerald-500/20">
                  <Text className="text-4xl font-black text-white">{exerciseTimeLeft}</Text>
                  <Text className="text-[9px] text-slate-400 uppercase font-bold">Seconds</Text>
                </View>
                <Text className="text-[11px] text-slate-400 font-mono">
                  Elapsed: {formatSeconds(setElapsedSeconds)}
                </Text>
              </View>
            ) : (
              /* Repetitions target */
              <View className="p-5 rounded-3xl bg-gradient-to-br from-emerald-600/20 via-slate-900 to-slate-900 border border-emerald-500/40 items-center justify-center space-y-2">
                <Text className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">
                  SET TARGET
                </Text>

                <Text className="text-3xl font-black text-white">
                  {currentExercise.reps}
                </Text>

                <View className="flex-row items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 border border-slate-800">
                  <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                  <Text className="text-xs font-mono font-bold text-slate-300">
                    Timer: {formatSeconds(setElapsedSeconds)}
                  </Text>
                </View>
              </View>
            )}

            {/* Live Instant Feedback Banner when validated */}
            {justValidatedMessage && (
              <View className="p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 flex-row items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <Text className="text-xs font-black text-emerald-300">{justValidatedMessage}</Text>
              </View>
            )}

            {/* BIG HIGHLY VISIBLE COMPLETE SET BUTTON */}
            <TouchableOpacity
              onPress={handleCompleteSet}
              className="w-full py-4 px-5 rounded-3xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all flex-row items-center justify-between shadow-xl shadow-emerald-500/30 border-2 border-emerald-300 cursor-pointer"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-9 h-9 rounded-2xl bg-slate-950 border-2 border-emerald-400 items-center justify-center shadow-inner">
                  <Check className="w-5 h-5 text-emerald-400 stroke-[3]" />
                </View>
                <View>
                  <Text className="text-slate-950 font-black text-sm uppercase tracking-wider">
                    {currentSet < currentExercise.sets ? "Completed Set!" : "Exercise Finished! Next"}
                  </Text>
                  <Text className="text-slate-900 font-semibold text-[11px]">
                    {currentSet < currentExercise.sets 
                      ? `Start rest period (${currentExercise.restSeconds}s)` 
                      : `Logs progress & advances to next`}
                  </Text>
                </View>
              </View>

              <ArrowRight className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </TouchableOpacity>

            {/* Quick Actions */}
            <View className="flex-row items-center justify-between gap-2 pt-0.5">
              <TouchableOpacity
                onPress={validateCurrentExercise}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-900 border border-emerald-500/40 hover:bg-emerald-500/10 flex-row items-center justify-center gap-1.5"
                title="Mark this exercise complete in calendar now"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <Text className="text-[11px] font-bold text-emerald-400">
                  Mark Exercise Done ✓
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleImmediateValidateSession}
                className="py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 flex-row items-center justify-center gap-1.5"
                title="Finish entire workout session"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-400" />
                <Text className="text-[11px] font-semibold text-slate-300">
                  Finish Workout
                </Text>
              </TouchableOpacity>
            </View>

            {/* Bottom Pause & Skip Controls */}
            <View className="flex-row items-center justify-between text-xs pt-0.5">
              <TouchableOpacity
                onPress={() => setIsPaused(!isPaused)}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex-row items-center gap-1.5"
              >
                {isPaused ? <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3.5 h-3.5 text-slate-400 fill-slate-400" />}
                <Text className="text-xs text-slate-300">{isPaused ? 'Resume' : 'Pause'}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleAdvanceNextExercise}
                className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              >
                <Text className="text-xs text-slate-400">Skip Exercise →</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 3. REST COUNTDOWN PHASE */}
        {phase === 'rest' && (
          <View className="flex-1 items-center justify-between p-5 space-y-4">
            <View className="w-full items-center pt-2">
              <View className="px-3 py-1 rounded-full bg-teal-500/15 border border-teal-500/30">
                <Text className="text-[10px] font-bold text-teal-300 uppercase tracking-wider">
                  REST & RECOVERY
                </Text>
              </View>
            </View>

            {/* Giant Rest Countdown Ring */}
            <View className="items-center space-y-3">
              <View className="w-40 h-40 rounded-full border-4 border-teal-400/50 items-center justify-center relative shadow-xl shadow-teal-500/20">
                <View className="absolute inset-0 rounded-full bg-teal-500/15 blur-xl" />
                <Text className="text-6xl font-black text-white">{restTimeLeft}</Text>
                <Text className="text-[10px] text-teal-300 font-bold uppercase tracking-widest mt-1">
                  Seconds
                </Text>
              </View>
              <Text className="text-sm font-bold text-white">Breathe deeply</Text>
              <Text className="text-xs text-slate-400 text-center max-w-xs">
                Up next: {currentSet <= (currentExercise?.sets || 3) 
                  ? `Set ${currentSet} of ${currentExercise?.sets} of ${currentExercise?.name}` 
                  : workoutDay.exercises[currentExerciseIndex + 1]?.name || 'Workout complete'}
              </Text>
            </View>

            {/* Skip Rest Button */}
            <View className="w-full space-y-2">
              <TouchableOpacity
                onPress={handleSkipRest}
                className="w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 active:scale-[0.98] transition-all flex-row items-center justify-center gap-2 shadow-lg shadow-teal-500/20"
              >
                <SkipForward className="w-4 h-4 text-slate-950 font-bold" />
                <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                  Skip Rest & Continue
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* 4. WORKOUT COMPLETED CELEBRATION SCREEN */}
        {phase === 'completed' && (
          <View className="flex-1 justify-between p-5">
            <ScrollView className="flex-1 space-y-5">
              <View className="items-center text-center space-y-3 pt-2">
                <View className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 items-center justify-center shadow-lg shadow-emerald-500/20">
                  <Trophy className="w-10 h-10 text-emerald-400 animate-bounce" />
                </View>

                <Text className="text-2xl font-black text-white text-center">
                  Workout Complete!
                </Text>
                <Text className="text-xs text-slate-400 text-center max-w-xs">
                  Congratulations! You successfully finished your <Text className="text-white font-bold">{workoutDay.dayNameEn}</Text> workout ({workoutDay.title}).
                </Text>
              </View>

              {/* Stats Summary Cards */}
              <View className="grid grid-cols-2 gap-2.5 pt-2">
                <View className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center">
                  <Clock className="w-5 h-5 text-teal-400 mb-1" />
                  <Text className="text-[10px] text-slate-400 uppercase font-semibold">Time Elapsed</Text>
                  <Text className="text-base font-black text-white">{formatSeconds(totalSecondsElapsed)}</Text>
                </View>

                <View className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 items-center justify-center">
                  <Flame className="w-5 h-5 text-amber-400 mb-1" />
                  <Text className="text-[10px] text-slate-400 uppercase font-semibold">Calories Burned</Text>
                  <Text className="text-base font-black text-white">~{workoutDay.estimatedCalories} kcal</Text>
                </View>
              </View>

              {/* Firestore synchronization badge */}
              <View className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <Text className="text-xs font-semibold text-slate-300">
                    {savedLog ? 'Logged to your Firebase Calendar!' : 'Syncing with Firestore...'}
                  </Text>
                </View>
                {savedLog && (
                  <Text className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    Logged ✓
                  </Text>
                )}
              </View>
            </ScrollView>

            <View className="pt-3 border-t border-slate-900">
              <TouchableOpacity
                onPress={onClose}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] transition-all flex-row items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
              >
                <Text className="text-slate-950 font-black text-xs uppercase tracking-wider">
                  Back to Weekly Plan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
