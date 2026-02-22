import { ChevronLeft, BookOpen, MessageSquare, Zap, Layout, ArrowRight, Star } from 'lucide-react';

interface ExercisesListProps {
  onBack: () => void;
  onStartExercise: (type: 'definition' | 'translation' | 'terms') => void;
}

export default function ExercisesList({ onBack, onStartExercise }: ExercisesListProps) {
  const exercises = [
    { 
      id: 'definition', 
      title: 'Táripler', 
      desc: 'Sózlerdiń mánisin tabıń', 
      icon: <BookOpen className="w-8 h-8" />, 
      color: 'text-emerald-500', 
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      shadow: 'shadow-emerald-100'
    },
    { 
      id: 'translation', 
      title: 'Awdarmalar', 
      desc: 'Tildan-tilge awdarın', 
      icon: <MessageSquare className="w-8 h-8" />, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      shadow: 'shadow-amber-100'
    },
    { 
      id: 'terms', 
      title: 'Terminler', 
      desc: 'Kásiplik terminler', 
      icon: <Zap className="w-8 h-8" />, 
      color: 'text-indigo-500', 
      bg: 'bg-indigo-50',
      border: 'border-indigo-200',
      shadow: 'shadow-indigo-100'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-12 flex flex-col">
      {/* 🟢 HEADER SECTION */}
      <div className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 border border-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Shinıǵıwlar</h2>
        <p className="text-white/70 font-bold text-xs mt-1 uppercase tracking-widest">Bilimińdi sına hám jetilis</p>
      </div>

      {/* ⚪️ ASOSIY RO'YXAT */}
      <main className="px-6 -mt-10 space-y-6 relative z-10 flex-1">
        
        {/* REKLAMA YOKI STATUS KARTASI */}
        <div className="bg-white/40 backdrop-blur-sm p-4 rounded-[30px] border border-white/60 flex items-center justify-between px-6 mb-8">
           <div className="flex items-center space-x-3">
              <Star className="w-5 h-5 text-[#F4C150] fill-[#F4C150]" />
              <span className="text-[#2C4A44] font-black text-xs uppercase tracking-tighter">Hámme shinıǵıwlar ashıq</span>
           </div>
           <div className="h-2 w-16 bg-[#2EB8A6]/20 rounded-full overflow-hidden">
              <div className="bg-[#2EB8A6] h-full w-2/3"></div>
           </div>
        </div>

        <div className="space-y-5">
          {exercises.map((ex) => (
            <button
              key={ex.id}
              onClick={() => onStartExercise(ex.id as any)}
              className="w-full bg-white rounded-[40px] p-6 shadow-[0_10px_20px_rgba(0,0,0,0.03)] border-b-[8px] border-[#E8DFCC] flex items-center group active:translate-y-2 active:border-b-0 transition-all text-left relative overflow-hidden"
            >
              {/* Orqa fondagi naqsh */}
              <div className={`absolute -right-4 -bottom-4 w-24 h-24 ${ex.bg} rounded-full opacity-50 group-hover:scale-150 transition-transform duration-700`}></div>

              {/* Ikonka */}
              <div className={`w-16 h-16 ${ex.bg} ${ex.color} rounded-3xl flex items-center justify-center mr-5 shrink-0 shadow-inner border ${ex.border}`}>
                {ex.icon}
              </div>

              {/* Matn */}
              <div className="relative z-10">
                <h3 className="font-black text-[#2C4A44] text-xl leading-tight mb-1">{ex.title}</h3>
                <p className="text-[#8DA6A1] text-[10px] font-black uppercase tracking-widest">{ex.desc}</p>
              </div>

              {/* O'ng tarafdagi strelka */}
              <div className="ml-auto relative z-10 bg-[#F5EEDC] p-2 rounded-xl text-[#A0B8B4] group-hover:text-[#2EB8A6] group-hover:translate-x-1 transition-all">
                <ArrowRight className="w-5 h-5" />
              </div>
            </button>
          ))}
        </div>

        {/* MOTIVATSIYA QISMI */}
        <div className="pt-10 pb-6 text-center">
           <div className="inline-block p-4 bg-indigo-50 rounded-3xl border-2 border-dashed border-indigo-100">
              <Layout className="w-8 h-8 text-indigo-300 mx-auto mb-2" />
              <p className="text-[#8DA6A1] font-bold text-[10px] uppercase max-w-[200px] leading-relaxed">
                Kúnine 15 minut shinıǵıw isle hám nátiyjege eris!
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
