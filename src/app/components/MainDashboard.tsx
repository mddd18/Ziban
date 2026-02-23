import { useState } from 'react';
import { 
  Book, 
  Target, 
  FileText, 
  Gift, 
  GraduationCap, 
  Settings, 
  Crown, 
  Lock, 
  User, 
  Flame, 
  Home, 
  Dumbbell, 
  BarChart3,
  Sparkles
} from 'lucide-react';

const ADMIN_PHONE = "+998913773933";

interface MainDashboardProps {
  user: { 
    firstName: string; 
    lastName: string; 
    phone: string; 
    coins: number; 
    isPremium?: boolean; 
    streak?: number;       
    learnedWords?: number; 
  };
  onNavigate: (view: 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile') => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const isAdmin = cleanPhone(user.phone) === cleanPhone(ADMIN_PHONE);

  const TOTAL_APP_WORDS = 500; 
  const progressPercent = Math.min(Math.round(((user.learnedWords || 0) / TOTAL_APP_WORDS) * 100), 100);

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans pb-32" style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}>
      
      {/* 🌟 HEADER */}
      <header className="px-6 pt-10 pb-6 bg-white/50 backdrop-blur-lg sticky top-0 z-40">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#2C4A44] tracking-tight">
              Sálem, {user.firstName}!
            </h1>
            <p className="text-[#8DA6A1] font-bold text-[10px] uppercase tracking-widest mt-1">
              Úyreniwdi dawam etemiz
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button 
                onClick={() => onNavigate('admin-panel')}
                className="p-3 bg-white rounded-2xl border border-[#E8DFCC] shadow-sm text-[#2C4A44] active:scale-90 transition-all"
              >
                <Settings className="w-5 h-5" />
              </button>
            )}

            <button 
              onClick={() => onNavigate('profile')}
              className="relative w-12 h-12 bg-white rounded-2xl border-2 border-[#2EB8A6] p-1 shadow-sm active:scale-95 transition-all overflow-hidden"
            >
              <div className="w-full h-full bg-[#E6F4F1] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-[#2EB8A6]" />
              </div>
            </button>
          </div>
        </div>

        {/* STATISTIKA PANEL */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white px-4 py-2.5 rounded-[20px] flex-1 border border-[#E8DFCC] shadow-sm">
            <Flame className="w-5 h-5 text-[#FF9500] mr-2" />
            <span className="font-black text-[#2C4A44]">{user.streak || 0}</span>
            <span className="text-[8px] font-black text-[#8DA6A1] ml-1 uppercase">Kún</span>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2.5 rounded-[20px] flex-1 border border-[#E8DFCC] shadow-sm">
            <div className="w-5 h-5 bg-[#F4C150] rounded-lg flex items-center justify-center mr-2 shadow-inner">
              <span className="text-white text-[10px] font-black">C</span>
            </div>
            <span className="font-black text-[#2C4A44]">{user.coins || 0}</span>
          </div>
        </div>
      </header>

      {/* 🌟 ASOSIY KONTENT */}
      <main className="px-6 mt-6 space-y-6">
        {/* PROGRESS CARD */}
        <div 
          onClick={() => onNavigate('exercises')}
          className="bg-white rounded-[40px] p-7 shadow-[0_15px_35px_rgba(0,0,0,0.03)] border-b-[6px] border-[#E8DFCC] relative overflow-hidden cursor-pointer active:translate-y-1 active:border-b-0 transition-all group"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#2EB8A6]/5 rounded-full group-hover:scale-110 transition-transform"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-4 h-4 text-[#2EB8A6] animate-pulse" />
              <p className="text-[#2EB8A6] font-black text-[10px] uppercase tracking-[0.2em]">Házirgi nátiyje</p>
            </div>
            <h2 className="text-xl font-black text-[#2C4A44] mb-4">Sózler hám Terminler</h2>
            <div className="flex items-center justify-between">
              <div className="flex-1 bg-[#F5EEDC] h-3.5 rounded-full mr-4 overflow-hidden shadow-inner">
                <div 
                  className="bg-[#2EB8A6] h-full rounded-full relative transition-all duration-1000"
                  style={{ width: `${progressPercent}%` }}
                >
                  <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 skew-x-[-20deg]"></div>
                </div>
              </div>
              <span className="font-black text-[#2C4A44] text-xs">{progressPercent}%</span>
            </div>
          </div>
        </div>

        <h3 className="font-black text-[#2C4A44] text-lg px-2 flex items-center gap-2">
           Kategoriyalar
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* MOCK TEST */}
          <button onClick={() => onNavigate('mock-test')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative group">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6 text-[#2EB8A6]" />
            </div>
            <h3 className="font-black text-[#2C4A44] text-base mb-1">Mock Test</h3>
            <p className="text-[9px] font-black text-[#8DA6A1] uppercase tracking-tighter">Milliy Sertifikat</p>
          </button>

          {/* ÁDEBIYATLAR */}
          <button onClick={() => onNavigate('literature')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all group">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Book className="w-6 h-6 text-[#FF9500]" />
            </div>
            <h3 className="font-black text-[#2C4A44] text-base mb-1">Ádebiyatlar</h3>
            <p className="text-[9px] font-black text-[#8DA6A1] uppercase tracking-tighter">Kitaplar</p>
          </button>

          {/* OQIW MERKEZLERI */}
          <button onClick={() => onNavigate('learning-centers')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all group">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6 text-[#F44336]" />
            </div>
            <h3 className="font-black text-[#2C4A44] text-base mb-1">Merkezler</h3>
            <p className="text-[9px] font-black text-[#8DA6A1] uppercase tracking-tighter">Kurslar</p>
          </button>

          {/* SÓWǴALAR */}
          <button onClick={() => onNavigate('rewards')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative group">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Gift className="w-6 h-6 text-[#9C27B0]" />
            </div>
            <h3 className="font-black text-[#2C4A44] text-base mb-1">Sówǵalar</h3>
            <p className="text-[9px] font-black text-[#8DA6A1] uppercase tracking-tighter">Coin Almasıw</p>
          </button>
        </div>
      </main>

      {/* 🌟 BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#F0EBE0] px-4 pt-3 pb-8 flex justify-around items-center z-50 rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.04)]">
        
        {/* BAS MENU */}
        <button onClick={() => { setActiveTab('home'); onNavigate('dashboard'); }} className={`flex flex-col items-center min-w-[64px] transition-all ${activeTab === 'home' ? 'text-[#2EB8A6] scale-110' : 'text-[#A0B8B4]'}`}>
          <Home className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'fill-[#2EB8A6]/10' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Bas Menu</span>
        </button>
        
        {/* SHINIǴIWLAR */}
        <button onClick={() => { setActiveTab('explore'); onNavigate('exercises'); }} className={`flex flex-col items-center min-w-[64px] transition-all ${activeTab === 'explore' ? 'text-[#2EB8A6] scale-110' : 'text-[#A0B8B4]'}`}>
          <Dumbbell className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Shınıǵıwlar</span>
        </button>

        {/* PREMIUM (Barcha foydalanuvchilar uchun markaziy tugma) */}
        <button onClick={() => onNavigate('premium')} className="relative -mt-12 bg-[#2EB8A6] p-4 rounded-full shadow-lg shadow-emerald-200 border-4 border-[#FDFCF9] active:scale-90 transition-all">
          <Crown className="w-7 h-7 text-white fill-white/20" />
        </button>

        {/* STATISTIKA */}
        <button onClick={() => { setActiveTab('stats'); onNavigate('statistics'); }} className={`flex flex-col items-center min-w-[64px] transition-all ${activeTab === 'stats' ? 'text-[#2EB8A6] scale-110' : 'text-[#A0B8B4]'}`}>
          <BarChart3 className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Statistika</span>
        </button>

        {/* PROFIL / ADMIN */}
        {isAdmin ? (
          <button onClick={() => onNavigate('admin-panel')} className="flex flex-col items-center min-w-[64px] text-[#A0B8B4]">
            <Settings className="w-6 h-6 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Admin</span>
          </button>
        ) : (
          <button onClick={() => onNavigate('profile')} className={`flex flex-col items-center min-w-[64px] transition-all ${activeTab === 'profile' ? 'text-[#2EB8A6] scale-110' : 'text-[#A0B8B4]'}`}>
            <User className="w-6 h-6 mb-1" />
            <span className="text-[9px] font-black uppercase tracking-tighter">Profil</span>
          </button>
        )}
      </nav>
    </div>
  );
}
