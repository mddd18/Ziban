import { ChevronLeft, MapPin, Star, GraduationCap, ArrowUpRight } from 'lucide-react';

interface LearningCentersProps {
  onBack: () => void;
  userCoins: number;
}

export default function LearningCenters({ onBack, userCoins }: LearningCentersProps) {
  const centers = [
    { id: 1, name: "Ziyban Academy", location: "Nókis qalası", rating: 4.9, tags: ["Sertifikat", "Tariyx"] },
    { id: 2, name: "Bilim Bulaǵı", location: "Xójeli rayonı", rating: 4.7, tags: ["Milliy til", "Grammatika"] },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10">
      {/* HEADER */}
      <div className="bg-[#2EB8A6] pt-14 pb-24 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md border border-white/30 active:scale-90">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <GraduationCap className="w-12 h-12 text-white/40 mx-auto mb-2" />
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em]">Oqıw Merkezleri</h2>
      </div>

      <main className="px-6 -mt-16 space-y-6">
        {/* COIN INFO CARD */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-[35px] p-6 text-white shadow-xl relative overflow-hidden">
           <div className="relative z-10">
             <div className="flex items-center space-x-2 mb-2">
                <Star className="w-5 h-5 fill-white" />
                <span className="font-black text-xs uppercase tracking-widest">Chegirme Alıń</span>
             </div>
             <p className="text-lg font-black leading-tight">Ziyban coinlerińizdi oqıw merkezlerinde paydalanıń!</p>
           </div>
           <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full"></div>
        </div>

        {/* CENTERS LIST */}
        <div className="space-y-5">
          {centers.map((center) => (
            <div key={center.id} className="bg-white rounded-[45px] p-7 shadow-sm border-b-[6px] border-[#E8DFCC]">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-black text-[#2C4A44] leading-none mb-2">{center.name}</h3>
                  <div className="flex items-center text-[#8DA6A1] font-bold text-[10px] uppercase">
                    <MapPin className="w-3 h-3 mr-1 text-[#2EB8A6]" /> {center.location}
                  </div>
                </div>
                <div className="bg-[#FFF4E5] px-3 py-1.5 rounded-2xl flex items-center border border-[#FFE8CC]">
                  <Star className="w-3 h-3 text-[#FF9500] fill-[#FF9500] mr-1" />
                  <span className="text-[#FF9500] font-black text-xs">{center.rating}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {center.tags.map((tag, i) => (
                  <span key={i} className="bg-[#E6F4F1] text-[#2EB8A6] px-3 py-1 rounded-xl text-[9px] font-black uppercase">
                    #{tag}
                  </span>
                ))}
              </div>

              <button className="w-full bg-[#2EB8A6] text-white py-4 rounded-[25px] font-black uppercase tracking-widest text-xs flex items-center justify-center space-x-2 shadow-lg active:translate-y-1 transition-all">
                <span>Tolıq maǵlıwmat</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
