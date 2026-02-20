import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Award, Timer, CheckCircle, AlertCircle, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [hasTaken, setHasTaken] = useState(false);
  const [examStatus, setExamStatus] = useState<'waiting' | 'in_progress' | 'ended' | 'missed'>('waiting');
  const [isFinished, setIsFinished] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(new Date());
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [score, setScore] = useState({ correct: 0, total: 0, tScore: 0 });
  const [earnedCoins, setEarnedCoins] = useState(0);

  useEffect(() => {
    async function initTest() {
      setLoading(true);
      const userPhone = localStorage.getItem('userPhone');

      const { data: settings } = await supabase.from('exam_settings').select('*').limit(1);
      
      if (settings && settings.length > 0) {
        const currentExam = settings[0];
        setExamConfig(currentExam);

        if (userPhone) {
          const { data: existingResult } = await supabase
            .from('user_results')
            .select('id')
            .eq('user_phone', userPhone)
            .eq('exercise_type', 'mock_test')
            .eq('exam_id', currentExam.id)
            .limit(1);

          if (existingResult && existingResult.length > 0) {
            setHasTaken(true);
            setLoading(false);
            return;
          }
        }
      }

      const { data: qs } = await supabase.from('mock_questions').select('*').order('question_number');
      if (qs) setQuestions(qs || []);
      setLoading(false);
    }
    initTest();

    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (examConfig && !hasTaken && !isFinished) {
      const startTime = new Date(examConfig.start_time);
      const endTime = new Date(startTime.getTime() + examConfig.duration_minutes * 60000);
      const now = currentTime.getTime();

      if (now < startTime.getTime()) {
        setExamStatus('waiting');
      } else if (now >= startTime.getTime() && now < endTime.getTime()) {
        if (examStatus !== 'in_progress') setExamStatus('in_progress');
        setTestTimeLeft(Math.floor((endTime.getTime() - now) / 1000));
      } else if (now >= endTime.getTime()) {
        if (examStatus === 'in_progress') handleFinishTest();
        else setExamStatus('missed');
      }
    }
  }, [currentTime, examConfig, hasTaken, isFinished, examStatus]);

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  // 🌟 BAZADAN OLINGAN RASH MODELI VA TANGALAR
  const calculateLevel = (correct: number, total: number) => {
    if (total === 0) return { level: 'Dárejesiz', color: 'text-red-600', bg: 'bg-red-50', text: 'Tómen kórsetkish', coins: 0, tScore: 0 };
    
    // 1. Bazadan Rash parametrlarini olamiz
    const mu = examConfig?.rasch_mu || 60;
    const sigma = examConfig?.rasch_sigma || 15;
    const maxScore = examConfig?.max_score || 75; 

    // Qobiliyat (theta) va Z-ball
    const theta = (correct / total) * 100;
    const zScore = (theta - mu) / sigma;
    let tScore = 50 + (10 * zScore);

    tScore = Math.min(Math.round(tScore * 10) / 10, maxScore);
    if (tScore < 0) tScore = 0;
    
    // 2. Bazadan Tangalar miqdorini olamiz
    const cAPlus = examConfig?.coin_a_plus ?? 50;
    const cA = examConfig?.coin_a ?? 40;
    const cBPlus = examConfig?.coin_b_plus ?? 30;
    const cB = examConfig?.coin_b ?? 20;
    const cCPlus = examConfig?.coin_c_plus ?? 10;
    const cC = examConfig?.coin_c ?? 5;

    // 3. Darajalar va yutuqlarni belgilaymiz
    if (tScore >= 70) return { level: 'A+', color: 'text-blue-600', bg: 'bg-blue-100', text: 'Maksimal ball', coins: cAPlus, tScore };
    if (tScore >= 65) return { level: 'A', color: 'text-blue-500', bg: 'bg-blue-50', text: 'Maksimal ball', coins: cA, tScore };
    if (tScore >= 60) return { level: 'B+', color: 'text-green-600', bg: 'bg-green-100', text: 'Proporsional ball', coins: cBPlus, tScore };
    if (tScore >= 55) return { level: 'B', color: 'text-green-500', bg: 'bg-green-50', text: 'Proporsional ball', coins: cB, tScore };
    if (tScore >= 50) return { level: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Proporsional ball', coins: cCPlus, tScore };
    if (tScore >= 46) return { level: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'Proporsional ball', coins: cC, tScore };
    
    return { level: 'Dárejesiz', color: 'text-red-600', bg: 'bg-red-50', text: 'Tómen kórsetkish', coins: 0, tScore };
  };

  const handleFinishTest = async () => {
    if (isFinished) return;
    setIsFinished(true);
    setExamStatus('ended');
    
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (q.type === 'mcq' && String(userAnswer) === String(q.correct_answer)) correctCount++;
      else if (q.type === 'open_ended' && userAnswer && String(userAnswer).toLowerCase().trim() === String(q.correct_answer).toLowerCase().trim()) correctCount++;
    });

    const levelData = calculateLevel(correctCount, questions.length);
    setScore({ correct: correctCount, total: questions.length, tScore: levelData.tScore });
    setEarnedCoins(levelData.coins);

    const userPhone = localStorage.getItem('userPhone');
    if (userPhone && examConfig) {
      // Natijani yozish
      await supabase.from('user_results').insert([{
        user_phone: userPhone,
        exercise_type: 'mock_test',
        exam_id: examConfig.id,
        total_questions: questions.length,
        correct_answers: correctCount,
        accuracy: levelData.tScore 
      }]);

      // Coin qo'shish
      if (levelData.coins > 0) {
        const { data: userData } = await supabase.from('users').select('coins').eq('phone', userPhone).maybeSingle();
        if (userData) {
          await supabase.from('users').update({ coins: (userData.coins || 0) + levelData.coins }).eq('phone', userPhone);
        }
      }
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;

  if (hasTaken) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-lg text-center max-w-md border border-yellow-200">
        <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Siz qatnasqansız!</h2>
        <p className="text-gray-600 mb-6">Nátiyjeńizdi "Statistika" bóliminen kóriwińiz múmkin.</p>
        <Button onClick={onComplete} className="w-full bg-indigo-600">Bas betke qaytıw</Button>
      </div>
    </div>
  );

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
          <Button onClick={onComplete} variant="ghost" className="text-white hover:bg-white/10 w-full">Artqa qaytıw</Button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const endTime = new Date(new Date(examConfig.start_time).getTime() + examConfig.duration_minutes * 60000);
    const isGloballyEnded = currentTime >= endTime;

    if (!isGloballyEnded) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-indigo-100">
            <Lock className="w-20 h-20 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Juwaplarıńız qabıllandı!</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Siz imtixandı waqtınan aldıń juwmaqladıńız. Nıqaplaw hám ádalatlılıq maqsetinde nátiyjeler barlıq ushın imtixan waqtı tawsılǵannan soń (<span className="font-bold text-indigo-600">{endTime.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}</span> da) járiyalanadı.
            </p>
            <Button onClick={onComplete} className="w-full bg-indigo-600 h-12 rounded-xl font-bold">Túsinikli, bas betke qaytıw</Button>
          </div>
        </div>
      );
    }

    const result = calculateLevel(score.correct, score.total);
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className={`w-20 h-20 ${result.bg} rounded-full flex items-center justify-center mx-auto mb-4`}>
             <Award className={`w-10 h-10 ${result.color}`} />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Ulıwma Nátiyje</h2>
          
          {earnedCoins > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl mb-6 flex items-center justify-center text-yellow-700 font-bold">
              <span className="text-xl mr-2">🪙</span> +{earnedCoins} Coin utıp aldıńız!
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-2xl border">
                <p className="text-2xl font-black text-gray-800">{score.correct}/{score.total}</p>
                <p className="text-xs text-gray-500 uppercase mt-1">Durıs juwap</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
                <p className="text-2xl font-black text-indigo-600">{score.tScore}</p>
                <p className="text-xs text-indigo-500 font-bold uppercase mt-1">Rash Ball (T)</p>
            </div>
          </div>
          <div className={`p-6 rounded-2xl border-2 mb-8 ${result.bg} ${result.color.replace('text-', 'border-')}`}>
            <p className="text-sm font-semibold mb-1 text-gray-600">Sertifikat dárejesi:</p>
            <p className={`text-5xl font-extrabold mb-2 ${result.color}`}>{result.level}</p>
            <p className="text-sm opacity-80 font-medium">{result.text}</p>
          </div>
          <Button onClick={onComplete} className="w-full bg-indigo-600 h-12 rounded-xl text-lg font-bold">Statistikanı kóriw</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
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
          <div className="grid grid-cols-5 gap-2 content-start">
            {questions.map((_, idx) => {
              const isAnswered = answers[idx] !== undefined && answers[idx] !== '';
              return (
                <button key={idx} onClick={() => setCurrentQuestionIndex(idx)}
                  className={`h-12 rounded-xl text-sm font-bold transition-all border-2
                    ${currentQuestionIndex === idx ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-105' 
                    : isAnswered ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-white text-gray-500 border-gray-100'}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 border-t bg-gray-50">
          <Button onClick={handleFinishTest} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-14 rounded-xl">Imtixandı juwmaqlaw</Button>
        </div>
      </div>

      <div className="flex-1 p-4 md:p-8 overflow-y-auto bg-gray-50/50">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-gray-200">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-xl font-black text-gray-800">{currentQuestionIndex + 1}-soraw</h2>
          </div>

          <p className="text-xl md:text-2xl text-gray-900 mb-10 font-medium">{currentQuestion?.question}</p>

          <div className="space-y-4">
            {currentQuestion?.type === 'mcq' ? (
              currentQuestion.options?.map((option: string, idx: number) => {
                const isSelected = answers[currentQuestionIndex] === idx;
                return (
                  <button key={idx} onClick={() => handleAnswer(idx)}
                    className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center group ${isSelected ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 bg-white'}`}
                  >
                    <div className={`w-7 h-7 rounded-full border-2 mr-4 flex items-center justify-center ${isSelected ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                    <span className={`text-lg ${isSelected ? 'text-indigo-900 font-semibold' : 'text-gray-700'}`}>{option}</span>
                  </button>
                );
              })
            ) : (
              <textarea rows={5} value={answers[currentQuestionIndex] || ''} onChange={(e) => handleAnswer(e.target.value)}
                className="w-full p-6 rounded-2xl border bg-blue-50/50 focus:ring-0 text-xl" placeholder="Juwabıńızdı jazıń..."
              />
            )}
          </div>

          <div className="flex justify-between mt-12 pt-6">
            <Button variant="outline" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)}>Aldınǵı</Button>
            <Button disabled={currentQuestionIndex === questions?.length - 1} onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="bg-indigo-600 text-white">Keyingi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
