import { User, LogOut, Award, ShieldCheck, Calendar, ChevronLeft, Settings } from 'lucide-react';

interface ProfileScreenProps {
  user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean; streak?: number; learnedWords?: number };
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10">
      {/* HEADER */}
      <div className="bg-[#2EB8A6] p-6 rounded-b-[40px] shadow-lg relative">
        <button onClick={onBack} className="absolute top-8 left-6 p-2 bg-white/20 rounded-xl backdrop-blur-md border border-white/30 text-white">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-center text-white font-black text-xl pt-2 uppercase tracking-widest">Profil</h2>
        
        <div className="flex flex-col items-center mt-8 pb-4">
          <div className="w-28 h-28 bg-white rounded-full border-4 border-[#F4C150] p-1 shadow-2xl relative">
            <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center overflow-hidden">
               <User className="w-14 h-14 text-[#2EB8A6]" />
            </div>
            {user.isPremium && (
              <div className="absolute -bottom-2 -right-2 bg-[#F4C150] p-2 rounded-full border-4 border-[#2EB8A6] shadow-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            )}
          </div>
          <h1 className="text-white text-2xl font-black mt-4 tracking-tight">{user.firstName} {user.lastName}</h1>
          <p className="text-white/80 font-bold text-sm">{user.phone}</p>
        </div>
      </div>

      {/* STATS */}
      <div className="px-6 -mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-[28px] shadow-md border-b-4 border-[#E8DFCC] flex flex-col items-center">
          <div className="w-10 h-10 bg-[#FFF4E5] rounded-xl flex items-center justify-center mb-2">
            <Calendar className="w-6 h-6 text-[#FF9500]" />
          </div>
          <span className="font-black text-xl text-[#2C4A44]">{user.streak || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase text-center leading-tight">Kúnlik Streak</span>
        </div>
        <div className="bg-white p-5 rounded-[28px] shadow-md border-b-4 border-[#E8DFCC] flex flex-col items-center">
          <div className="w-10 h-10 bg-[#E6F4F1] rounded-xl flex items-center justify-center mb-2">
            <Award className="w-6 h-6 text-[#2EB8A6]" />
          </div>
          <span className="font-black text-xl text-[#2C4A44]">{user.learnedWords || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase text-center leading-tight">Úyrenilgen sózler</span>
        </div>
      </div>

      {/* OPTIONS */}
      <div className="px-6 mt-8 space-y-3">
        <button className="w-full bg-white p-4 rounded-2xl flex items-center justify-between border-b-2 border-gray-100 active:scale-95 transition-all">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mr-4">
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <span className="font-bold text-[#2C4A44]">Sazlawlar</span>
          </div>
          <div className="text-gray-300">▶</div>
        </button>

        <button 
          onClick={onLogout}
          className="w-full bg-[#FEEBEE] p-4 rounded-2xl flex items-center justify-center border-b-4 border-[#FFCDD2] active:border-b-0 active:translate-y-1 transition-all mt-6"
        >
          <LogOut className="w-5 h-5 text-[#F44336] mr-3" />
          <span className="font-black text-[#F44336] uppercase tracking-wider">Shıǵıw</span>
        </button>
      </div>
    </div>
  );
}
