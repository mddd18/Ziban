import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Trophy, Sparkles, ArrowRight } from 'lucide-react';

interface ExerciseSessionProps {
  exerciseType: 'definition' | 'translation' | 'terms';
  onComplete: () => void;
  onBack: () => void;
}

export default function ExerciseSession({ exerciseType, onComplete, onBack }: ExerciseSessionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // 📝 Savollar to'plami (Buni kelajakda Supabase-dan useEffect orqali olasiz)
  const questions = [
    { 
      id: 1, 
      question: "Baxıt sóziniń mánisin tabıń:", 
      options: ["Quwanıshlı keshirme", "Qayǵılı waqıya", "Awır jumıs", "Uzak jol"], 
      correct: 0 
    },
    { 
      id: 2, 
      question: "Bilim sóziniń mánisin tabıń:", 
      options: ["Uykı kórmew", "Oqıw arqalı alınǵan túsinik", "Tamaq pisiriw", "Tez júriw"], 
      correct: 1 
    },
    { 
      id: 3, 
      question: "Watan sózine berilgen tuwrı táripti kórsetiń:", 
      options: ["Hár qanday jer", "Adam tuwılıp ósken jer", "Baska mámleket", "Tek qala"], 
      correct: 1 
    },
  ];

  const handleCheck = () => {
    if (selectedAnswer === questions[currentStep].correct) {
      setScore(prev => prev + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentStep + 1 < questions.length) {
      setCurrentStep(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Test tugaganda App.tsx dagi handleExerciseComplete ishlaydi
      onComplete();
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans flex flex-col overflow-x-hidden">
      
      {/* 🟢 TOP BAR: PROGRESS & SCORE */}
      <div className="px-6 pt-12 pb-6 flex items-center space-x-4 bg-white/40 backdrop-blur-lg sticky top-0 z-50 border-b border-white/20">
        <button 
          onClick={onBack} 
          className="text-[#A0B8B4] hover:text-[#F44336] transition-all active:scale-90 p-1"
        >
          <X className="w-8 h-8" />
        </button>
        
        <div className="flex-1 bg-white/50 h-3.5 rounded-full overflow-hidden border border-[#E8DFCC] relative shadow-inner">
          <div 
            className="bg-[#2EB8A6] h-full transition-all duration-700 ease-out rounded-full shadow-[0_0_10px_rgba(46,184,166,0.4)]"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 skew-x-[-20deg] animate-pulse"></div>
        </div>

        <div className="bg-white px-3 py-1.5 rounded-2xl flex items-center space-x-2 shadow-sm border border-[#E8DFCC]">
           <Trophy className="w-4 h-4 text-[#F4C150]" />
           <span className="font-black text-[#2C4A44] text-sm">{score}</span>
        </div>
      </div>

      {/* ❓ SAVOL KARTASI */}
      <main className="flex-1 px-6 pt-10 pb-32">
        <div className="bg-white rounded-[40px] p-8 shadow-[0_15px_35px_rgba(0,0,0,0.03)] border-b-[6px] border-[#E8DFCC] relative overflow-hidden group">
          <div className="absolute -right-8 -top-8 w-28 h-28 bg-[#E6F4F1] rounded-full opacity-40 group-hover:scale-110 transition-transform duration-700"></div>
          <div className="absolute -left-4 -bottom-4 w-16 h-16 bg-[#FFF4E5] rounded-full opacity-30"></div>
          
          <div className="relative z-10 space-y-4 text-center">
            <div className="inline-flex items-center space-x-2 bg-[#E6F4F1] px-5 py-1.5 rounded-full border border-[#2EB8A6]/10">
               <Sparkles className="w-3.5 h-3.5 text-[#2EB8A6] animate-pulse" />
               <p className="text-[#2EB8A6] font-black uppercase text-[10px] tracking-[0.2em]">Súwretlew hám Tárip</p>
            </div>
            <h2 className="text-[#2C4A44] text-2xl font-black leading-[1.3] px-2">
              {questions[currentStep].question}
            </h2>
          </div>
        </div>

        {/* 🔘 VARIANTLAR: KENG VA INTERAKTIV */}
        <div className="mt-12 space-y-4">
          {questions[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full p-6 rounded-[32px] text-left font-bold text-lg border-b-[6px] transition-all relative overflow-hidden flex items-center group ${
                selectedAnswer === idx 
                  ? 'bg-white border-[#2EB8A6] text-[#2EB8A6] -translate-y-1' 
                  : 'bg-white border-[#E8DFCC] text-[#2C4A44] active:translate-y-1 active:border-b-0'
              } ${isAnswered && idx === questions[currentStep].correct ? 'bg-emerald-50 border-emerald-500 text-emerald-600 ring-2 ring-emerald-200' : ''}
                ${isAnswered && selectedAnswer === idx && idx !== questions[currentStep].correct ? 'bg-red-50 border-red-500 text-red-600 ring-2 ring-red-200 opacity-80' : ''}
              `}
            >
              {/* Harf/Raqam belgisi */}
              <span className={`w-11 h-11 rounded-[20px] flex items-center justify-center mr-5 border-2 font-black text-sm shrink-0 transition-all shadow-sm ${
                selectedAnswer === idx 
                  ? 'bg-[#2EB8A6] text-white border-[#2EB8A6]' 
                  : 'bg-[#F5EEDC] text-[#8DA6A1] border-transparent group-hover:bg-[#E6F4F1]'
              }`}>
                {idx + 1}
              </span>
              <span className="flex-1 leading-snug tracking-tight">{option}</span>
            </button>
          ))}
        </div>
      </main>

      {/* 🏁 BOTTOM ACTION BAR: DINAMIK RANGAR */}
      <footer className={`fixed bottom-0 left-0 right-0 p-8 pb-10 rounded-t-[50px] shadow-[0_-15px_50px_rgba(0,0,0,0.08)] transition-all duration-500 z-50 ${
        isAnswered 
          ? (selectedAnswer === questions[currentStep].correct ? 'bg-emerald-500' : 'bg-[#F44336]') 
          : 'bg-white border-t border-gray-100'
      }`}>
        {!isAnswered ? (
          <div className="max-w-md mx-auto">
            <button
              disabled={selectedAnswer === null}
              onClick={handleCheck}
              className={`w-full py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all active:scale-95 ${
                selectedAnswer !== null 
                  ? 'bg-[#2EB8A6] text-white shadow-emerald-900/20' 
                  : 'bg-[#E8DFCC] text-[#A0B8B4] cursor-not-allowed border-b-[4px] border-[#D1C7B1]'
              }`}
            >
              Tekseriw
            </button>
          </div>
        ) : (
          <div className="max-w-md mx-auto flex flex-col items-center space-y-6">
            <div className="flex items-center space-x-4 text-white">
              {selectedAnswer === questions[currentStep].correct ? (
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <CheckCircle2 className="w-8 h-8 animate-bounce" />
                  </div>
                  <span className="font-black text-xl uppercase tracking-widest">Júdá jaqsı! 🎉</span>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <div className="bg-white/20 p-2 rounded-full backdrop-blur-md">
                    <AlertCircle className="w-8 h-8" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-xl uppercase tracking-widest leading-none">Qáte...</span>
                    <span className="text-[10px] font-bold opacity-80 mt-1 uppercase">Tuwrı juwap: {questions[currentStep].options[questions[currentStep].correct]}</span>
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={handleNext}
              className="w-full bg-white text-[#2C4A44] py-5 rounded-[28px] font-black uppercase tracking-[0.2em] text-sm shadow-2xl active:scale-95 transition-all flex items-center justify-center space-x-2"
            >
              <span>Dawam etiw</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
