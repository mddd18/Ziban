import { User, LogOut, Award, Calendar, ChevronLeft, ShieldCheck, Phone, Star, Zap, Target } from 'lucide-react';

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
  // Yutuqlar uchun namunaviy ma'lumotlar
  const achievements = [
    { id: 1, title: "Bilimdan", desc: "100 sóz yodla", icon: <Star className="text-yellow-500" />, progress: user.learnedWords || 0, total: 100, color: "bg-yellow-100" },
    { id: 2, title: "Intizom", desc: "7 kúnlik streak", icon: <Zap className="text-orange-500" />, progress: user.streak || 0, total: 7, color: "bg-orange-100" },
    { id: 3, title: "Mergen", desc: "Hámme test durıs", icon: <Target className="text-blue-500" />, progress: 3, total: 5, color: "bg-blue-100" },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10 flex flex-col">
      
      {/* 🟢 TOP SECTION: TURQUOISE CURVE */}
      <div className="bg-[#2EB8A6] pt-14 pb-24 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md hover:bg-white/30 transition-all border border-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="w-32 h-32 bg-white rounded-full mx-auto p-1.5 border-4 border-[#F4C150] shadow-2xl relative mt-2">
          <div className="w-full h-full bg-[#E6F4F1] rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-16 h-16 text-[#2EB8A6]" />
          </div>
          {user.isPremium && (
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-2 shadow-md border-2 border-[#2EB8A6]">
              <ShieldCheck className="w-6 h-6 text-[#F4C150] fill-[#F4C150]" />
            </div>
          )}
        </div>

        <h2 className="text-white text-3xl font-black mt-6 uppercase tracking-tight">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-white/70 font-bold text-sm mt-1 tracking-widest">{user.phone}</p>
      </div>

      {/* ⚪️ STATS CARDS: FLOAT EFFECT */}
      <div className="px-6 -mt-12 grid grid-cols-2 gap-4 relative z-10">
        <div className="bg-white p-6 rounded-[35px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
          <Calendar className="w-8 h-8 text-[#FF9500] mb-2" />
          <span className="text-2xl font-black text-[#2C4A44]">{user.streak || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Kúnlik Streak</span>
        </div>
        <div className="bg-white p-6 rounded-[35px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
          <Award className="w-8 h-8 text-[#2EB8A6] mb-2" />
          <span className="text-2xl font-black text-[#2C4A44]">{user.learnedWords || 0}</span>
          <span className="text-[10px] font-black text-[#8DA6A1] uppercase tracking-tighter">Sózler yodlandí</span>
        </div>
      </div>

      {/* 🏆 ACHIEVEMENTS SECTION: YANGI QO'SHILDI */}
      <div className="px-6 mt-10">
        <h3 className="text-[#2C4A44] font-black text-xl mb-4 ml-2 uppercase tracking-tight">Yutuqlar hám Shıńlar</h3>
        <div className="space-y-4">
          {achievements.map((item) => (
            <div key={item.id} className="bg-white/70 backdrop-blur-sm p-4 rounded-[30px] border border-white flex items-center shadow-sm">
              <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mr-4 shrink-0 shadow-inner`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-end mb-1.5">
                  <h4 className="font-black text-[#2C4A44] text-sm uppercase">{item.title}</h4>
                  <span className="text-[10px] font-black text-[#8DA6A1]">{item.progress}/{item.total}</span>
                </div>
                <div className="w-full bg-[#E8DFCC]/50 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-[#2EB8A6] h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.min((item.progress / item.total) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] font-bold text-[#8DA6A1] mt-1.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 📱 LOGOUT SECTION */}
      <div className="px-6 mt-12 mb-8">
        <button 
          onClick={onLogout} 
          className="w-full bg-[#FEEBEE] hover:bg-[#FFDDE0] p-5 rounded-[30px] flex items-center justify-center space-x-3 border-b-[6px] border-[#FFCDD2] active:translate-y-1 active:border-b-0 transition-all group"
        >
          <LogOut className="w-6 h-6 text-[#F44336] group-hover:rotate-12 transition-transform" />
          <span className="text-[#F44336] font-black uppercase tracking-widest text-sm">Akkaunttan shıǵıw</span>
        </button>
        <p className="text-center text-[#8DA6A1]/40 text-[9px] font-bold mt-6 uppercase tracking-[0.3em]">
          Ziyban Certification Platform
        </p>
      </div>
    </div>
  );
}
