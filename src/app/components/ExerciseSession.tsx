import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Trophy, Sparkles } from 'lucide-react';

interface ExerciseSessionProps {
  exerciseType: 'definition' | 'translation' | 'terms';
  onComplete: () => void;
  onBack: () => void; // ✅ Bu yerga qo'shildi
}

export default function ExerciseSession({ exerciseType, onComplete, onBack }: ExerciseSessionProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  // Namuna savollar (Buni keyin bazadan olasiz)
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
      onComplete();
    }
  };

  const progress = ((currentStep + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans flex flex-col">
      
      {/* 🟢 TOP BAR: PROGRESS */}
      <div className="px-6 pt-12 pb-6 flex items-center space-x-4 bg-white/50 backdrop-blur-md border-b border-white/20">
        <button onClick={onBack} className="text-[#A0B8B4] hover:text-[#F44336] transition-all active:scale-90">
          <X className="w-8 h-8" />
        </button>
        <div className="flex-1 bg-white/50 h-3 rounded-full overflow-hidden border border-[#E8DFCC] relative">
          <div 
            className="bg-[#2EB8A6] h-full transition-all duration-700 rounded-full"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute top-0 right-0 bottom-0 w-2 bg-white/20 skew-x-[-20deg]"></div>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-2xl flex items-center space-x-1 shadow-sm border border-[#E8DFCC]">
           <Trophy className="w-4 h-4 text-[#F4C150]" />
           <span className="font-black text-[#2EB8A6] text-sm">{score}</span>
        </div>
      </div>

      {/* ❓ SAVOL QISMI */}
      <main className="flex-1 px-6 pt-12">
        <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-b-[6px] border-[#E8DFCC] relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#E6F4F1] rounded-full opacity-50"></div>
          
          <div className="relative z-10 space-y-3 text-center">
            <div className="inline-flex items-center space-x-2 bg-[#E6F4F1] px-4 py-1 rounded-full">
               <Sparkles className="w-3 h-3 text-[#2EB8A6]" />
               <p className="text-[#2EB8A6] font-black uppercase text-[10px] tracking-widest">Táripti tabıń</p>
            </div>
            <h2 className="text-[#2C4A44] text-2xl font-black leading-tight">
              {questions[currentStep].question}
            </h2>
          </div>
        </div>

        {/* 🔘 VARIANTLAR */}
        <div className="mt-10 space-y-4">
          {questions[currentStep].options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelectedAnswer(idx)}
              className={`w-full p-6 rounded-[30px] text-left font-bold text-lg border-b-[6px] transition-all active:translate-y-1 active:border-b-0 relative overflow-hidden flex items-center ${
                selectedAnswer === idx 
                  ? 'bg-white border-[#2EB8A6] text-[#2EB8A6] shadow-emerald-50' 
                  : 'bg-white border-[#E8DFCC] text-[#2C4A44]'
              } ${isAnswered && idx === questions[currentStep].correct ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : ''}`}
            >
              <span className={`w-10 h-10 rounded-2xl flex items-
