import { ChevronLeft, Sparkles, Crown, Zap, ShieldCheck, Star, MessageCircle, ArrowRight, Calendar } from 'lucide-react';

interface PremiumScreenProps {
  onBack: () => void;
}

export default function PremiumScreen({ onBack }: PremiumScreenProps) {
  const benefits = [
    { id: 1, title: "Barlıq darslikler", desc: "Hámme ádebiyatlar hám lug'atlardan sheksiz paydalanıw", icon: <Zap className="w-5 h-5" /> },
    { id: 2, title: "Mock Testler", desc: "Hápte sayın jańa milliy sertifikat testleri", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 3, title: "Reklamasız", desc: "Bilim alıwdan hesh nárse sizdi shalg'ıtpaydı", icon: <Crown className="w-5 h-5" /> },
    { id: 4, title: "Eksklyuziv vaucherlar", desc: "Dúkánda tek premiumlar ushın arnalg'an sıylıqlar", icon: <Star className="w-5 h-5" /> },
  ];

  const handleContactAdmin = () => {
    window.open('https://t.me/ziyban_admin', '_blank');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans pb-10 flex flex-col">
      {/* 🟢 HEADER */}
      <div className="bg-gradient-to-br from-[#2EB8A6] to-[#26A69A] pt-14 pb-28 px-6 rounded-b-[60px] relative overflow-hidden shadow-xl shadow-emerald-100">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md border border-white/30 active:scale-90 transition-all z-10"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl flex items-center justify-center border border-white/30 shadow-2xl mb-4 rotate-3">
            <Sparkles className="w-10 h-10 text-amber-300 fill-amber-300" />
          </div>
          <h2 className="text-white font-black text-3xl uppercase tracking-[0.1em]">Premium</h2>
          <p className="text-white/80 font-bold text-[10px] mt-2 uppercase tracking-[0.2em]">Ay sayın jańa imkaniyatlar</p>
        </div>
      </div>

      {/* ⚪️ BENEFITS LIST */}
      <main className="px-6 -mt-16 space-y-6 relative z-10 flex-1">
        <div className="bg-white rounded-[45px] p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)] border border-[#F0EBE0]">
          <div className="space-y-7">
            {benefits.map((benefit) => (
              <div key={benefit.id} className="flex items-start group">
                <div className="w-11 h-11 bg-[#F5EEDC]/50 rounded-2xl flex items-center justify-center text-[#2EB8A6] mr-4 shrink-0 group-hover:bg-[#2EB8A6] group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-black text-[#2C4A44] text-base leading-tight mb-1">{benefit.title}</h3>
                  <p className="text-[#8DA6A1] text-[11px] font-bold leading-relaxed">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🏷️ PRICING & ADMIN CONTACT */}
        <div className="bg-white rounded-[40px] p-8 border-b-[8px] border-[#E8DFCC] shadow-sm">
           <div className="text-center space-y-1 mb-8">
              <div className="inline-flex items-center space-x-1 bg-[#FFF4E5] px-3 py-1 rounded-full mb-2">
                 <Calendar className="w-3 h-3 text-[#FF9500]" />
                 <span className="text-[#FF9500] font-black text-[9px] uppercase tracking-tighter">1 ay ushın</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                 <span className="text-4xl font-black text-[#2C4A44]">99 000</span>
                 <span className="text-[#2EB8A6] font-black text-lg">sum</span>
              </div>
           </div>

           <div className="space-y-4">
              <button 
                onClick={handleContactAdmin}
                className="w-full bg-[#0088cc] text-white py-5 rounded-[28px] font-black uppercase tracking-[0.1em] text-xs shadow-lg shadow-blue-100 active:translate-y-1 transition-all flex items-center justify-center space-x-3"
              >
                <MessageCircle className="w-5 h-5 fill-white" />
                <span>Admin arqalı alıw</span>
              </button>
              
              <div className="text-center">
                 <p className="text-[#A0B8B4] text-[9px] font-bold uppercase">
                    Mánzil: <span className="text-[#2C4A44]">@ziyban_admin</span>
                 </p>
              </div>
           </div>
        </div>

        {/* ℹ️ INSTRUCTION */}
        <div className="bg-[#E6F4F1] p-5 rounded-[30px] border border-[#2EB8A6]/10 flex items-center space-x-4">
           <div className="bg-white p-2.5 rounded-xl shadow-sm text-[#2EB8A6]">
              <Sparkles className="w-5 h-5" />
           </div>
           <p className="text-[#2C4A44] text-[10px] font-bold leading-tight uppercase">
              Adminge jazıń hám tólem skrinshotın jiberiń. Premium 1 ay dawamında isker boladı.
           </p>
        </div>

        <p className="text-center text-[#A0B8B4] text-[9px] font-bold pb-8">
           Ziyban — Bilim alıwdıń eń ońay jolı.
        </p>
      </main>
    </div>
  );
}
