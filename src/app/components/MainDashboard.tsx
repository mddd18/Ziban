import { useState } from 'react';
import { supabase } from '../../supabase'; // ✅ Build xatosi yechimi
import { 
  Book, 
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
    role?: string;
  };
  onNavigate: (view: any) => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const isAdmin = cleanPhone(user.phone) === cleanPhone(ADMIN_PHONE);

  const TOTAL_APP_WORDS = 500; 
  const progressPercent = Math.min(Math.round(((user.learnedWords || 0) / TOTAL_APP_WORDS) * 100), 100);

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans pb-32">
      
      {/* 🌟 HEADER */}
      <header className="px-6 pt-10 pb-6 bg-white/50 backdrop-blur-lg sticky top-0 z-40 border-b border-[#F0EBE0]">
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black text-[#2C4A44] tracking-tight">
              Sálem, {user.firstName}!
            </h1>
            <div className="flex items-center gap-2 mt-1">
               <span className="text-[#8DA6A1] font-black text-[9px] uppercase tracking-widest">
                 {user.role || 'Paydalanıwshı'}
               </span>
               {user.isPremium && <Crown className="w-3 h-3 text-[#F4C150] fill-[#F4C150]" />}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <button onClick={() => onNavigate('admin-panel')} className="p-3 bg-white rounded-2xl border border-[#E8DFCC] shadow-sm text-[#2C4A44]">
                <Settings className="w-5 h-5" />
              </button>
            )}
            <button onClick={() => onNavigate('profile')} className="w-12 h-12 bg-white rounded-2xl border-2 border-[#2EB8A6] p-1 shadow-sm overflow-hidden">
              <div className="w-full h-full bg-[#E6F4F1] rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-[#2EB8A6]" />
              </div>
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-white px-4 py-2.5 rounded-[20px] flex-1 border border-[#E8DFCC] shadow-sm">
            <Flame className="w-5 h-5 text-[#FF9500] mr-2" />
            <span className="font-black text-[#2C4A44]">{user.streak || 0}</span>
          </div>
          <div className="flex items-center bg-white px-4 py-2.5 rounded-[20px] flex-1 border border-[#E8DFCC] shadow-sm">
            <div className="w-5 h-5 bg-[#F4C150] rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-[10px] font-black">C</span>
            </div>
            <span className="font-black text-[#2C4A44]">{user.coins || 0}</span>
          </div>
        </div>
      </header>

      {/* 🌟 MAIN CONTENT */}
      <main className="px-6 mt-6 space-y-6">
        <div onClick={() => onNavigate('exercises')} className="bg-white rounded-[40px] p-7 shadow-sm border-b-[6px] border-[#E8DFCC] relative overflow-hidden active:translate-y-1 active:border-b-0 transition-all group">
          <div className="relative z-10">
            <h2 className="text-xl font-black text-[#2C4A44] mb-4">Sózler hám Terminler</h2>
            <div className="flex items-center justify-between">
              <div className="flex-1 bg-[#F5EEDC] h-3 rounded-full mr-4 overflow-hidden">
                <div className="bg-[#2EB8A6] h-full rounded-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
              </div>
              <span className="font-black text-[#2C4A44] text-xs">{progressPercent}%</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate('mock-test')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <FileText className="w-8 h-8 text-[#2EB8A6] mb-4" />
            <h3 className="font-black text-[#2C4A44] text-sm">Mock Test</h3>
          </button>

          <button onClick={() => onNavigate('literature')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all">
            <Book className="w-8 h-8 text-[#FF9500] mb-4" />
            <h3 className="font-black text-[#2C4A44] text-sm">Ádebiyatlar</h3>
          </button>

          <button onClick={() => onNavigate('learning-centers')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all">
            <GraduationCap className="w-8 h-8 text-[#F44336] mb-4" />
            <h3 className="font-black text-[#2C4A44] text-sm">Merkezler</h3>
          </button>

          <button onClick={() => onNavigate('rewards')} className="bg-white rounded-[35px] p-6 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <Gift className="w-8 h-8 text-[#9C27B0] mb-4" />
            <h3 className="font-black text-[#2C4A44] text-sm">Sówǵalar</h3>
          </button>
        </div>

        {/* 💎 PREMIUM BANNER (Faqat Premium emaslar uchun) */}
        {!user.isPremium && (
          <div onClick={() => onNavigate('premium')} className="bg-gradient-to-r from-[#2EB8A6] to-[#26A69A] rounded-[35px] p-6 text-white relative overflow-hidden shadow-lg active:scale-95 transition-all">
            <div className="relative z-10">
               <h4 className="font-black text-lg">Premium alıw</h4>
               <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1">Barlıq imkaniyatlarǵa jol ashıń</p>
            </div>
            <Crown className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 text-white/20 rotate-12" />
          </div>
        )}
      </main>

      {/* 🌟 BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#F0EBE0] px-4 pt-3 pb-8 flex justify-around items-center z-50 rounded-t-[40px] shadow-2xl">
        <button onClick={() => onNavigate('dashboard')} className={`flex flex-col items-center min-w-[64px] ${activeTab === 'home' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <Home className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase">Bas Menu</span>
        </button>
        
        <button onClick={() => onNavigate('exercises')} className="flex flex-col items-center min-w-[64px] text-[#A0B8B4]">
          <Dumbbell className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase">Shınıǵıwlar</span>
        </button>

        {/* MARKAZIY TUGMA: Premiumlar uchun Crown o'rniga boshqa narsa qo'ysak bo'ladi, 
            lekin hozircha faqat premium emaslar uchun ko'rinadigan qildik yoki o'zi turaveradi */}
        {!user.isPremium ? (
          <button onClick={() => onNavigate('premium')} className="relative -mt-12 bg-[#2EB8A6] p-4 rounded-full shadow-lg border-4 border-[#FDFCF9]">
            <Crown className="w-7 h-7 text-white fill-white/20" />
          </button>
        ) : (
          <button onClick={() => onNavigate('premium')} className="relative -mt-12 bg-[#F4C150] p-4 rounded-full shadow-lg border-4 border-[#FDFCF9]">
            <Crown className="w-7 h-7 text-white fill-white" />
          </button>
        )}

        <button onClick={() => onNavigate('statistics')} className="flex flex-col items-center min-w-[64px] text-[#A0B8B4]">
          <BarChart3 className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase">Statistika</span>
        </button>

        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center min-w-[64px] text-[#A0B8B4]">
          <User className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase">Profil</span>
        </button>
      </nav>
    </div>
  );
}
