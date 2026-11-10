import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firestore with specific database ID as required
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test Firestore Connection as required by Firebase integration guidelines
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
    return false;
  }
}

// Authentication helpers
export async function signInWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleProvider);
  return result.user;
}

export async function signOutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

export interface UserProfileData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  fitnessLevel: 'beginner' | 'intermediate' | 'advanced';
  goal: 'weight_loss' | 'muscle_gain' | 'endurance' | 'flexibility' | 'general_health';
  weeklyTargetDays: number;
  weightKg?: number;
  heightCm?: number;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  createdAt: string;
  updatedAt: string;
}

export async function syncUserProfile(user: User): Promise<UserProfileData> {
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
  } catch (getErr) {
    console.warn('Could not read existing profile from Firestore:', getErr);
  }

  const newProfile: UserProfileData = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || user.email?.split('@')[0] || 'FitHome Athlete',
    photoURL: user.photoURL || '',
    fitnessLevel: 'beginner',
    goal: 'general_health',
    weeklyTargetDays: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    await setDoc(userRef, newProfile, { merge: true });
  } catch (writeErr) {
    handleFirestoreError(writeErr, OperationType.WRITE, `users/${user.uid}`);
  }

  return newProfile;
}

export async function updateUserProfile(userId: string, data: Partial<UserProfileData>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  try {
    await setDoc(userRef, {
      ...data,
      uid: userId,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
    throw error;
  }
}

// Workout and Progress Models
export interface WorkoutLog {
  id: string;
  userId: string;
  exerciseId: string;
  exerciseName: string;
  category: 'cardio' | 'hiit' | 'strength' | 'yoga' | 'core';
  durationMinutes: number;
  caloriesBurned: number;
  completedAt: string;
  notes?: string;
}

export interface ProgressDay {
  id: string;
  userId: string;
  date: string;
  completed: boolean;
  workoutsCount: number;
  totalMinutes: number;
  updatedAt: string;
}

export async function logWorkout(userId: string, workout: Omit<WorkoutLog, 'id' | 'userId'>): Promise<WorkoutLog> {
  const workoutId = `w_${Date.now()}`;
  const fullWorkout: WorkoutLog = {
    ...workout,
    id: workoutId,
    userId,
  };
  const workoutRef = doc(db, 'users', userId, 'workouts', workoutId);
  try {
    await setDoc(workoutRef, fullWorkout);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/workouts/${workoutId}`);
    throw error;
  }

  // Update calendar day using local date key to prevent timezone mismatch
  const dateStr = workout.completedAt.includes('T')
    ? workout.completedAt.split('T')[0]
    : workout.completedAt;
  const calendarRef = doc(db, 'users', userId, 'calendar', dateStr);
  try {
    const calendarSnap = await getDoc(calendarRef);
    if (calendarSnap.exists()) {
      const current = calendarSnap.data() as ProgressDay;
      await setDoc(calendarRef, {
        id: dateStr,
        userId,
        date: dateStr,
        completed: true,
        workoutsCount: (current.workoutsCount || 0) + 1,
        totalMinutes: (current.totalMinutes || 0) + workout.durationMinutes,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } else {
      await setDoc(calendarRef, {
        id: dateStr,
        userId,
        date: dateStr,
        completed: true,
        workoutsCount: 1,
        totalMinutes: workout.durationMinutes,
        updatedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${userId}/calendar/${dateStr}`);
  }

  return fullWorkout;
}

export function subscribeUserWorkouts(userId: string, onWorkouts: (workouts: WorkoutLog[]) => void): () => void {
  const workoutsPath = `users/${userId}/workouts`;
  const workoutsCol = collection(db, 'users', userId, 'workouts');
  const q = query(workoutsCol, orderBy('completedAt', 'desc'), limit(50));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const items: WorkoutLog[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as WorkoutLog);
      });
      onWorkouts(items);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, workoutsPath);
    }
  );
}

export function subscribeUserCalendar(userId: string, onCalendar: (days: Record<string, ProgressDay>) => void): () => void {
  const calendarPath = `users/${userId}/calendar`;
  const calendarCol = collection(db, 'users', userId, 'calendar');
  
  return onSnapshot(
    calendarCol,
    (snapshot) => {
      const days: Record<string, ProgressDay> = {};
      snapshot.forEach((doc) => {
        const data = doc.data() as ProgressDay;
        days[data.date] = data;
      });
      onCalendar(days);
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, calendarPath);
    }
  );
}

