import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Loader2, Timer, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Xatolikni ushlash
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    async function initTest() {
      try {
        setLoading(true);
        setError(null);

        // 1. Imtihon sozlamalarini olish
        const { data: settings, error: settingsError } = await supabase
          .from('exam_settings')
          .select('*')
          .maybeSingle(); // single() o'rniga maybeSingle() xatolikni kamaytiradi

        if (settingsError) throw settingsError;
        if (!settings) {
          setError("Imtihon sozlamalari (exam_settings) bazadan topilmadi.");
          setLoading(false);
          return;
        }

        // 2. Savollarni olish
        const { data: qs, error: qsError } = await supabase
          .from('mock_questions')
          .select('*')
          .order('question_number');

        if (qsError) throw qsError;

        setExamConfig(settings);
        setQuestions(qs || []);
      } catch (err: any) {
        console.error('Baza bilan ulanishda xato:', err);
        setError(err.message || "Kutilmagan xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    }
    initTest();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Imtihon boshlanganini tekshirish mantiqi
  useEffect(() => {
    if (examConfig && !isExamStarted) {
      const startTime = new Date(examConfig.start_time);
      if (currentTime >= startTime) {
        setIsExamStarted(true);
        setTestTimeLeft(examConfig.duration_minutes * 60);
      }
    }
  }, [currentTime, examConfig, isExamStarted]);

  const getWaitTime = () => {
    if (!examConfig) return "";
    const diff = new Date(examConfig.start_time).getTime() - currentTime.getTime();
    if (diff <= 0) return "00:00:00";
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-600 mb-4" />
      <p>Imtihon ma'lumotlari yuklanmoqda...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 p-4 text-center">
      <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
      <h2 className="text-xl font-bold text-red-700 mb-2">Xatolik yuz berdi</h2>
      <p className="text-red-600 mb-6">{error}</p>
      <Button onClick={onComplete} variant="outline">Ortga qaytish</Button>
    </div>
  );

  if (!isExamStarted && !isFinished) {
    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 text-white text-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h2 className="text-2xl font-bold mb-2">Dizimnen ótiw tabıslı!</h2>
          <p className="text-indigo-100 mb-8 font-medium">Imtixan baslanıwına qaldı:</p>
          <div className="text-5xl font-mono font-bold mb-8 tracking-tighter bg-black/20 py-4 rounded-2xl">
            {getWaitTime()}
          </div>
          <div className="space-y-3 bg-white/5 p-5 rounded-2xl text-left text-sm border border-white/10">
            <p className="flex justify-between"><span>Imtixan:</span> <span className="font-bold">{examConfig.exam_name}</span></p>
            <p className="flex justify-between"><span>Waqtı:</span> <span className="font-bold">{new Date(examConfig.start_time).toLocaleString('uz-UZ')}</span></p>
            <p className="flex justify-between"><span>Múddeti:</span> <span className="font-bold">{examConfig.duration_minutes} minut</span></p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-4 bg-white shadow-sm flex justify-between items-center border-b">
        <div className="flex items-center space-x-2">
           <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
           <span className="font-bold text-gray-700">Imtixan júrip atır</span>
        </div>
        <div className="flex items-center text-red-600 font-mono text-xl font-black bg-red-50 px-4 py-1 rounded-full border border-red-100">
          <Clock className="mr-2 w-5 h-5" /> 
          {Math.floor(testTimeLeft / 60)}:{(testTimeLeft % 60).toString().padStart(2, '0')}
        </div>
      </div>
      <div className="p-8 text-center text-gray-500">
        Savollar mantiqi shu yerda davom etadi... (Oldingi MockTest kodidagi savollar qismini bura joylang)
      </div>
    </div>
  );
}
