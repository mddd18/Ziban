import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList';
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics';
import ProfileScreen from './components/ProfileScreen';
// ... boshqa importlar

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
  streak: number;
  learnedWords: number;
  isPremium?: boolean;
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  // ✅ MUHIM: Boshlang'ich holat har doim 'dashboard' bo'lishi kerak
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'profile'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      // Bu yerda user ma'lumotlarini yuklash (syncUserStats funksiyangizni ishlating)
      setUser({
        firstName: parsed.first_name || parsed.firstName,
        lastName: parsed.last_name || parsed.lastName,
        phone: parsed.phone,
        coins: parsed.coins || 0,
        streak: parsed.streak || 0,
        learnedWords: parsed.learned_words || 0
      });
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  const handleExerciseComplete = () => {
    // Dars tugagach ro'yxatga qaytish
    setCurrentView('exercises');
  };

  if (!user) return <LoginScreen onLogin={(userData) => setUser(userData)} />;

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {/* 🟢 FAQAT BITTA OYNA KO'RINISHI UCHUN SHARTLAR */}
      
      {currentView === 'dashboard' && (
        <MainDashboard 
          user={user} 
          onNavigate={(view: any) => setCurrentView(view)} 
          onLogout={handleLogout} 
        />
      )}

      {currentView === 'profile' && (
        <ProfileScreen 
          user={user} 
          onBack={() => setCurrentView('dashboard')} 
          onLogout={handleLogout} 
        />
      )}

      {currentView === 'exercises' && (
        <ExercisesList 
          onBack={() => setCurrentView('dashboard')} 
          onStartExercise={(type) => {
            setSelectedExerciseType(type);
            setCurrentView('exercise-session');
          }} 
        />
      )}

      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession 
          exerciseType={selectedExerciseType} 
          onComplete={handleExerciseComplete}
          onBack={() => setCurrentView('exercises')} 
        />
      )}

      {currentView === 'statistics' && (
        <Statistics 
          user={user} 
          onBack={() => setCurrentView('dashboard')} 
        />
      )}
    </div>
  );
}
