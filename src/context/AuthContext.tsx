import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { 
  auth, 
  signInWithGoogle, 
  signOutUser, 
  syncUserProfile, 
  updateUserProfile, 
  testConnection, 
  UserProfileData,
  logWorkout as firebaseLogWorkout,
  subscribeUserWorkouts,
  subscribeUserCalendar,
  WorkoutLog,
  ProgressDay
} from '../firebase';
import { getLocalDateString } from '../utils/date';

interface AuthContextType {
  user: User | null;
  profile: UserProfileData | null;
  loading: boolean;
  isGuest: boolean;
  firestoreConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  loginAsGuest: () => void;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfileData>) => Promise<void>;
  error: string | null;
  clearError: () => void;
  // Shared Workout & Calendar State
  workouts: WorkoutLog[];
  calendarDays: Record<string, ProgressDay>;
  completedExercises: Record<string, boolean>; // key: `${dateStr}_${exerciseId}`
  recordWorkout: (data: Omit<WorkoutLog, 'id' | 'userId'>) => Promise<WorkoutLog>;
  toggleExerciseCompleted: (
    dateStr: string, 
    exerciseId: string, 
    exerciseName: string, 
    durationMinutes?: number, 
    caloriesBurned?: number
  ) => Promise<boolean>;
  isDayCompleted: (dateStr: string) => boolean;
  isExerciseCompleted: (dateStr: string, exerciseId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const GUEST_PROFILE: UserProfileData = {
  uid: 'guest-preview-user',
  email: 'guest@fithome.app',
  displayName: 'FitHome Guest',
  photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  fitnessLevel: 'beginner',
  goal: 'general_health',
  weeklyTargetDays: 3,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const STORAGE_WORKOUTS_KEY = 'fithome_v2_workouts';
const STORAGE_CALENDAR_KEY = 'fithome_v2_calendar';
const STORAGE_COMPLETED_EX_KEY = 'fithome_v2_completed_exercises';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Centralized Workouts & Calendar State
  const [workouts, setWorkouts] = useState<WorkoutLog[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_WORKOUTS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [calendarDays, setCalendarDays] = useState<Record<string, ProgressDay>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_CALENDAR_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_COMPLETED_EX_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Keep local storage in sync whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WORKOUTS_KEY, JSON.stringify(workouts));
    } catch (e) {
      console.warn('Could not save workouts to local storage', e);
    }
  }, [workouts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CALENDAR_KEY, JSON.stringify(calendarDays));
    } catch (e) {
      console.warn('Could not save calendar to local storage', e);
    }
  }, [calendarDays]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_COMPLETED_EX_KEY, JSON.stringify(completedExercises));
    } catch (e) {
      console.warn('Could not save completed exercises to local storage', e);
    }
  }, [completedExercises]);

  // Check Firestore connection at boot
  useEffect(() => {
    testConnection().then((ok) => {
      setFirestoreConnected(ok);
    });
  }, []);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setIsGuest(false);
        try {
          const userProf = await syncUserProfile(currentUser);
          setProfile(userProf);
        } catch (err: any) {
          console.error('Failed to sync user profile:', err);
          setProfile({
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || 'Athlète FitHome',
            photoURL: currentUser.photoURL || '',
            fitnessLevel: 'beginner',
            goal: 'general_health',
            weeklyTargetDays: 3,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        setUser(null);
        if (!isGuest) {
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [isGuest]);

  // Real-time Firestore synchronization for workouts & calendar when logged in
  useEffect(() => {
    if (user && !isGuest) {
      const unsubWorkouts = subscribeUserWorkouts(user.uid, (firestoreWorkouts) => {
        setWorkouts((prev) => {
          // Merge avoiding duplicates
          const map = new Map<string, WorkoutLog>();
          firestoreWorkouts.forEach((w) => map.set(w.id, w));
          prev.forEach((w) => {
            if (!map.has(w.id)) map.set(w.id, w);
          });
          return Array.from(map.values()).sort(
            (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
          );
        });
      });

      const unsubCalendar = subscribeUserCalendar(user.uid, (firestoreCalendar) => {
        setCalendarDays((prev) => ({
          ...prev,
          ...firestoreCalendar
        }));
      });

      return () => {
        unsubWorkouts();
        unsubCalendar();
      };
    }
  }, [user, isGuest]);

  const loginWithGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const loggedUser = await signInWithGoogle();
      const userProf = await syncUserProfile(loggedUser);
      setUser(loggedUser);
      setProfile(userProf);
      setIsGuest(false);
    } catch (err: any) {
      console.error('Erreur de connexion Google:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('La fenêtre de connexion a été fermée avant la fin de l’authentification.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        // Ignored
      } else {
        setError(err.message || 'Échec de la connexion avec Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loginAsGuest = () => {
    setError(null);
    setIsGuest(true);
    setUser(null);
    setProfile(GUEST_PROFILE);
    setLoading(false);
  };

  const logout = async () => {
    setError(null);
    setLoading(true);
    try {
      if (!isGuest) {
        await signOutUser();
      }
      setUser(null);
      setProfile(null);
      setIsGuest(false);
    } catch (err: any) {
      setError(err.message || 'Error while signing out.');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<UserProfileData>) => {
    if (isGuest) {
      setProfile((prev) => (prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null));
      return;
    }
    if (user && profile) {
      try {
        await updateUserProfile(user.uid, data);
        setProfile((prev) => (prev ? { ...prev, ...data, updatedAt: new Date().toISOString() } : null));
      } catch (err: any) {
        setError('Impossible de mettre à jour le profil.');
        throw err;
      }
    }
  };

  const clearError = () => setError(null);

  /**
   * Immediately records a completed workout/exercise in state and Firestore
   */
  const recordWorkout = useCallback(async (data: Omit<WorkoutLog, 'id' | 'userId'>): Promise<WorkoutLog> => {
    // Exact target date string (e.g. "2026-11-06" for Friday)
    const targetDateStr = data.completedAt.includes('T')
      ? data.completedAt.split('T')[0]
      : data.completedAt;

    const workoutId = `w_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const currentUserId = user?.uid || 'guest-preview-user';

    const newLog: WorkoutLog = {
      ...data,
      id: workoutId,
      userId: currentUserId,
    };

    // 1. Immediately update local workouts state
    setWorkouts((prev) => [newLog, ...prev]);

    // 2. Immediately mark that exact date as completed in calendar
    setCalendarDays((prev) => {
      const existing = prev[targetDateStr];
      const count = (existing?.workoutsCount || 0) + 1;
      const minutes = (existing?.totalMinutes || 0) + data.durationMinutes;
      return {
        ...prev,
        [targetDateStr]: {
          id: targetDateStr,
          userId: currentUserId,
          date: targetDateStr,
          completed: true,
          workoutsCount: count,
          totalMinutes: minutes,
          updatedAt: new Date().toISOString(),
        }
      };
    });

    if (data.exerciseId) {
      const exKey = `${targetDateStr}_${data.exerciseId}`;
      setCompletedExercises((prev) => ({
        ...prev,
        [exKey]: true
      }));
    }

    // 3. Persist to Firestore if user is authenticated
    if (user && !isGuest) {
      try {
        await firebaseLogWorkout(user.uid, data);
      } catch (err) {
        console.warn('Could not sync workout to Firestore (saved locally):', err);
      }
    }

    return newLog;
  }, [user, isGuest]);

  /**
   * Toggles or validates an individual exercise for a specific day
   */
  const toggleExerciseCompleted = useCallback(async (
    dateStr: string,
    exerciseId: string,
    exerciseName: string,
    durationMinutes: number = 3,
    caloriesBurned: number = 25
  ): Promise<boolean> => {
    const key = `${dateStr}_${exerciseId}`;
    const currentlyDone = !!completedExercises[key];

    if (currentlyDone) {
      // Uncheck
      setCompletedExercises((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      return false;
    } else {
      // Mark as done and immediately validate in calendar for that specific date!
      setCompletedExercises((prev) => ({
        ...prev,
        [key]: true
      }));

      // Immediately log workout with the exact target date
      await recordWorkout({
        exerciseId,
        exerciseName,
        category: 'strength',
        durationMinutes,
        caloriesBurned,
        completedAt: `${dateStr}T12:00:00.000Z`,
        notes: `Exercise "${exerciseName}" completed for ${dateStr}.`
      });

      return true;
    }
  }, [completedExercises, recordWorkout]);

  /**
   * Helper to check if a day is completed (either in calendarDays, completedExercises or workouts)
   */
  const isDayCompleted = useCallback((dateStr: string): boolean => {
    if (calendarDays[dateStr]?.completed) return true;
    // Check if any exercise was completed for this date
    const hasCompletedExercise = Object.keys(completedExercises).some(
      (k) => k.startsWith(`${dateStr}_`) && completedExercises[k]
    );
    if (hasCompletedExercise) return true;

    return workouts.some((w) => {
      const wDate = w.completedAt.includes('T') ? w.completedAt.split('T')[0] : w.completedAt;
      return wDate === dateStr;
    });
  }, [calendarDays, completedExercises, workouts]);

  /**
   * Helper to check if a specific exercise is completed on a day
   */
  const isExerciseCompleted = useCallback((dateStr: string, exerciseId: string): boolean => {
    const key = `${dateStr}_${exerciseId}`;
    if (completedExercises[key]) return true;
    return workouts.some((w) => {
      const wDate = w.completedAt.includes('T') ? w.completedAt.split('T')[0] : w.completedAt;
      return wDate === dateStr && w.exerciseId === exerciseId;
    });
  }, [completedExercises, workouts]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isGuest,
        firestoreConnected,
        loginWithGoogle,
        loginAsGuest,
        logout,
        updateProfile,
        error,
        clearError,
        workouts,
        calendarDays,
        completedExercises,
        recordWorkout,
        toggleExerciseCompleted,
        isDayCompleted,
        isExerciseCompleted,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
