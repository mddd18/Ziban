import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; // ✅ To'g'rilangan import yo'li
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
import ProfileScreen from './components/ProfileScreen';

interface User {
  id?: string;
  firstName: string;
  lastName: string;
  phone: string;
  coins: number;
  isPremium?: boolean;
  streak: number;
  learnedWords: number;
}

export type ExerciseType = 'definition' | 'translation' | 'terms';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'exercises' | 'exercise-session' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile'>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<ExerciseType | null>(null);

  // 🔥 STREAK MANTIQI
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
        newStreak += 1; // Kecha kirgan bo'lsa streak davom etadi
      } else if (dayDiff > 1) {
        newStreak = 1; // Uzilib qolgan bo'lsa 1 dan boshlanadi
      }
    } else {
      newStreak = 1; // Birinchi marta kirishi
    }

    const { data, error } = await supabase
      .from('users')
      .update({ streak: newStreak, last_login: todayStr })
      .eq('phone', userData.phone)
      .select()
      .single();

    return error ? userData : data;
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      handleStreakLogic(parsedUser).then(updated => {
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
    const updatedUser = await handleStreakLogic(userData);
    const finalUser = {
      firstName: updatedUser.first_name,
      lastName: updatedUser.last_name,
      phone: updatedUser.phone,
      coins: updatedUser.coins,
      isPremium: updatedUser.is_premium,
      streak: updatedUser.streak,
      learnedWords: updatedUser.learned_words || 0
    };
    setUser(finalUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  const handleExerciseComplete = async () => {
    if (user) {
      const newCount = (user.learnedWords || 0) + 1;
      const { error } = await supabase
        .from('users')
        .update({ learned_words: newCount })
        .eq('phone', user.phone);

      if (!error) {
        const updated = { ...user, learnedWords: newCount };
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
      }
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
