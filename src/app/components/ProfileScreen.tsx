// src/app/components/ProfileScreen.tsx

import { User, LogOut, Award, Calendar, ChevronLeft, ShieldCheck, Mail, Phone } from 'lucide-react';

interface ProfileScreenProps {
  user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean; streak?: number; learnedWords?: number };
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans">
      {/* TOP HEADER */}
      <div className="bg-[#2EB8A6] pt-12 pb-20 px-6 rounded-b-[50px] relative shadow-lg">
        <button onClick={onBack} className="absolute top-12 left-6 p-2 bg-white/20 rounded-xl text-white backdrop-blur-md">
          <ChevronLeft />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-28 h-28 bg-white rounded-full p-1 border-4 border-[#F4C150] shadow-xl relative">
            <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center overflow-hidden">
              <User className="w-16 h-16 text-[#2EB8A6]" />
            </div>
            {user.isPremium && <ShieldCheck className="absolute -bottom-1 -right-1 w-8 h-8 text-[#F4C150] bg-white rounded-full p-1 border-2 border-[#2EB8A6]" />}
          </div>
          <h2 className="text-white text-2xl font-black mt-4 uppercase tracking-tight">{user.firstName} {user.lastName}</h2>
          <span className="bg-[#1D8E7F] text-white/90 px-4 py-1 rounded-full text-xs font-bold mt-2 border border-white/20 uppercase tracking-widest">
            {user.isPremium ? 'PRO Paydalanıwshı' : 'Oqıwshı'}
          </span>
        </div>
      </div>

      {/* STATS KARTALARI */}
      <div className="px-6 -mt-10 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[30px] shadow-sm border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
          <Calendar className="w-8 h-8 text-[#FF9500] mb-2" />
          <span className="text-2xl font-black text-[#2C4A44]">{user.streak || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase">Streak</span>
        </div>
        <div className="bg-white p-5 rounded-[30px] shadow-sm border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
          <Award className="w-8 h-8 text-[#2EB8A6] mb-2" />
          <span className="text-2xl font-black text-[#2C4A44]">{user.learnedWords || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase">Sózler</span>
        </div>
      </div>

      {/* INFO LIST */}
      <div className="px-6 mt-8 space-y-4">
        <div className="bg-white/50 p-4 rounded-2xl flex items-center border border-white">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-4 shadow-sm"><Phone className="w-5 h-5 text-[#2EB8A6]" /></div>
          <div><p className="text-[10px] font-bold text-[#8DA6A1] uppercase">Telefon</p><p className="font-black text-[#2C4A44]">{user.phone}</p></div>
        </div>

        <button 
          onClick={onLogout}
          className="w-full bg-[#FEEBEE] p-5 rounded-2xl flex items-center justify-center space-x-3 border-b-[6px] border-[#FFCDD2] active:translate-y-1 active:border-b-0 transition-all mt-6"
        >
          <LogOut className="text-[#F44336]" />
          <span className="text-[#F44336] font-black uppercase tracking-widest">Akkaunttan shıǵıw</span>
        </button>
      </div>
    </div>
  );
}
