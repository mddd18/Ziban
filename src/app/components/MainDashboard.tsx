// src/app/components/MainDashboard.tsx

import { useState } from 'react';
import { Book, Target, FileText, Gift, GraduationCap, Settings, Crown, Lock, User, Flame, Home, Compass, BarChart2 } from 'lucide-react';

const ADMIN_PHONE = "+998913773933"; // 👈 O'zingizning raqamingizni tekshiring

interface MainDashboardProps {
  user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean; streak?: number; learnedWords?: number };
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
    <div className="min-h-screen bg-gradient-to-b from-[#E6F4F1] to-[#F5EEDC] font-sans pb-24">
      {/* HEADER */}
      <header className="px-6 pt-8 pb-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-black text-[#2C4A44]">Sálem, {user.firstName}!</h1>
            <p className="text-[#5A7A74] font-bold text-sm">Qaraqalpaqsha úyreniwdi dawam etemiz</p>
          </div>
          <div 
            className="w-14 h-14 bg-white rounded-full border-4 border-[#2EB8A6] p-1 shadow-md cursor-pointer active:scale-95 transition-all"
            onClick={() => onNavigate('profile')}
          >
            <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center relative">
              <User className="w-6 h-6 text-[#2EB8A6]" />
              {user.isPremium && <Crown className="absolute -top-2 -right-2 w-5 h-5 text-[#F4C150] fill-[#F4C150]" />}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="flex items-center space-x-4 bg-white/60 backdrop-blur-md rounded-2xl p-3 border border-white/80">
          <div className="flex items-center bg-[#FFF4E5] px-4 py-2 rounded-xl flex-1 justify-center">
            <Flame className="w-6 h-6 text-[#FF9500] mr-2" />
            <span className="font-black text-[#FF9500] text-lg">{user.streak || 0}</span>
          </div>
          <div className="flex items-center bg-[#E6F4F1] px-4 py-2 rounded-xl flex-1 justify-center">
            <div className="w-6 h-6 bg-[#F4C150] rounded-full flex items-center justify-center mr-2 shadow-sm">
              <span className="text-white text-[10px] font-black">C</span>
            </div>
            <span className="font-black text-lg text-[#2EB8A6]">{user.coins || 0}</span>
          </div>
        </div>
      </header>

      <main className="px-6 space-y-6">
        {/* PROGRESS KARTA */}
        <div onClick={() => onNavigate('exercises')} className="bg-white rounded-[32px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC] cursor-pointer active:translate-y-1 active:border-b-0 transition-all">
          <p className="text-[#8DA6A1] font-extrabold text-xs uppercase mb-1">Dawam etiw</p>
          <h2 className="text-xl font-black text-[#2C4A44] mb-4">Sózler hám Terminler</h2>
          <div className="flex items-center">
            <div className="flex-1 bg-[#F5EEDC] h-3 rounded-full overflow-hidden mr-3">
              <div className="bg-[#2EB8A6] h-full transition-all duration-1000" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <span className="font-bold text-[#8DA6A1] text-sm">{progressPercent}%</span>
          </div>
        </div>

        {/* ADMIN PANEL TUGMASI (FAQAT ADMINLARGA KO'RINADI) */}
        {isAdmin && (
          <button 
            onClick={() => onNavigate('admin-panel')}
            className="w-full bg-[#2C4A44] text-white p-4 rounded-2xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center space-x-3"
          >
            <Settings className="w-6 h-6" />
            <span>Admin Paneli</span>
          </button>
        )}

        <div className="grid grid-cols-2 gap-4">
          <button onClick={() => onNavigate('mock-test')} className="bg-white p-5 rounded-[28px] border-b-[6px] border-[#E8DFCC] text-left">
            <div className="w-10 h-10 bg-[#E6F4F1] rounded-xl flex items-center justify-center mb-3"><FileText className="text-[#2EB8A6]" /></div>
            <p className="font-black text-[#2C4A44]">Mock Test</p>
          </button>
          <button onClick={() => onNavigate('literature')} className="bg-white p-5 rounded-[28px] border-b-[6px] border-[#E8DFCC] text-left">
            <div className="w-10 h-10 bg-[#FFF4E5] rounded-xl flex items-center justify-center mb-3"><Book className="text-[#FF9500]" /></div>
            <p className="font-black text-[#2C4A44]">Ádebiyatlar</p>
          </button>
        </div>
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t p-4 flex justify-around items-center rounded-t-[30px] shadow-2xl">
        <button onClick={() => onNavigate('dashboard')} className="flex flex-col items-center text-[#2EB8A6]"><Home className="fill-[#2EB8A6]" /><span className="text-[10px] font-bold uppercase">Uy</span></button>
        <button onClick={() => onNavigate('exercises')} className="flex flex-col items-center text-[#A0B8B4]"><Compass /><span className="text-[10px] font-bold uppercase">Úyreniw</span></button>
        <button onClick={() => onNavigate('statistics')} className="flex flex-col items-center text-[#A0B8B4]"><BarChart2 /><span className="text-[10px] font-bold uppercase">Jetistik</span></button>
        <button onClick={() => onNavigate('profile')} className="flex flex-col items-center text-[#A0B8B4]"><User /><span className="text-[10px] font-bold uppercase">Profil</span></button>
      </nav>
    </div>
  );
}
