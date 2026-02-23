import { useState, useEffect } from 'react';
import { supabase } from '../supabase'; 
import { Loader2, Lock, Crown } from 'lucide-react';

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

// 🔐 Bloklash ekrani komponenti (Faqat bitta joyda yoziladi)
function PremiumLockScreen({ title, desc, onNavigate }: { title: string, desc: string, onNavigate: any }) {
  return (
    <div className="min-h-screen bg-[#FDFCF9] flex flex-col items-center justify-center px-10 text-center animate-in fade-in duration-500">
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-[#F5EEDC] rounded-[40px] flex items-center justify-center border-2 border-[#E8DFCC]">
          <Lock className="w-10 h-10 text-[#A0B8B4] opacity-30" />
        </div>
        <div className="absolute -right-2 -bottom-2 w-12 h-12 bg-amber-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white animate-bounce">
          <Crown className="w-6 h-6 text-white fill-white" />
        </div>
      </div>
      <h2 className="text-[#2C4A44] font-black text-2xl uppercase tracking-tight mb-3">{title}</h2>
      <p className="text-[#8DA6A1] font-bold text-sm mb-10 leading-relaxed">{desc}</p>
      <div className="w-full space-y-4">
        <button onClick={() => onNavigate('premium')} className="w-full bg-[#2EB8A6] text-white py-5 rounded-[28px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
          Premiumǵa ótiw
        </button>
        <button onClick={() => onNavigate('dashboard')} className="w-full py-4 text-[#A0B8B4] font-black uppercase text-[10px] tracking-[0.2em]">
          DASHBOARDQA QAYTIW
        </button>
      </div>
    </div>
  );
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
            isPremium: parsed.is_premium
          });

          const { data, error } = await supabase.from('users').select('*').eq('phone', userPhone).maybeSingle();
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EEDC]">
        <Loader2 className="w-12 h-12 text-[#2EB8A6] animate-spin mb-4" />
        <p className="text-[#8DA6A1] font-black uppercase text-[10px] tracking-widest">Ziyban júklenbekte...</p>
      </div>
    );
  }

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
      {currentView === 'dashboard' && <MainDashboard user={user} onNavigate={(v: any) => setCurrentView(v)} onLogout={handleLogout} />}
      {currentView === 'exercises' && <ExercisesList onBack={() => setCurrentView('dashboard')} onStartExercise={(type) => { setSelectedExerciseType(type); setCurrentView('exercise-session'); }} />}
      {currentView === 'exercise-session' && selectedExerciseType && <ExerciseSession exerciseType={selectedExerciseType} onComplete={() => setCurrentView('exercises')} onBack={() => setCurrentView('exercises')} />}
      {currentView === 'statistics' && <Statistics user={user} onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'profile' && <ProfileScreen user={user} onBack={() => setCurrentView('dashboard')} onLogout={handleLogout} />}
      {currentView === 'literature' && <Literature onBack={() => setCurrentView('dashboard')} />}

      {/* 🛡️ MOCK TEST: Faqat Premium uchun */}
      {currentView === 'mock-test' && (
        user.isPremium ? <MockTest onComplete={() => setCurrentView('dashboard')} /> : 
        <PremiumLockScreen title="Mock Test Jabıq" desc="Milliy sertifikat testlerin tapsırıw ushın Premium statusı kerek." onNavigate={setCurrentView} />
      )}

      {/* 🎁 REWARDS (COINLAR): Faqat Premium uchun */}
      {currentView === 'rewards' && (
        user.isPremium ? <VoucherStore onBack={() => setCurrentView('dashboard')} /> : 
        <PremiumLockScreen title="Dúkán Jabıq" desc="Coinlerdi vaucherlerge almastırıw tek Premium paydalanıwshılar ushın." onNavigate={setCurrentView} />
      )}

      {currentView === 'learning-centers' && <LearningCenters userCoins={user.coins} onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'admin-panel' && <AdminPanel onBack={() => setCurrentView('dashboard')} />}
      {currentView === 'premium' && <PremiumScreen onBack={() => setCurrentView('dashboard')} />}
    </div>
  );
}
