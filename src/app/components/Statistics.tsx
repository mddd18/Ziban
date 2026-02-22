import { ChevronLeft, BarChart2, Flame, Award, Star, TrendingUp } from 'lucide-react';

interface StatisticsProps {
  user: { 
    streak: number; 
    learnedWords: number; 
    coins: number;
  };
  onBack: () => void;
}

export default function Statistics({ user, onBack }: StatisticsProps) {
  // Haftalik kunlar uchun namunaviy ma'lumot (buni keyinchalik bazaga ulaymiz)
  const weeklyActivity = [
    { day: 'Dsh', val: 40 }, { day: 'Ssh', val: 70 }, { day: 'Chsh', val: 50 },
    { day: 'Psh', val: 90 }, { day: 'Jum', val: 60 }, { day: 'Shn', val: 80 }, { day: 'Ysh', val: 30 }
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10">
      {/* HEADER */}
      <div className="bg-[#2EB8A6] pt-12 pb-10 px-6 rounded-b-[50px] shadow-lg relative">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 transition-all border border-white/30">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-center text-white font-black text-xl uppercase tracking-widest pt-2">Jetistikler</h2>
      </div>

      <main className="px-6 -mt-6 space-y-6">
        {/* ASOSIY KO'RSATKICHLAR */}
        <div className="bg-white rounded-[35px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC] grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center">
            <Flame className="w-6 h-6 text-[#FF9500] mb-1" />
            <span className="font-black text-[#2C4A44]">{user.streak}</span>
            <span className="text-[9px] font-bold text-[#8DA6A1] uppercase">Streak</span>
          </div>
          <div className="flex flex-col items-center border-x border-gray-100">
            <Award className="w-6 h-6 text-[#2EB8A6] mb-1" />
            <span className="font-black text-[#2C4A44]">{user.learnedWords}</span>
            <span className="text-[9px] font-bold text-[#8DA6A1] uppercase">Sózler</span>
          </div>
          <div className="flex flex-col items-center">
            <Star className="w-6 h-6 text-[#F4C150] mb-1" />
            <span className="font-black text-[#2C4A44]">{user.coins}</span>
            <span className="text-[9px] font-bold text-[#8DA6A1] uppercase">Coinlar</span>
          </div>
        </div>

        {/* HAFTALIK GRAFIK */}
        <div className="bg-white rounded-[35px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-[#2C4A44] uppercase text-sm flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-[#2EB8A6]" /> Haftalıq belsendilik
            </h3>
          </div>
          <div className="flex justify-between items-end h-32 px-2">
            {weeklyActivity.map((item, idx) => (
              <div key={idx} className="flex flex-col items-center group">
                <div 
                  className="w-3 bg-[#E6F4F1] rounded-full relative overflow-hidden flex items-end"
                  style={{ height: '100px' }}
                >
                  <div 
                    className="w-full bg-[#2EB8A6] rounded-full transition-all duration-1000 group-hover:bg-[#FF9500]"
                    style={{ height: `${item.val}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-[#8DA6A1] mt-2 uppercase">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* DARAXT EKISH (SIMVOLIK) */}
        <div className="bg-[#E6F4F1] rounded-[35px] p-6 border-b-[6px] border-[#D1EBE6] flex items-center justify-between">
          <div className="max-w-[60%]">
            <h4 className="font-black text-[#2C4A44] text-lg leading-tight mb-2">Bilim tereklerin suwarıwdı dawam et!</h4>
            <p className="text-[#5A7A74] text-xs font-bold leading-relaxed">Hár bir jańa sóz — bul seniń keleshegińe qoyılǵan bir qádem.</p>
          </div>
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-inner">
             <BarChart2 className="w-10 h-10 text-[#2EB8A6] opacity-40" />
          </div>
        </div>
      </main>
    </div>
  );
}
