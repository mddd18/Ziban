import { useState } from 'react';
import { Book, Target, FileText, Gift, GraduationCap, Settings, Crown, Lock, User, Flame, Home, Dumbbell, BarChart3, Sparkles } from 'lucide-react';

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
      <header className="px-6 pt-10 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2C4A44] tracking-tight">
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
                className="p-3 bg-white/50 rounded-2xl border border-[#E8DFCC] shadow-sm text-[#2C4A44] active:scale-90 transition-all"
              >
                <Settings className="w-6 h-6" />
              </button>
            )}

            <div className="relative">
               <div 
                 className="w-14 h-14 bg-white rounded-full border-4 border-[#2EB8A6] p-1 shadow-md cursor-pointer transition-transform active:scale-95" 
                 onClick={() => onNavigate('profile')}
               >
                 <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center">
                   <User className="w-6 h-6 text-[#2EB8A6]" />
                 </div>
               </div>
               {user.isPremium && (
                  <div className="absolute -bottom-1 -right-1 bg-[#F4C150] rounded-full p-1 border-2 border-white shadow-sm">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
            </div>
          </div>
        </div>

        {/* STATISTIKA PANEL */}
        <div className="flex items-center space-x-4 mb-6">
          <div className="flex items-center bg-white px-4 py-2.5 rounded-2xl flex-1 justify-center border border-[#E8DFCC] shadow-sm">
            <Flame className="w-6 h-6 text-[#FF9500] mr-2" />
            <span className="font-black text-[#2C4A44] text-lg">{user.streak || 0}</span>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2.5 rounded-2xl flex-1 justify-center border border-[#E8DFCC] shadow-sm">
            <div className="w-6 h-6 bg-[#F4C150] rounded-lg flex items-center justify-center mr-2 shadow-inner">
              <span className="text-white text-xs font-black">C</span>
            </div>
            <span className="font-black text-lg text-[#2C4A44]">{user.coins || 0}</span>
          </div>
        </div>

        {/* 💎 PREMIUM REKLAMA BANNERI (Faqat premium emaslar uchun) */}
        {!user.isPremium && (
          <div 
            onClick={() => onNavigate('premium')}
            className="bg-gradient-to-r from-[#2EB8A6] to-[#26A69A] rounded-[30px] p-6 text-white relative overflow-hidden shadow-lg shadow-emerald-100 cursor-pointer active:scale-95 transition-all mb-4"
          >
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <h4 className="font-black text-lg uppercase tracking-tight">Premiumǵa ótiń!</h4>
                <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-0.5">Barlıq imkaniyatlarǵa jol ashıń</p>
              </div>
              <Crown className="w-10 h-10 text-white/30 rotate-12" />
            </div>
            {/* Orqa fondagi dekorativ doira */}
            <div className="absolute -right-2 -bottom-2 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
          </div>
        )}
      </header>

      {/* 🌟 ASOSIY KONTENT */}
      <main className="px-6 space-y-6">
        <div 
          onClick={() => onNavigate('exercises')}
          className="bg-white rounded-[40px] p-7 shadow-sm border-b-[6px] border-[#E8DFCC] relative overflow-hidden cursor-pointer active:translate-y-1 active:border-b-0 transition-all"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-[#F5EEDC]/50 rounded-full"></div>
          <div className="relative z-10">
            <p className="text-[#8DA6A1] font-black text-[10px] uppercase tracking-[0.2em] mb-2">Dawam etiw</p>
            <h2 className="text-2xl font-black text-[#2C4A44] mb-4">Sózler hám Terminler</h2>
            <div className="flex items-center justify-between">
              <div className="flex-1 bg-[#F5EEDC] h-4 rounded-full mr-4 overflow-hidden">
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

        <h3 className="font-black text-[#2C4A44] text-xl px-2">Kategoriyalar</h3>

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => user.isPremium ? onNavigate('mock-test') : onNavigate('premium')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4"><FileText className="w-6 h-6 text-[#2EB8A6]" /></div>
            <h3 className="font-black text-[#2C4A44] text-base mb-1">Mock Test</h3>
            <p className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Sertifikat</p>
          </button>

          <button onClick={() => onNavigate('literature')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4"><Book className="w-6 h-6 text-[#FF9500]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Ádebiyatlar</h3>
            <p className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Kitaplar</p>
          </button>

          <button onClick={() => onNavigate('learning-centers')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-[#F44336]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Merkezler</h3>
            <p className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Kurslar</p>
          </button>

          <button onClick={() => user.isPremium ? onNavigate('rewards') : onNavigate('premium')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] active:translate-y-1 active:border-b-0 transition-all relative">
            {!user.isPremium && <Lock className="absolute top-4 right-4 w-4 h-4 text-[#A0B8B4]" />}
            <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-4"><Gift className="w-6 h-6 text-[#9C27B0]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Sówǵalar</h3>
            <p className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Coinler</p>
          </button>
        </div>
      </main>

      {/* 🌟 BOTTOM NAVIGATION (4 tali klassik menyu) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-[#F0EBE0] px-6 pt-3 pb-8 flex justify-between items-center z-50 rounded-t-[40px] shadow-2xl">
        
        {/* BAS MENU */}
        <button onClick={() => { setActiveTab('home'); onNavigate('dashboard'); }} className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <Home className={`w-6 h-6 mb-1 ${activeTab === 'home' ? 'fill-[#2EB8A6]/10' : ''}`} />
          <span className="text-[9px] font-black uppercase tracking-tighter">Bas Menu</span>
        </button>
        
        {/* SHINIǴIWLAR */}
        <button onClick={() => { setActiveTab('explore'); onNavigate('exercises'); }} className={`flex flex-col items-center p-2 ${activeTab === 'explore' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <Dumbbell className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Shınıǵıwlar</span>
        </button>

        {/* STATISTIKA */}
        <button onClick={() => { setActiveTab('stats'); onNavigate('statistics'); }} className={`flex flex-col items-center p-2 ${activeTab === 'stats' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <BarChart3 className="w-6 h-6 mb-1" />
          <span className="text-[9px] font-black uppercase tracking-tighter">Statistika</span>
        </button>

        {/* PROFIL / ADMIN */}
        <button onClick={() => isAdmin ? onNavigate('admin-panel') : onNavigate('profile')} className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          {isAdmin ? <Settings className="w-6 h-6 mb-1" /> : <User className="w-6 h-6 mb-1" />}
          <span className="text-[9px] font-black uppercase tracking-tighter">{isAdmin ? 'Admin' : 'Profil'}</span>
        </button>
      </nav>
    </div>
  );
}
