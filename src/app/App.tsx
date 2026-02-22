import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList';
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics';
import ProfileScreen from './components/ProfileScreen';
import Literature from './components/Literature';
import MockTest from './components/MockTest';
import Rewards from './components/Rewards';
import LearningCenters from './components/LearningCenters';
import AdminPanel from './components/AdminPanel';
import PremiumScreen from './components/PremiumScreen';

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
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({
        firstName: parsed.first_name || parsed.firstName,
        lastName: parsed.last_name || parsed.lastName,
        phone: parsed.phone,
        coins: parsed.coins || 0,
        streak: parsed.streak || 0,
        learnedWords: parsed.learned_words || 0,
        isPremium: parsed.is_premium
      });
    }
  }, []);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  const handleExerciseComplete = () => {
    setCurrentView('exercises');
  };

  if (!user) return <LoginScreen onLogin={(userData) => setUser(userData)} />;

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      
      {/* 1. ASOSIY DASHBOARD */}
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={setCurrentView} onLogout={handleLogout} />
      )}

      {/* 2. PROFIL */}
      {currentView === 'profile' && (
        <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />
      )}

      {/* 3. MASHQLAR RO'YXATI */}
      {currentView === 'exercises' && (
        <ExercisesList 
          onBack={() => setCurrentView('dashboard')} 
          onStartExercise={(type) => {
            setSelectedExerciseType(type);
            setCurrentView('exercise-session');
          }} 
        />
      )}

      {/* 4. MASHQ JARAYONI (XATOSIZ) */}
      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession 
          exerciseType={selectedExerciseType} 
          onComplete={handleExerciseComplete}
          onBack={() => setCurrentView('exercises')} 
        />
      )}

      {/* 5. STATISTIKA */}
      {currentView === 'statistics' && (
        <Statistics user={user} onBack={() => setCurrentView('dashboard')} />
      )}

      {/* 6. ADABIYOTLAR */}
      {currentView === 'literature' && (
        <Literature onBack={() => setCurrentView('dashboard')} />
      )}

      {/* 7. MOCK TEST */}
      {currentView === 'mock-test' && (
        <MockTest onComplete={() => setCurrentView('dashboard')} />
      )}

      {/* 8. MUKOFOTLAR (COINLAR) */}
     {currentView === 'rewards' && (
  <Rewards 
    userCoins={user.coins} 
    onBack={() => setCurrentView('dashboard')} 
    onUpdateCoins={(newCoins) => {
      // Bu funksiya ham App.tsx dagi user state-ni, ham bazani yangilashi kerak
      handleUpdateCoins(newCoins); 
    }} 
  />
)}

      {/* 9. O'QUV MARKAZLARI */}
      {currentView === 'learning-centers' && (
        <LearningCenters 
          userCoins={user.coins} 
          onBack={() => setCurrentView('dashboard')} 
        />
      )}

      {/* 🛡️ 10. ADMIN PANEL (Endi albatta kiradi!) */}
      {currentView === 'admin-panel' && (
        <AdminPanel onBack={() => setCurrentView('dashboard')} />
      )}

      {/* 💎 11. PREMIUM OYNASI */}
      {currentView === 'premium' && (
        <PremiumScreen 
          onBack={() => setCurrentView('dashboard')} 
          onUpgradeSuccess={() => setUser({...user, isPremium: true})} 
        />
      )}
    </div>
  );
}
