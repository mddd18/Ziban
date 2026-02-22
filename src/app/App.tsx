import { useState, useEffect } from 'react';
import { supabase } from './supabase'; // Supabase ulanmasi borligiga ishonch hosil qiling
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
import ProfileScreen from './components/ProfileScreen'; // Profil oynasi qo'shildi

interface User {
  id?: string; // Bazadan keladigan ID
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
  isPremium?: boolean;
  streak: number; // Yangi qo'shildi
  learnedWords: number; // Yangi qo'shildi
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  // 1. STREAK MANTIQI (Login bo'lganda ishlaydi)
  const handleStreakLogic = async (userData: any) => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const lastLoginStr = userData.last_login;

    let newStreak = userData.streak || 0;

    if (lastLoginStr) {
      const lastLoginDate = new Date(lastLoginStr);
      const timeDiff = today.getTime() - lastLoginDate.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (dayDiff === 1) {
        newStreak += 1; // Kecha kirgan bo'lsa streak +1
      } else if (dayDiff > 1) {
        newStreak = 1; // Uzilib qolgan bo'lsa 1 dan boshlaydi
      }
    } else {
      newStreak = 1; // Birinchi marta kirishi
    }

    // Bazani yangilash
    const { data, error } = await supabase
      .from('users')
      .update({ streak: newStreak, last_login: todayStr })
      .eq('phone', userData.phone)
      .select()
      .single();

    if (!error && data) {
      return data;
    }
    return userData;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Dastur ochilganda streakni tekshirish
      handleStreakLogic(parsedUser).then(updated => {
        setUser({
          id: updated.id,
          firstName: updated.first_name,
          lastName: updated.last_name,
          phone: updated.phone,
          coins: updated.coins,
          isPremium: updated.is_premium,
          streak: updated.streak,
          learnedWords: updated.learned_words
        });
      });
    }
  }, []);

  const handleLogin = async (userData: any) => {
    const updatedUser = await handleStreakLogic(userData);
    const finalUser = {
      id: updatedUser.id,
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      coins: updatedUser.coins,
      isPremium: updatedUser.is_premium,
      streak: updatedUser.streak,
      learnedWords: updatedUser.learned_words
    };
    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  const handleNavigate = (view: any) => {
    if ((view === 'mock-test' || view === 'rewards') && !user?.isPremium) {
      setCurrentView('premium');
      return;
    }
    setCurrentView(view);
  };

  // 2. MASHQLARNI TUGATGANDA % NI OSHIRISH
  const handleExerciseComplete = async () => {
    if (user) {
      const newLearnedCount = (user.learnedWords || 0) + 1; // Har bir sessiya uchun +1
      
      const { error } = await supabase
        .from('users')
        .update({ learned_words: newLearnedCount })
        .eq('phone', user.phone);

      if (!error) {
        const updatedUser = { ...user, learnedWords: newLearnedCount };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    }
    setCurrentView('exercises');
  };

  // ... (boshqa funksiyalar o'zgarishsiz qoladi)

  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={handleNavigate} onLogout={handleLogout} />
      )}
      {currentView === 'profile' && (
        <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />
      )}
      {/* Qolgan Viewlar ... */}
      {currentView === 'exercises' && (
        <ExercisesList onBack={() => setCurrentView('dashboard')} onStartExercise={(type) => { setSelectedExerciseType(type); setCurrentView('exercise-session'); }} />
      )}
      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession exerciseType={selectedExerciseType} onComplete={handleExerciseComplete} />
      )}
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
