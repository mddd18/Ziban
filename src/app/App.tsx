import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
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

  // 🔥 STREAK VA PROGRESSNI TEKSHIRISH FUNKSIYASI
  const syncUserStats = async (userData: any) => {
    const today = new Date().toISOString().split('T')[0];
    const lastLogin = userData.last_login;
    let newStreak = userData.streak || 0;

    if (lastLogin) {
      const diff = Math.floor((new Date(today).getTime() - new Date(lastLogin).getTime()) / (1000 * 3600 * 24));
      if (diff === 1) {
        newStreak += 1;
      } else if (diff > 1) {
        newStreak = 1;
      }
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

  // 📈 MASHQ TUGAGANDA SONLARNI OSHIRISH
  const handleExerciseComplete = async () => {
    if (user) {
      const newCount = (user.learnedWords || 0) + 1;
      const newCoins = (user.coins || 0) + 5; // Har bir dars uchun 5 coin sovg'a

      const { data, error } = await supabase
        .from('users')
        .update({ learned_words: newCount, coins: newCoins })
        .eq('phone', user.phone)
        .select()
        .single();

      if (!error && data) {
        const updatedUser = { 
          ...user, 
          learnedWords: data.learned_words, 
          coins: data.coins 
        };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(data));
      }
    }
    setCurrentView('exercises');
  };

  const handleUpdateCoins = async (newCoins: number) => {
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ coins: newCoins })
        .eq('phone', user.phone);

      if (!error) {
        setUser({ ...user, coins: newCoins });
        // LocalStorage'ni ham yangilab qo'yamiz
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, coins: newCoins }));
      }
    }
  };

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {/* 1. ASOSIY DASHBOARD */}
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={setCurrentView} onLogout={handleLogout} />
      )}

      {/* 2. PROFIL OYNASI */}
      {currentView === 'profile' && (
        <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />
      )}

      {/* 3. MASHQLAR RO'YXATI */}
      {currentView === 'exercises' && (
        <ExercisesList onBack={() => setCurrentView('dashboard')} onStartExercise={(t) => { setSelectedExerciseType(t); setCurrentView('exercise-session'); }} />
      )}

      {/* 4. MASHQ JARAYONI */}
      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession exerciseType={selectedExerciseType} onComplete={handleExerciseComplete} />
      )}

      {/* 5. STATISTIKA (DINAMIK) */}
      {currentView === 'statistics' && (
        <Statistics 
          user={{ streak: user.streak, learnedWords: user.learnedWords, coins: user.coins }} 
          onBack={() => setCurrentView('dashboard')} 
        />
      )}

      {/* 6. ADABIYOTLAR */}
      {currentView === 'literature' && (
        <Literature onBack={() => setCurrentView('dashboard')} />
      )}

      {/* 7. MOCK TEST */}
      {currentView === 'mock-test' && (
        <MockTest onComplete={() => setCurrentView('dashboard')} />
      )}

      {/* 8. MUKOFOTLAR (COINLAR BILAN) */}
      {currentView === 'rewards' && (
        <Rewards userCoins={user.coins} onBack={() => setCurrentView('dashboard')} onUpdateCoins={handleUpdateCoins} />
      )}

      {/* 9. O'QUV MARKAZLARI */}
      {currentView === 'learning-centers' && (
        <LearningCenters onBack={() => setCurrentView('dashboard')} userCoins={user.coins} onNavigateToRewards={() => setCurrentView('rewards')} />
      )}

      {/* 10. ADMIN VA PREMIUM */}
      {currentView === 'admin-panel' && <AdminPanel onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'premium' && <PremiumScreen onBack={() => setCurrentView('dashboard')} onUpgradeSuccess={() => setUser({...user, isPremium: true})} />}
    </div>
  );
}
