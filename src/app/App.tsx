import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // ✅ src/app/App.tsx dan src/supabase.ts ga yo'l
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList';
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics';
import Literature from './components/Literature';
import MockTest from './components/MockTest';
import Rewards from './components/Rewards';
import LearningCenters from './components/LearningCenters';
import AdminPanel from './components/AdminPanel';
import PremiumScreen from './components/PremiumScreen';
import ProfileScreen from './components/ProfileScreen'; // ✅ Faylni yaratganingizdan keyin ishlaydi

interface User {
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
  isPremium?: boolean;
  streak: number;      // ✅ Bazadagi yangi ustun
  learnedWords: number; // ✅ Bazadagi yangi ustun
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  // 🔥 STREAK VA PROGRESSNI TEKSHIRISH FUNKSIYASI
  const syncUserStats = async (userData: any) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.last_login;
    let newStreak = userData.streak || 0;

    if (lastLogin) {
      const diff = Math.floor((new Date(today).getTime() - new Date(lastLogin).getTime()) / (1000 * 3600 * 24));
      if (diff === 1) newStreak += 1;
      else if (diff > 1) newStreak = 1;
    } else {
      newStreak = 1;
    }

    const { data, error } = await supabase
      .from('users')
      .update({ streak: newStreak, last_login: today })
      .eq('phone', userData.phone)
      .select()
      .single();

    return error ? userData : data;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      syncUserStats(parsed).then(updated => {
        setUser({
          firstName: updated.first_name,
          lastName: updated.last_name,
          phone: updated.phone,
          coins: updated.coins,
          isPremium: updated.is_premium,
          streak: updated.streak,
          learnedWords: updated.learned_words || 0
        });
      });
    }
  }, []);

  const handleLogin = async (userData: any) => {
    const updated = await syncUserStats(userData);
    const finalUser = {
      firstName: updated.first_name,
      lastName: updated.last_name,
      phone: updated.phone,
      coins: updated.coins,
      isPremium: updated.is_premium,
      streak: updated.streak,
      learnedWords: updated.learned_words || 0
    };
    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(updated));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  // 📈 MASHQ TUGAGANDA FOIZNI OSHIRISH
  const handleExerciseComplete = async () => {
    if (user) {
      const newCount = (user.learnedWords || 0) + 1;
      await supabase.from('users').update({ learned_words: newCount }).eq('phone', user.phone);
      const updated = { ...user, learnedWords: newCount };
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
    }
    setCurrentView('exercises');
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen">
      {currentView === 'dashboard' && <MainDashboard user={user} onNavigate={setCurrentView} onLogout={handleLogout} />}
      {currentView === 'profile' && <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />}
      {currentView === 'exercises' && <ExercisesList onBack={() => setCurrentView('dashboard')} onStartExercise={(t) => { setSelectedExerciseType(t); setCurrentView('exercise-session'); }} />}
      {currentView === 'exercise-session' && selectedExerciseType && <ExerciseSession exerciseType={selectedExerciseType} onComplete={handleExerciseComplete} />}
      {currentView === 'statistics' && <Statistics onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'literature' && <Literature onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'mock-test' && <MockTest onComplete={() => setCurrentView('dashboard')} />}
      {currentView === 'rewards' && <Rewards onBack={() => setCurrentView('dashboard')} userCoins={user.coins} onUpdateCoins={(c) => setUser({...user, coins: c})} />}
      {currentView === 'learning-centers' && <LearningCenters onBack={() => setCurrentView('dashboard')} userCoins={user.coins} onNavigateToRewards={() => setCurrentView('rewards')} />}
      {currentView === 'admin-panel' && <AdminPanel onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'premium' && <PremiumScreen onBack={() => setCurrentView('dashboard')} onUpgradeSuccess={() => setUser({...user, isPremium: true})} />}
    </div>
  );
}
