import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Loader2, Award, Timer, CheckCircle, AlertCircle, Check, X } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function MockTest({ onComplete }: { onComplete: () => void }) {
  const [questions, setQuestions] = useState<any[]>([]);
  const [examConfig, setExamConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [testTimeLeft, setTestTimeLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  useEffect(() => {
    async function initTest() {
      setLoading(true);
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

  useEffect(() => {
    if (examConfig && !isExamStarted) {
      const startTime = new Date(examConfig.start_time);
      if (currentTime >= startTime) {
        setIsExamStarted(true);
        setTestTimeLeft(examConfig.duration_minutes * 60);
      }
    }
  }, [currentTime, examConfig, isExamStarted]);

  useEffect(() => {
    if (isExamStarted && !isFinished && testTimeLeft > 0) {
      const timer = setInterval(() => setTestTimeLeft(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    } else if (isExamStarted && testTimeLeft === 0) {
      handleFinishTest();
    }
  }, [isExamStarted, isFinished, testTimeLeft]);

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  // 🏆 Rash modeli va mezonlar bo'yicha darajani aniqlash 
  const calculateLevel = (percent: number) => {
    if (percent >= 90) return { level: 'A+', color: 'text-blue-600', bg: 'bg-blue-100' }; // [cite: 39]
    if (percent >= 86) return { level: 'A', color: 'text-blue-500', bg: 'bg-blue-50' }; // [cite: 39]
    if (percent >= 76) return { level: 'B+', color: 'text-green-600', bg: 'bg-green-100' }; // 
    if (percent >= 71) return { level: 'B', color: 'text-green-500', bg: 'bg-green-50' }; // [cite: 47]
    if (percent >= 61) return { level: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' }; // [cite: 47]
    if (percent >= 56) return { level: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' }; // [cite: 47]
    return { level: 'Dáreje berilmeydi', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const handleFinishTest = async () => {
    if (isFinished) return;
    setIsFinished(true);
    
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (q.type === 'mcq' && String(userAnswer) === String(q.correct_answer)) {
        correctCount++;
      } else if (q.type === 'open_ended' && String(userAnswer).toLowerCase().trim() === String(q.correct_answer).toLowerCase().trim()) {
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

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin w-10 h-10 text-indigo-600" /></div>;

  if (!isExamStarted && !isFinished) {
    const diff = new Date(examConfig?.start_time).getTime() - currentTime.getTime();
    const waitTime = diff > 0 ? new Date(diff).toISOString().substr(11, 8) : "00:00:00";

    return (
      <div className="min-h-screen bg-indigo-600 flex items-center justify-center p-4 text-white">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-md p-8 rounded-3xl text-center border border-white/20">
          <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-400" />
          <h2 className="text-2xl font-bold mb-2">Dizimnen ótiw tabıslı!</h2>
          <p className="mb-8 opacity-80">Imtixan baslanıwına qaldı:</p>
          <div className="text-6xl font-mono font-bold mb-8 tracking-tighter">{waitTime}</div>
          <Button onClick={onComplete} variant="ghost" className="text-white hover:bg-white/10 italic">Ortqa qaytıw</Button>
        </div>
      </div>
    );
  }

  if (isFinished) {
    const percentage = questions.length > 0 ? Math.round((score.correct / score.total) * 100) : 0;
    const result = calculateLevel(percentage);
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
          <div className={`w-20 h-20 ${result.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
             <Award className={`w-10 h-10 ${result.color}`} />
          </div>
          <h2 className="text-3xl font-bold mb-2">Imtixan juwmaqlandı</h2>
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-gray-50 p-4 rounded-2xl">
                <p className="text-2xl font-black">{score.correct}/{score.total}</p>
                <p className="text-xs text-gray-500 uppercase">Durıs</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-2xl">
                <p className="text-2xl font-black text-indigo-600">{percentage}%</p>
                <p className="text-xs text-gray-500 uppercase">Ózlestiriw</p>
            </div>
          </div>
          <div className={`p-4 rounded-2xl border-2 mb-8 ${result.color} ${result.bg} font-black text-3xl`}>
            Dáreje: {result.level}
          </div>
          <Button onClick={onComplete} className="w-full bg-indigo-600 h-12 rounded-xl">Bas betke qaytıw</Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      <div className="w-full md:w-80 bg-white shadow-lg flex flex-col border-r">
        <div className="p-5 bg-indigo-600 text-white flex justify-between items-center">
          <div className="flex items-center font-mono font-bold text-xl">
            <Clock className="mr-2 w-5 h-5" /> 
            {Math.floor(testTimeLeft / 60)}:{(testTimeLeft % 60).toString().padStart(2, '0')}
          </div>
        </div>
        <div className="p-4 flex-1 overflow-y-auto grid grid-cols-5 gap-2 content-start">
          {questions.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentQuestionIndex(idx)}
              className={`h-10 rounded-lg text-sm font-bold transition-all ${currentQuestionIndex === idx ? 'bg-indigo-600 text-white shadow-lg scale-105' : answers[idx] !== undefined ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-50 text-gray-400 border border-gray-100'}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
        <div className="p-4 border-t"><Button onClick={handleFinishTest} className="w-full bg-red-500 hover:bg-red-600 text-white font-bold h-12 rounded-xl shadow-md">Imtixandı tamamlaw</Button></div>
      </div>

      <div className="flex-1 p-4 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm p-6 md:p-12 border border-gray-100 relative">
          <div className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-4">Soraw {currentQuestionIndex + 1}</div>
          <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed mb-10">{currentQuestion?.question}</p>
          
          <div className="space-y-3">
            {currentQuestion?.type === 'mcq' ? (
              currentQuestion.options?.map((option: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center ${answers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-50 shadow-sm' : 'border-gray-100 hover:border-indigo-200 bg-gray-50'}`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${answers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-600' : 'border-gray-300'}`}>
                    {answers[currentQuestionIndex] === idx && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                  <span className={`text-lg ${answers[currentQuestionIndex] === idx ? 'text-indigo-900 font-bold' : 'text-gray-600'}`}>{option}</span>
                </button>
              ))
            ) : (
              <textarea
                rows={4}
                value={answers[currentQuestionIndex] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
                className="w-full p-5 rounded-2xl border-2 border-gray-100 bg-gray-50 focus:border-indigo-600 focus:bg-white transition-all text-lg outline-none"
                placeholder="Juwabıńızdı usı jerge jazıń..."
              />
            )}
          </div>

          <div className="flex justify-between mt-12 pt-8 border-t border-gray-50">
            <Button variant="ghost" disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(prev => prev - 1)} className="font-bold text-gray-400">Aldınǵı</Button>
            <Button disabled={currentQuestionIndex === questions.length - 1} onClick={() => setCurrentQuestionIndex(prev => prev + 1)} className="bg-indigo-600 font-bold px-8 rounded-xl shadow-lg">Keyingi</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
