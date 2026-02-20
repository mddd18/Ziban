import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Loader2, Award, Timer, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Imtihon holatlari
  const [hasTaken, setHasTaken] = useState(false);
  const [examStatus, setExamStatus] = useState<'waiting' | 'in_progress' | 'ended' | 'missed'>('waiting');
  const [isFinished, setIsFinished] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // 1. Bazadan ma'lumotlarni tortish
 useEffect(() => {
    async function initTest() {
      setLoading(true);
      const userPhone = localStorage.getItem('userPhone');

      // 1. Avval joriy imtihonni (exam_settings) bazadan olamiz
      const { data: settings } = await supabase.from('exam_settings').select('*').limit(1);
      
      if (settings && settings.length > 0) {
        const currentExam = settings[0];
        setExamConfig(currentExam);

        // 2. Foydalanuvchi AYNAN SHU imtihonni (exam_id) ishlaganini tekshiramiz
        if (userPhone) {
          const { data: existingResult } = await supabase
            .from('user_results')
            .select('id')
            .eq('user_phone', userPhone)
            .eq('exercise_type', 'mock_test')
            .eq('exam_id', currentExam.id) // 👈 MANA SHU YERDA ID TEKSHIRILADI
            .limit(1);

          if (existingResult && existingResult.length > 0) {
            setHasTaken(true); // Shu testni ishlagan bo'lsa, bloklaymiz
            setLoading(false);
            return;
          }
        }
      }

      // 3. Savollarni olib kelamiz
      const { data: qs } = await supabase.from('mock_questions').select('*').order('question_number');
      if (qs) setQuestions(qs || []);
      
      setLoading(false);
    }
    initTest();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  // 2. Vaqtni va Imtihon holatini nazorat qilish
  useEffect(() => {
    if (examConfig && !hasTaken && !isFinished) {
      const startTime = new Date(examConfig.start_time);
      const endTime = new Date(startTime.getTime() + examConfig.duration_minutes * 60000);
      const now = currentTime.getTime();

      if (now < startTime.getTime()) {
        setExamStatus('waiting');
      } else if (now >= startTime.getTime() && now < endTime.getTime()) {
        if (examStatus !== 'in_progress') {
          setExamStatus('in_progress');
        }
        // Qolgan vaqtni hisoblash (soniyalarda)
        setTestTimeLeft(Math.floor((endTime.getTime() - now) / 1000));
      } else if (now >= endTime.getTime()) {
        if (examStatus === 'in_progress') {
          // Vaqt tugadi, avtomatik saqlaymiz
          handleFinishTest();
        } else {
          setExamStatus('missed');
        }
      }
    }
  }, [currentTime, examConfig, hasTaken, isFinished, examStatus]);

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  // 3. Darajani aniqlash (Hujjatdagi mezonlar asosida)
  const calculateLevel = (percent: number) => {
    if (percent >= 86) return { level: 'A+', color: 'text-blue-600', bg: 'bg-blue-100', text: 'Maksimal ball' };
    if (percent >= 71) return { level: 'A', color: 'text-blue-500', bg: 'bg-blue-50', text: 'Maksimal ball' };
    if (percent >= 61) return { level: 'B+', color: 'text-green-600', bg: 'bg-green-100', text: 'Proporsional ball' };
    if (percent >= 56) return { level: 'B', color: 'text-green-500', bg: 'bg-green-50', text: 'Proporsional ball' };
    if (percent >= 50) return { level: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Proporsional ball' };
    if (percent >= 46) return { level: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Proporsional ball' };
    return { level: 'Dáreje berilmeydi', color: 'text-red-600', bg: 'bg-red-50', text: 'Tómen kórsetkish' };
  };

  // 4. Testni yakunlash va bazaga saqlash
  const handleFinishTest = async () => {
    if (isFinished) return;
    setIsFinished(true);
    setExamStatus('ended');
    
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (q.type === 'mcq' && String(userAnswer) === String(q.correct_answer)) {
        correctCount++;
      } else if (q.type === 'open_ended' && userAnswer && String(userAnswer).toLowerCase().trim() === String(q.correct_answer).toLowerCase().trim()) {
        correctCount++;
      }
    });

    setScore({ correct: correctCount, total: questions.length });

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

  // EKRANLAR:

  // 1. Yuklanish ekrani
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
    </div>
  );

  // 2. Oldin topshirgan bo'lsa
  if (hasTaken) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md border border-yellow-200">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Siz qatnasqansız!</h2>
        <p className="text-gray-600 mb-6">Bul imtixanda hár bir paydalanıwshı tek bir márte qatnasıwı múmkin.</p>
        <Button onClick={onComplete} className="w-full bg-indigo-600">Bas betke qaytıw</Button>
      </div>
    </div>
  );

  // 3. Imtihon o'tib ketgan bo'lsa (Kechikkanlar uchun)
  if (examStatus === 'missed') return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md border border-red-200">
        <Clock className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-red-800 mb-2">Waqıt tawsıldı!</h2>
        <p className="text-gray-600 mb-6">Imtixan múddeti ótip ketti. Siz imtixanǵa kire almaysız.</p>
        <Button onClick={onComplete} variant="outline" className="w-full">Ortqa qaytıw</Button>
      </div>
    </div>
  );

  // 4. Kutish ekrani (Vaqt kelishidan oldin)
  if (examStatus === 'waiting') {
    const diff = new Date(examConfig?.start_time).getTime() - currentTime.getTime();
    const waitTime = diff > 0 ? new Date(diff).toISOString().substr(11, 8) : "00:00:00";

    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 text-white text-center">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h2 className="text-2xl font-bold mb-2">Dizimnen ótiw tabıslı!</h2>
          <p className="opacity-80 mb-6">Imtixan baslanıwına qaldı:</p>
          <div className="text-6xl font-mono font-bold mb-8">{waitTime}</div>
          <div className="text-sm bg-black/20 p-4 rounded-xl text-left space-y-2 mb-6">
            <p>• Boshlanısh waqtı: <span className="font-bold">{new Date(examConfig?.start_time).toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span></p>
            <p>• Múddeti: <span className="font-bold">{examConfig?.duration_minutes} minut</span></p>
          </div>
          <Button onClick={onComplete} variant="ghost" className="text-white hover:bg-white/10 w-full">Artqa qaytıw</Button>
        </div>
      </div>
    );
  }

  // 5. Natijalar ekrani (Imtihon tugagach)
  if (isFinished) {
    const percentage = questions.length > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const result = calculateLevel(percentage);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className={`w-20 h-20 ${result.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
             <Award className={`w-10 h-10 ${result.color}`} />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Imtixan juwmaqlandı</h2>
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-2xl border">
                <p className="text-2xl font-black text-gray-800">{score.correct}/{score.total}</p>
                <p className="text-xs text-gray-500 uppercase mt-1">Durıs juwap</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-2xl font-black text-indigo-600">{percentage}%</p>
                <p className="text-xs text-gray-500 uppercase mt-1">Ózlestiriw</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border-2 mb-8 ${result.bg} ${result.color.replace('text-', 'border-')}`}>
            <p className="text-sm font-semibold mb-1 text-gray-600">Sertifikat dárejesi:</p>
            <p className={`text-5xl font-extrabold mb-2 ${result.color}`}>{result.level}</p>
            <p className="text-sm font-medium opacity-80">{result.text}</p>
          </div>
          <Button onClick={onComplete} className="w-full bg-indigo-600 h-12 rounded-xl text-lg font-bold">Bas betke qaytıw</Button>
        </div>
      </div>
    );
  }

  // 6. ASOSIY TEST EKRANI (in_progress)
  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Chap tomon: Navigatsiya va Taymer */}
      <div className="w-full md:w-80 bg-white shadow-lg flex flex-col z-10 relative">
        <div className="p-4 border-b flex items-center justify-between bg-white">
          <Button variant="ghost" onClick={onComplete} className="p-2 text-gray-600 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center text-red-600 font-mono text-xl font-bold bg-red-50 px-4 py-2 rounded-xl border border-red-100">
            <Timer className="mr-2 w-5 h-5 animate-pulse" /> 
            {Math.floor(testTimeLeft / 60).toString().padStart(2, '0')}:{(testTimeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wider">Sorawlar ({questions.length})</h3>
          <div className="grid grid-cols-5 gap-2 content-start">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
              const isCurrent = currentQuestionIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-12 rounded-xl text-sm font-bold transition-all border-2
                    ${isCurrent ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-md transform scale-105' 
                    : isAnswered ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300'}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <Button onClick={handleFinishTest} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-14 rounded-xl shadow-md text-lg">
            Imtixandı juwmaqlaw
          </Button>
        </div>
      </div>

      {/* O'ng tomon: Savol va Variantlar */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-gray-200">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-black text-gray-800">
              {currentQuestionIndex + 1}-soraw
            </h2>
            <span className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold tracking-wide">
              {currentQuestion?.type === 'mcq' ? 'Jabıq test' : 'Ashıq soraw'}
            </span>
          </div>

          <p className="text-xl md:text-2xl text-gray-900 mb-10 leading-relaxed font-medium">
            {currentQuestion?.question}
          </p>

          <div className="space-y-4">
            {currentQuestion?.type === 'mcq' ? (
              // Test variantlari
              currentQuestion.options?.map((option: string, idx: number) => {
                const isSelected = answers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center group
                      ${isSelected ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-gray-200 hover:border-indigo-300 bg-white'}
                    `}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 mr-4 flex items-center justify-center flex-shrink-0 transition-colors
                      ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300 group-hover:border-indigo-400'}
                    `}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-lg ${isSelected ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>
                      {option}
                    </span>
                  </button>
                );
              })
            ) : (
              // Ochiq savol yozish maydoni
              <div className="bg-blue-50/50 p-2 rounded-3xl border border-blue-100">
                <textarea
                  rows={5}
                  value={answers[currentQuestionIndex] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-6 rounded-2xl border-0 bg-transparent focus:ring-0 resize-none text-xl text-gray-800 placeholder-gray-400"
                  placeholder="Juwabıńızdı usı jerge anıq etip jazıń..."
                />
              </div>
            )}
          </div>

          <div className="flex justify-between mt-12 pt-6">
            <Button
              variant="outline"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
              className="h-12 px-8 rounded-xl font-bold text-gray-600 border-2"
            >
              Aldınǵı
            </Button>
            <Button
              disabled={currentQuestionIndex === questions?.length - 1}
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="h-12 px-8 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-200"
            >
              Keyingi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
