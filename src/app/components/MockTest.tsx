import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Loader2, Award, Timer, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasTaken, setHasTaken] = useState(false); // Oldin topshirganmi?
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isExamOver, setIsExamOver] = useState(false); // 15:00 bo'ldimi?
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function initTest() {
      setLoading(true);
      const userPhone = localStorage.getItem('userPhone');

      // 1. Foydalanuvchi oldin topshirganini tekshirish
      const { data: existingResult } = await supabase
        .from('user_results')
        .select('*')
        .eq('user_phone', userPhone)
        .eq('exercise_type', 'mock_test')
        .maybeSingle();

      if (existingResult) {
        setHasTaken(true);
        setLoading(false);
        return;
      }

      // 2. Imtihon va savollarni olish
      const { data: settings } = await supabase.from('exam_settings').select('*').maybeSingle();
      const { data: qs } = await supabase.from('mock_questions').select('*').order('question_number');
      
      if (settings) setExamConfig(settings);
      if (qs) setQuestions(qs || []);
      setLoading(false);
    }
    initTest();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Vaqtni nazorat qilish (13:00 - 15:00 oralig'i)
  useEffect(() => {
    if (examConfig) {
      const startTime = new Date(examConfig.start_time);
      const endTime = new Date(startTime.getTime() + examConfig.duration_minutes * 60000);

      if (currentTime >= startTime && currentTime < endTime) {
        if (!isExamStarted) {
          setIsExamStarted(true);
          // Qolgan vaqtni hisoblash (agar foydalanuvchi kechikib kirsa ham 15:00 da tugaydi)
          const remainingSeconds = Math.floor((endTime.getTime() - currentTime.getTime()) / 1000);
          setTestTimeLeft(remainingSeconds);
        }
      } else if (currentTime >= endTime) {
        setIsExamOver(true);
        if (isExamStarted && !isFinished) handleFinishTest();
      }
    }
  }, [currentTime, examConfig]);

  // Taymerni yangilash
  useEffect(() => {
    if (isExamStarted && !isFinished && testTimeLeft > 0) {
      const timer = setInterval(() => setTestTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [isExamStarted, isFinished, testTimeLeft]);

  const handleFinishTest = async () => {
    if (isFinished) return;
    setIsFinished(true);
    
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (q.type === 'mcq' && String(userAnswer) === String(q.correct_answer)) correctCount++;
      else if (q.type === 'open_ended' && String(userAnswer).toLowerCase().trim() === String(q.correct_answer).toLowerCase().trim()) correctCount++;
    });

    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) {
      const accuracy = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      await supabase.from('user_results').insert([{
        user_phone: userPhone,
        exercise_type: 'mock_test',
        total_questions: questions.length,
        correct_answers: correctCount,
        accuracy: accuracy
      }]);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" /></div>;

  // 1-Qoidamiz: Agar foydalanuvchi topshirgan bo'lsa
  if (hasTaken) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md border border-yellow-200">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Siz qatnasqansız!</h2>
          <p className="text-gray-600 mb-6">Bul imtixanda hár bir paydalanıwshı tek bir márte qatnasıwı múmkin.</p>
          <Button onClick={onComplete} className="w-full bg-indigo-600">Bas betke qaytıw</Button>
        </div>
      </div>
    );
  }

  // 2-Qoidamiz: Imtihon butunlay tugagan bo'lsa
  if (isExamOver && !isFinished) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md border border-red-200">
          <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-800 mb-2">Waqıt tawsıldı!</h2>
          <p className="text-gray-600 mb-6">Imtixan múddeti ótip ketti. Siz imtixanǵa kire almaysız.</p>
          <Button onClick={onComplete} variant="outline" className="w-full">Ortqa</Button>
        </div>
      </div>
    );
  }

  // Kutish ekrani (Vaqt kelishidan oldin)
  if (!isExamStarted && !isFinished) {
    const diff = new Date(examConfig?.start_time).getTime() - currentTime.getTime();
    const waitTime = diff > 0 ? new Date(diff).toISOString().substr(11, 8) : "00:00:00";

    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 text-white text-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h2 className="text-2xl font-bold mb-2">Dizimnen ótiw tabıslı!</h2>
          <p className="opacity-80 mb-6">Imtixan baslanıwına qaldı:</p>
          <div className="text-6xl font-mono font-bold mb-8">{waitTime}</div>
          <div className="text-sm bg-black/20 p-4 rounded-xl text-left space-y-2">
            <p>• Boshlanısh: {new Date(examConfig?.start_time).toLocaleTimeString()}</p>
            <p>• Tugash: {new Date(new Date(examConfig?.start_time).getTime() + examConfig?.duration_minutes * 60000).toLocaleTimeString()}</p>
          </div>
        </div>
      </div>
    );
  }

  // Test ishlash jarayoni (Savollar mantiqi...)
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       <div className="p-4 bg-white shadow flex justify-between items-center border-b">
          <span className="font-bold text-gray-700">Imtixan júrip atır</span>
          <div className="text-red-600 font-mono font-bold text-xl flex items-center">
            <Timer className="mr-2" /> 
            {Math.floor(testTimeLeft / 60)}:{(testTimeLeft % 60).toString().padStart(2, '0')}
          </div>
       </div>
       {/* Sorawlar hám variantlar usı jerde dawam etedi */}
       <div className="p-8 text-center text-gray-400 italic">
          Kechikib kirsangiz ham imtihon belgilangan vaqtda (15:00) avtomatik tugaydi.
       </div>
    </div>
  );
}
