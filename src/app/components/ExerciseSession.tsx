import { useState, useEffect } from 'react';
import { ChevronLeft, X, CheckCircle2, AlertCircle, Volume2, Trophy } from 'lucide-react';

interface ExerciseSessionProps {
  exerciseType: 'definition' | 'translation' | 'terms';
  onComplete: () => void;
}

export default function ExerciseSession({ exerciseType, onComplete }: ExerciseSessionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Namuna uchun savollar (Buni keyinchalik bazadan olasiz)
  const questions = [
    { id: 1, question: "Baxıt sóziniń mánisin tabıń:", options: ["Quwanıshlı keshirme", "Qayǵılı waqıya", "Awır jumıs", "Uzak jol"], correct: 0 },
    { id: 2, question: "Bilim sóziniń mánisin tabıń:", options: ["Uykı kórmew", "Oqıw arqalı alınǵan túsinik", "Tamaq pisiriw", "Tez júriw"], correct: 1 },
  ];

  const handleCheck = () => {
    if (selectedAnswer === questions[currentStep].correct) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentStep + 1 < questions.length) {
      setCurrentStep(currentStep + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      onComplete(); // Bazaga natijani yozish funksiyasi App.tsx da ishlaydi
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      
      {/* 🟢 TOP BAR: PROGRESS */}
      <div className="px-6 pt-12 pb-4 flex items-center space-x-4">
        <button onClick={onBack} className="text-[#A0B8B4] hover:text-[#2C4A44] transition-colors">
          <X className="w-8 h-8" />
        </button>
        <div className="flex-1 bg-[#F5EEDC] h-4 rounded-full overflow-hidden border border-[#E8DFCC]">
          <div 
            className="bg-[#2EB8A6] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center space-x-1">
           <Trophy className="w-5 h-5 text-[#F4C150]" />
           <span className="font-black text-[#2EB8A6]">{score}</span>
        </div>
      </div>

      {/* ❓ SAVOL QISMI */}
      <main className="flex-1 px-6 pt-10">
        <div className="space-y-4">
          <p className="text-[#8DA6A1] font-black uppercase text-xs tracking-[0.2em]">Táripti tabıń</p>
          <h2 className="text-[#2C4A44] text-2xl font-black leading-tight">
            {questions[currentStep].question}
          </h2>
          <div className="w-12 h-1 bg-[#2EB8A6] rounded-full"></div>
        </div>

        {/* 🔘 VARIANTLAR: YOPISHIB QOLMAGAN, KENG KARTALAR */}
        <div className="mt-12 space-y-4">
          {questions[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full p-5 rounded-[28px] text-left font-bold text-lg border-b-[6px] transition-all active:translate-y-1 active:border-b-0 ${
                selectedAnswer === idx 
                  ? 'bg-[#E6F4F1] border-[#2EB8A6] text-[#2EB8A6]' 
                  : 'bg-white border-[#E8DFCC] text-[#2C4A44] hover:bg-gray-50'
              } ${isAnswered && idx === questions[currentStep].correct ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : ''}`}
            >
              <div className="flex items-center">
                <span className={`w-8 h-8 rounded-xl flex items-center justify-center mr-4 border-2 font-black text-sm ${
                  selectedAnswer === idx ? 'bg-[#2EB8A6] text-white border-[#2EB8A6]' : 'border-[#E8DFCC] text-[#8DA6A1]'
                }`}>
                  {idx + 1}
                </span>
                {option}
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* 🏁 BOTTOM CHECK BAR */}
      <footer className={`p-8 pb-10 border-t-2 ${isAnswered ? (selectedAnswer === questions[currentStep].correct ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100') : 'bg-white border-gray-100'}`}>
        {!isAnswered ? (
          <button
            disabled={selectedAnswer === null}
            onClick={handleCheck}
            className={`w-full py-4 rounded-[24px] font-black uppercase tracking-widest shadow-lg transition-all ${
              selectedAnswer !== null 
                ? 'bg-[#2EB8A6] text-white shadow-emerald-200' 
                : 'bg-[#E8DFCC] text-[#A0B8B4] cursor-not-allowed'
            }`}
          >
            Tekseriw
          </button>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {selectedAnswer === questions[currentStep].correct ? (
                <>
                  <div className="bg-emerald-500 p-2 rounded-full text-white"><CheckCircle2 className="w-6 h-6" /></div>
                  <span className="font-black text-emerald-600 text-lg uppercase">Durıs!</span>
                </>
              ) : (
                <>
                  <div className="bg-red-500 p-2 rounded-full text-white"><AlertCircle className="w-6 h-6" /></div>
                  <span className="font-black text-red-600 text-lg uppercase">Qáte!</span>
                </>
              )}
            </div>
            <button
              onClick={handleNext}
              className={`px-10 py-4 rounded-[24px] font-black uppercase tracking-widest text-white shadow-lg ${
                selectedAnswer === questions[currentStep].correct ? 'bg-emerald-500 shadow-emerald-200' : 'bg-red-500 shadow-red-200'
              }`}
            >
              Dawam etiw
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
