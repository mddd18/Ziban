import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Loader2, Award, Timer, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function initTest() {
      setLoading(true);
      // 1. Imtihon sozlamalarini olish
      const { data: settings } = await supabase.from('exam_settings').select('*').single();
      // 2. Savollarni olish
      const { data: qs } = await supabase.from('mock_questions').select('*').order('question_number');
      
      if (settings) setExamConfig(settings);
      if (qs) setQuestions(qs);
      setLoading(false);
    }
    initTest();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Imtihon boshlanganini tekshirish
  useEffect(() => {
    if (examConfig && !isExamStarted) {
      const startTime = new Date(examConfig.start_time);
      if (currentTime >= startTime) {
        setIsExamStarted(true);
        setTestTimeLeft(examConfig.duration_minutes * 60);
      }
    }
  }, [currentTime, examConfig]);

  // Test taymeri
  useEffect(() => {
    if (isExamStarted && !isFinished && testTimeLeft > 0) {
      const timer = setInterval(() => setTestTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isExamStarted && testTimeLeft === 0) {
      handleFinishTest();
    }
  }, [isExamStarted, isFinished, testTimeLeft]);

  const getWaitTime = () => {
    if (!examConfig) return "";
    const diff = new Date(examConfig.start_time).getTime() - currentTime.getTime();
    if (diff <= 0) return "00:00:00";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}s ${m}m ${s}s`;
  };

  const handleFinishTest = async () => {
    setIsFinished(true);
    // Natijalarni hisoblash va saqlash kodi (oldingi variantdagidek)
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;

  // 👈 IMTIHON VAQTI KELMAGAN BO'LSA (KUTISH EKRANI)
  if (!isExamStarted && !isFinished) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 text-white text-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h2 className="text-2xl font-bold mb-2">Dizimnen ótiw tabıslı!</h2>
          <p className="text-indigo-100 mb-8">Siz imtixanǵa qabıllandıńız. Test baslanıwına:</p>
          
          <div className="text-5xl font-mono font-bold mb-8 tracking-wider">
            {getWaitTime()}
          </div>
          
          <div className="bg-white/5 p-4 rounded-xl text-sm text-left">
            <p>• Imtixan: {examConfig?.exam_name}</p>
            <p>• Waqtı: {new Date(examConfig?.start_time).toLocaleString()}</p>
            <p>• Dawamlılıǵı: {examConfig?.duration_minutes} minut</p>
          </div>
        </div>
      </div>
    );
  }

  // 👈 TEST EKRANI (isExamStarted bo'lganda ko'rinadi)
  return (
    <div className="min-h-screen bg-gray-100">
        {/* Test kodi shu yerda davom etadi... */}
        <div className="p-4 bg-white shadow-sm flex justify-between items-center">
            <span className="font-bold">Imtixan júrip atır</span>
            <div className="flex items-center text-red-600 font-mono font-bold">
                <Timer className="mr-2" /> {Math.floor(testTimeLeft / 60)}:{testTimeLeft % 60}
            </div>
        </div>
        {/* Savollar mantiqi... */}
    </div>
  );
}
