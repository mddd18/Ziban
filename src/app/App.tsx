import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import { Loader2, Lock, Crown } from 'lucide-react';

// Komponentlarni import qilish
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList'; // 🏋️ "Shinigiwlar" bo'limi
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics'; // 📊 "Statistika" bo'limi
import ProfileScreen from './components/ProfileScreen';
import Literature from './components/Literature';
import MockTest from './components/MockTest';
import VoucherStore from './components/VoucherStore';
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
  role?: string; // 🎓 Student, Abiturient, Oqıwshı, Oqıtıwshı
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        const userPhone = localStorage.getItem('userPhone');

        if (storedUser && userPhone) {
          const parsed = JSON.parse(storedUser);
          setUser({
            firstName: parsed.first_name || parsed.firstName,
            lastName: parsed.last_name || parsed.lastName,
            phone: userPhone,
            coins: parsed.coins || 0,
            streak: parsed.streak || 0,
            learnedWords: parsed.learned_words || 0,
            isPremium: parsed.is_premium,
            role: parsed.role
          });

          const { data, error } = await supabase.from('users').select('*').eq('phone', userPhone).maybeSingle();
          if (data && !error) {
            setUser({
              firstName: data.first_name,
              lastName: data.last_name,
              phone: data.phone,
              coins: data.coins || 0,
              streak: data.streak || 0,
              learnedWords: data.learned_words || 0,
              isPremium: data.is_premium,
              role: data.role
            });
            localStorage.setItem('user', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentView('dashboard');
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EEDC]">
      <Loader2 className="w-12 h-12 text-[#2EB8A6] animate-spin mb-4" />
      <p className="text-[#8DA6A1] font-black uppercase text-[10px] tracking-widest">Ziyban júklenbekte...</p>
    </div>
  );

  if (!user) return <LoginScreen onLogin={(userData) => setUser(userData)} />;

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {/* 🏠 BAS MENU (Dashboard) */}
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={(v: any) => setCurrentView(v)} onLogout={handleLogout} />
      )}
      
      {/* 🏋️ SHINIǴIWLAR (Exercises) */}
      {currentView === 'exercises' && (
        <ExercisesList 
          onBack={() => setCurrentView('dashboard')} 
          onStartExercise={(type) => { setSelectedExerciseType(type); setCurrentView('exercise-session'); }} 
        />
      )}

      {currentView === 'exercise-session' && selectedExerciseType && (
        <ExerciseSession 
          exerciseType={selectedExerciseType} 
          onComplete={() => setCurrentView('exercises')}
          onBack={() => setCurrentView('exercises')} 
        />
      )}

      {/* 📊 STATISTIKA */}
      {currentView === 'statistics' && <Statistics user={user} onBack={() => setCurrentView('dashboard')} />}

      {/* 👤 PROFIL (Rol tanlash bilan) */}
      {currentView === 'profile' && (
        <ProfileScreen 
          user={user} 
          onUpdateUser={(updated) => setUser(updated)} 
          onBack={() => setCurrentView('dashboard')} 
          onLogout={handleLogout} 
        />
      )}

      {/* 📚 ÁDEBIYATLAR */}
      {currentView === 'literature' && <Literature onBack={() => setCurrentView('dashboard')} />}
      
      {/* 💎 PREMIUM (Hamma uchun ochiq) */}
      {currentView === 'premium' && <PremiumScreen onBack={() => setCurrentView('dashboard')} />}

      {/* 🛡️ MOCK TEST: Premium himoyasi */}
      {currentView === 'mock-test' && (
        user.isPremium ? <MockTest user={user} onComplete={() => setCurrentView('dashboard')} /> : 
        <PremiumLockScreen title="Mock Test Jabıq" desc="Milliy sertifikat testlerin tapsırıw ushın Premium kerek." onNavigate={setCurrentView} />
      )}

      {/* 🎁 SÓWǴALAR: Premium himoyasi */}
      {currentView === 'rewards' && (
        user.isPremium ? <VoucherStore onBack={() => setCurrentView('dashboard')} /> : 
        <PremiumLockScreen title="Dúkán Jabıq" desc="Vaucherlerdi alıw ushın Premium statusı kerek." onNavigate={setCurrentView} />
      )}

      {currentView === 'learning-centers' && <LearningCenters userCoins={user.coins} onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'admin-panel' && <AdminPanel onBack={() => setCurrentView('dashboard')} />}
    </div>
  );
}

// 🔐 Lock Screen kodi yuqoridagidek qoladi...
