import { User, LogOut, Award, Calendar, ChevronLeft, ShieldCheck, Phone } from 'lucide-react';

interface ProfileScreenProps {
  user: { 
    firstName: string; 
    lastName: string; 
    phone: string; 
    coins: number; 
    isPremium?: boolean; 
    streak?: number; 
    learnedWords?: number 
  };
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  return (
    // ASOSIY FON: Butun ekranni qum rangli fon bilan to'ldiramiz
    <div className="min-h-screen bg-[#F5EEDC] font-sans flex flex-col">
      
      {/* 🟢 TEPALIK QISMI (TURQUOISE) */}
      <div className="bg-[#2EB8A6] pt-12 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        {/* Orqaga qaytish tugmasi */}
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 transition-all border border-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Profil rasmi va ramkasi */}
        <div className="w-32 h-32 bg-white rounded-full mx-auto p-1.5 border-4 border-[#F4C150] shadow-2xl relative mt-4">
          <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-16 h-16 text-[#2EB8A6]" />
          </div>
          {user.isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1.5 shadow-md border-2 border-[#2EB8A6]">
              <ShieldCheck className="w-6 h-6 text-[#F4C150] fill-[#F4C150]" />
            </div>
          )}
        </div>

        {/* Ism va status */}
        <h2 className="text-white text-3xl font-black mt-6 uppercase tracking-tight leading-none">
          {user.firstName} <br /> {user.lastName}
        </h2>
        <div className="mt-3 inline-block bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/30">
          <span className="text-white text-xs font-black uppercase tracking-widest">
            {user.isPremium ? 'PRO Paydalanıwshı' : 'Ápiwayı Oqıwshı'}
          </span>
        </div>
      </div>

      {/* ⚪️ STATISTIKA KARTALARI (O'rtada chiqadi) */}
      <div className="px-8 -mt-10 grid grid-cols-2 gap-5 relative z-10">
        <div className="bg-white p-6 rounded-[35px] shadow-sm border-b-[6px] border-[#E8DFCC] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-[#FFF4E5] rounded-2xl flex items-center justify-center mb-2">
            <Calendar className="w-7 h-7 text-[#FF9500]" />
          </div>
          <span className="text-2xl font-black text-[#2C4A44]">{user.streak || 0}</span>
          <span className="text-[11px] font-black text-[#8DA6A1] uppercase tracking-wider">Kúnlik Streak</span>
        </div>

        <div className="bg-white p-6 rounded-[35px] shadow-sm border-b-[6px] border-[#E8DFCC] flex flex-col items-center justify-center transform hover:-translate-y-1 transition-transform">
          <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mb-2">
            <Award className="w-7 h-7 text-[#2EB8A6]" />
          </div>
          <span className="text-2xl font-black text-[#2C4A44]">{user.learnedWords || 0}</span>
          <span className="text-[11px] font-black text-[#8DA6A1] uppercase tracking-wider">Sózler yodlandí</span>
        </div>
      </div>

      {/* 📱 MA'LUMOTLAR VA CHIQISH (Pastki qism) */}
      <div className="flex-1 px-8 py-10 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="bg-white/60 backdrop-blur-sm p-5 rounded-[28px] flex items-center border border-white/80 shadow-sm">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mr-4 shadow-sm border border-gray-50">
              <Phone className="w-6 h-6 text-[#2EB8A6]" />
            </div>
            <div>
              <p className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-widest">Telefon nomer</p>
              <p className="font-black text-[#2C4A44] text-lg">{user.phone}</p>
            </div>
          </div>
        </div>

        {/* CHIQISH TUGMASI (Ekranning eng pastida chiroyli turadi) */}
        <button 
          onClick={onLogout} 
          className="w-full bg-[#FEEBEE] hover:bg-[#FFEBEE] p-5 rounded-[28px] flex items-center justify-center space-x-3 border-b-[6px] border-[#FFCDD2] active:translate-y-1 active:border-b-0 transition-all group"
        >
          <LogOut className="w-6 h-6 text-[#F44336] group-hover:scale-110 transition-transform" />
          <span className="text-[#F44336] font-black uppercase tracking-[0.1em] text-sm">Akkaunttan shıǵıw</span>
        </button>
      </div>

      {/* Mualliflik huquqi (Kichik qilib) */}
      <p className="text-center text-[#8DA6A1]/50 text-[10px] font-bold pb-6 uppercase tracking-widest">
        Ziyban • 2024
      </p>
    </div>
  );
}
