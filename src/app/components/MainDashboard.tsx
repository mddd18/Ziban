import { useState } from 'react';
import { Book, Target, FileText, Gift, GraduationCap, Settings, Crown, Lock, User, Flame, Home, Compass, BarChart2 } from 'lucide-react';

const ADMIN_PHONE = "+998901234567"; // O'zingizning admin raqamingiz

interface MainDashboardProps {
  user: { 
    firstName: string; 
    lastName: string; 
    phone: string; 
    coins: number; 
    isPremium?: boolean; 
    streak?: number;       // Bazadagi yangi ustun
    learnedWords?: number; // Bazadagi yangi ustun
  };
  onNavigate: (view: 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium' | 'profile') => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [activeTab, setActiveTab] = useState('home');

  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const isAdmin = cleanPhone(user.phone) === cleanPhone(ADMIN_PHONE);

  // 📊 O'zlashtirish foizini hisoblash (Jami 500 ta savol bor deb faraz qilamiz)
  const TOTAL_APP_WORDS = 500; 
  const progressPercent = Math.min(Math.round(((user.learnedWords || 0) / TOTAL_APP_WORDS) * 100), 100);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F4F1] to-[#F5EEDC] font-sans pb-24" style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}>
      
      {/* 🌟 HEADER */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2C4A44] tracking-tight">
              Sálem, {user.firstName}!
            </h1>
            <p className="text-[#5A7A74] font-bold text-sm mt-1">
              Qaraqalpaqsha úyreniwdi dawam etemiz
            </p>
          </div>
          
          <div className="relative">
             {/* ✅ PROFIL TUGMASI: ENDI PROFIL OYNASIGA O'TADI */}
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

        {/* STATISTIKA: DINAMIK STREAK VA COINLAR */}
        <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-md rounded-2xl p-3 shadow-[0_4px_12px_rgba(46,184,166,0.1)] border border-white/80">
          <div className="flex items-center bg-[#FFF4E5] px-4 py-2 rounded-xl flex-1 justify-center">
            <Flame className="w-6 h-6 text-[#FF9500] mr-2" />
            <span className="font-black text-[#FF9500] text-lg">{user.streak || 0}</span>
            <span className="text-xs font-bold text-[#FF9500]/70 ml-1 uppercase">Kún</span>
          </div>
          
          <div className="flex items-center bg-[#E6F4F1] px-4 py-2 rounded-xl flex-1 justify-center">
            <div className="w-6 h-6 bg-[#F4C150] rounded-full flex items-center justify-center mr-2 shadow-sm border border-[#E0B042]">
              <span className="text-white text-xs font-black">C</span>
            </div>
            <span className="font-black text-lg text-[#2EB8A6]">{user.coins || 0}</span>
          </div>
        </div>
      </header>

      {/* 🌟 ASOSIY KONTENT */}
      <main className="px-6 space-y-6">
        
        {/* PROGRESS KARTA: DINAMIK FOIZ CHIZIG'I */}
        <div 
          onClick={() => onNavigate('exercises')}
          className="bg-white rounded-[32px] p-6 shadow-[0_8px_24px_rgba(44,74,68,0.06)] border-b-[6px] border-[#E8DFCC] relative overflow-hidden cursor-pointer active:border-b-0 active:translate-y-[6px] transition-all group"
        >
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#F5EEDC]/50 rounded-full group-hover:scale-110 transition-transform"></div>
          
          <p className="text-[#8DA6A1] font-extrabold text-sm uppercase tracking-wider mb-2 relative z-10">Dawam etiw</p>
          <h2 className="text-2xl font-black text-[#2C4A44] mb-4 relative z-10">Sózler hám Terminler</h2>
          
          <div className="flex items-center justify-between relative z-10">
            <div className="w-full bg-[#F5EEDC] h-4 rounded-full mr-4 overflow-hidden">
              <div 
                className="bg-[#2EB8A6] h-full rounded-full relative transition-all duration-1000"
                style={{ width: `${progressPercent}%` }}
              >
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/30 skew-x-[-20deg]"></div>
              </div>
            </div>
            <span className="font-bold text-[#8DA6A1]">{progressPercent}%</span>
          </div>
        </div>

        <h3 className="font-black text-[#2C4A44] text-xl px-2">Kategoriyalar</h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Mock Test */}
          <button onClick={() => user.isPremium ? onNavigate('mock-test') : onNavigate('premium')} className={`bg-white rounded-[28px] p-5 text-left border-b-[6px] active:border-b-0 active:translate-y-[6px] transition-all relative overflow-hidden ${user.isPremium ? 'border-[#E8DFCC] hover:bg-[#FAFAFA]' : 'border-gray-200 opacity-90'}`}>
            {!user.isPremium && <div className="absolute top-3 right-3 bg-gray-100 rounded-full p-1.5"><Lock className="w-4 h-4 text-gray-400" /></div>}
            <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mb-4"><FileText className="w-6 h-6 text-[#2EB8A6]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Mock Test</h3>
            <p className="text-xs font-bold text-[#8DA6A1] uppercase">Aynıǵa 1 ret</p>
          </button>

          {/* Adabiyotlar */}
          <button onClick={() => onNavigate('literature')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] hover:bg-[#FAFAFA] active:border-b-0 active:translate-y-[6px] transition-all">
            <div className="w-12 h-12 bg-[#FFF4E5] rounded-2xl flex items-center justify-center mb-4"><Book className="w-6 h-6 text-[#FF9500]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Ádebiyatlar</h3>
            <p className="text-xs font-bold text-[#8DA6A1] uppercase">Kitaplar</p>
          </button>

          {/* O'quv markazlari */}
          <button onClick={() => onNavigate('learning-centers')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] hover:bg-[#FAFAFA] active:border-b-0 active:translate-y-[6px] transition-all">
            <div className="w-12 h-12 bg-[#FEEBEE] rounded-2xl flex items-center justify-center mb-4"><GraduationCap className="w-6 h-6 text-[#F44336]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Merkezler</h3>
            <p className="text-xs font-bold text-[#8DA6A1] uppercase">Offlayn</p>
          </button>

          {/* Sovg'alar */}
          <button onClick={() => user.isPremium ? onNavigate('rewards') : onNavigate('premium')} className="bg-white rounded-[28px] p-5 text-left border-b-[6px] border-[#E8DFCC] hover:bg-[#FAFAFA] active:border-b-0 active:translate-y-[6px] transition-all">
            <div className="w-12 h-12 bg-[#F3E5F5] rounded-2xl flex items-center justify-center mb-4"><Gift className="w-6 h-6 text-[#9C27B0]" /></div>
            <h3 className="font-black text-[#2C4A44] text-lg mb-1">Sovǵalar</h3>
            <p className="text-xs font-bold text-[#8DA6A1] uppercase">Coin almasıw</p>
          </button>
        </div>
      </main>

      {/* 🌟 BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 rounded-t-[32px] px-6 py-4 flex justify-between items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-50 pb-safe">
        <button onClick={() => { setActiveTab('home'); onNavigate('dashboard'); }} className={`flex flex-col items-center p-2 ${activeTab === 'home' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <Home className={`w-7 h-7 mb-1 ${activeTab === 'home' ? 'fill-[#2EB8A6]' : ''}`} />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Uy</span>
        </button>
        <button onClick={() => { setActiveTab('explore'); onNavigate('exercises'); }} className={`flex flex-col items-center p-2 ${activeTab === 'explore' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <Compass className={`w-7 h-7 mb-1 ${activeTab === 'explore' ? 'fill-[#2EB8A6]' : ''}`} />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Úyreniw</span>
        </button>
        <button onClick={() => { setActiveTab('stats'); onNavigate('statistics'); }} className={`flex flex-col items-center p-2 ${activeTab === 'stats' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <BarChart2 className={`w-7 h-7 mb-1 ${activeTab === 'stats' ? 'fill-[#2EB8A6]' : ''}`} />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Jetistik</span>
        </button>
        <button onClick={() => { setActiveTab('profile'); onNavigate('profile'); }} className={`flex flex-col items-center p-2 ${activeTab === 'profile' ? 'text-[#2EB8A6]' : 'text-[#A0B8B4]'}`}>
          <User className={`w-7 h-7 mb-1 ${activeTab === 'profile' ? 'fill-[#2EB8A6]' : ''}`} />
          <span className="text-[11px] font-extrabold uppercase tracking-wide">Profil</span>
        </button>
      </nav>
    </div>
  );
}
