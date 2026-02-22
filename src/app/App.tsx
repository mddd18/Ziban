import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import { Loader2 } from 'lucide-react';

// Komponentlarni import qilish
import LoginScreen from './components/LoginScreen';
import MainDashboard from './components/MainDashboard';
import ExercisesList from './components/ExercisesList';
import ExerciseSession from './components/ExerciseSession';
import Statistics from './components/Statistics';
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
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedExerciseType, setSelectedExerciseType] = useState<any>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        // 1. LocalStorage dan barcha kerakli ma'lumotlarni tekshirish
        const storedUser = localStorage.getItem('user');
        const userPhone = localStorage.getItem('userPhone');

        if (storedUser && userPhone) {
          // 2. Avval vaqtinchalik ma'lumotni o'rnatamiz (Login chiqib ketmasligi uchun)
          const parsed = JSON.parse(storedUser);
          setUser({
            firstName: parsed.first_name || parsed.firstName,
            lastName: parsed.last_name || parsed.lastName,
            phone: userPhone,
            coins: parsed.coins || 0,
            streak: parsed.streak || 0,
            learnedWords: parsed.learned_words || 0,
            isPremium: parsed.is_premium
          });

          // 3. Bazadan eng yangi ma'lumotlarni sinxronizatsiya qilamiz
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('phone', userPhone)
            .maybeSingle();

          if (data && !error) {
            const freshUser = {
              firstName: data.first_name,
              lastName: data.last_name,
              phone: data.phone,
              coins: data.coins || 0,
              streak: data.streak || 0,
              learnedWords: data.learned_words || 0,
              isPremium: data.is_premium
            };
            setUser(freshUser);
            localStorage.setItem('user', JSON.stringify(data));
          }
        }
      } catch (err) {
        console.error("Auth error:", err);
      } finally {
        // 4. Har qanday holatda ham tekshiruv tugagach loadingni to'xtatamiz
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleUpdateCoins = async (newCoins: number) => {
    if (user) {
      const { error } = await supabase
        .from('users')
        .update({ coins: newCoins })
        .eq('phone', user.phone);
      
      if (!error) {
        setUser({ ...user, coins: newCoins });
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        localStorage.setItem('user', JSON.stringify({ ...stored, coins: newCoins }));
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setCurrentView('dashboard');
  };

  // ✅ BU JUDA MUHIM: Loading vaqtida Loginni ko'rsatmaslik!
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EEDC]">
        <Loader2 className="w-12 h-12 text-[#2EB8A6] animate-spin mb-4" />
        <p className="text-[#8DA6A1] font-black uppercase text-[10px] tracking-widest">Ziyban júklenbekte...</p>
      </div>
    );
  }

  // ✅ Agar loading tugagan bo'lsa va user bo'lmasa, keyin Login chiqadi
  if (!user) {
    return (
      <LoginScreen onLogin={(userData) => {
        setUser(userData);
        localStorage.setItem('userPhone', userData.phone);
        localStorage.setItem('user', JSON.stringify(userData));
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EEDC]">
      {currentView === 'dashboard' && (
        <MainDashboard user={user} onNavigate={(v: any) => setCurrentView(v)} onLogout={handleLogout} />
      )}
      
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

      {currentView === 'statistics' && <Statistics user={user} onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'profile' && <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />}
      {currentView === 'literature' && <Literature onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'mock-test' && <MockTest onComplete={() => setCurrentView('dashboard')} />}
      {currentView === 'rewards' && <VoucherStore onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'learning-centers' && <LearningCenters userCoins={user.coins} onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'admin-panel' && <AdminPanel onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'premium' && <PremiumScreen onBack={() => setCurrentView('dashboard')} onUpgradeSuccess={() => setUser({...user, isPremium: true})} />}
    </div>
  );
}
