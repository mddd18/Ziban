import { useState, useEffect } from 'react';
import { Clock, ArrowLeft, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

interface MockQuestion {
  id: number;
  question_number: number;
  type: 'mcq' | 'open_ended'; // mcq - test, open_ended - yozma javob
  question: string;
  options?: string[]; // Faqat testlar uchun
  correct_answer: string | number;
}

interface MockTestProps {
  onComplete: () => void;
}

export default function MockTest({ onComplete }: MockTestProps) {
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, string | number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120 * 60); // 120 daqiqa (2 soat)
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  // 1. Bazadan Mock Test savollarini tortib olish
  useEffect(() => {
    async function fetchMockQuestions() {
      setLoading(true);
      // Hozircha 'mock_questions' jadvalidan tortamiz (buni Supabase'da yaratishingiz kerak bo'ladi)
      const { data, error } = await supabase
        .from('mock_questions')
        .select('*')
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Xatolik:', error);
      } else if (data && data.length > 0) {
        setQuestions(data);
      } else {
        // Agar bazada savol yo'q bo'lsa, test uchun vaqtincha (shablon) savollar qotirib turamiz
        setQuestions([
          { id: 1, question_number: 1, type: 'mcq', question: 'Tómende berilgen mısaldağı dawıslı seslerdiń barlığına sáykes durıs sıpatlamanı anıqlań. "Ashshı da bolsa, anığın ayt."', options: ['Juwan dawıslı sesler', 'Eziwlik dawıslı sesler', 'Jińishke dawıslı sesler', 'Erinlik dawıslı sesler'], correct_answer: 0 },
          { id: 2, question_number: 2, type: 'mcq', question: 'Qaysı gápte stillik jaqtan úylesimsiz sóz qollanılǵan?', options: ['Kóp nárseni ishteyi ala bermeytuǵın tamaqsaw...', 'Eshkidey zikeń-zikeń ete bermey...', 'Tırnalar da kólin qıymay...', 'Kúle-kúle ishek silemiz qattı...'], correct_answer: 1 },
          { id: 36, question_number: 3, type: 'open_ended', question: 'Berilgen frazeologizmlerdiń úshewine tán bolǵan mánini bir sóz benen jazıń: 1. Barmaǵıń birikpese... 2. Tórtew túwel bolsa... 3. Birdiń abırayı...', correct_answer: 'Awızbirshilik' }
        ]);
      }
      setLoading(false);
    }
    fetchMockQuestions();
  }, []);

  // 2. Taymer mantiqi
  useEffect(() => {
    if (loading || isFinished) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleFinishTest(); // Vaqt tugasa avtomatik testni yakunlaydi
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, isFinished]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAnswer = (answer: string | number) => {
    setAnswers({ ...answers, [currentQuestionIndex]: answer });
  };

  const handleFinishTest = async () => {
    setIsFinished(true);
    
    // Natijani hisoblash
    let correctCount = 0;
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      // Yozma javoblarni tekshirganda katta-kichik harflarni bir xil qilib solishtiramiz
      if (q.type === 'mcq' && userAnswer === q.correct_answer) {
        correctCount++;
      } else if (q.type === 'open_ended' && String(userAnswer).toLowerCase().trim() === String(q.correct_answer).toLowerCase().trim()) {
        correctCount++;
      }
    });

    setScore({ correct: correctCount, total: questions.length });

    // Natijani Supabase 'user_results' jadvaliga yozish
    const userPhone = localStorage.getItem('userPhone');
    if (userPhone) {
      await supabase.from('user_results').insert([{
        user_phone: userPhone,
        exercise_type: 'mock_test',
        total_questions: questions.length,
        correct_answers: correctCount,
        accuracy: Math.round((correctCount / questions.length) * 100)
      }]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Imtihon tayyorlanmoqda...</p>
      </div>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score.correct / score.total) * 100);
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex flex-col items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Imtihon yakunlandi!</h2>
          <p className="text-gray-600 mb-8">Sizning natijangiz (Rash modelisiz, dastlabki hisob):</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-50 p-4 rounded-xl">
              <p className="text-3xl font-bold text-green-600">{score.correct}/{score.total}</p>
              <p className="text-sm text-gray-600 mt-1">Durıs juwaplar</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-xl">
              <p className="text-3xl font-bold text-indigo-600">{percentage}%</p>
              <p className="text-sm text-gray-600 mt-1">Ózlestiriw</p>
            </div>
          </div>
          
          <Button onClick={onComplete} className="w-full h-12 bg-indigo-600 hover:bg-indigo-700">
            Bas sahifaǵa qaytıw
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Chap tomon: Savollar paneli (Sidebar) */}
      <div className="w-full md:w-80 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b flex items-center justify-between bg-indigo-600 text-white">
          <Button variant="ghost" onClick={onComplete} className="p-2 text-white hover:bg-indigo-700">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center space-x-2 font-mono text-lg font-bold">
            <Clock className="w-5 h-5" />
            <span className={timeLeft < 300 ? 'text-red-300' : ''}>{formatTime(timeLeft)}</span>
          </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto">
          <h3 className="font-bold text-gray-700 mb-4">Savollar ({questions.length})</h3>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`h-10 rounded-lg text-sm font-medium transition-all
                  ${currentQuestionIndex === idx ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
                  ${answers[idx] !== undefined ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t">
          <Button onClick={handleFinishTest} className="w-full bg-red-500 hover:bg-red-600 h-12 text-white font-bold">
            Imtihonni yakunlash
          </Button>
        </div>
      </div>

      {/* O'ng tomon: Savol ekrani */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm p-6 md:p-10 border border-gray-200">
          <div className="flex items-center justify-between mb-8 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {currentQuestionIndex + 1}-savol
            </h2>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
              {currentQuestion.type === 'mcq' ? 'Yopiq test' : 'Ochiq savol'}
            </span>
          </div>

          <p className="text-lg text-gray-900 mb-8 leading-relaxed font-medium">
            {currentQuestion.question}
          </p>

          {/* Javob berish qismi (Test yoki Matnli) */}
          <div className="space-y-4">
            {currentQuestion.type === 'mcq' ? (
              currentQuestion.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all flex items-center space-x-3
                    ${answers[currentQuestionIndex] === idx ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                    ${answers[currentQuestionIndex] === idx ? 'border-indigo-600' : 'border-gray-300'}
                  `}>
                    {answers[currentQuestionIndex] === idx && <div className="w-3 h-3 bg-indigo-600 rounded-full" />}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </button>
              ))
            ) : (
              <div>
                <textarea
                  rows={4}
                  placeholder="Juwabıńızdı usı jerge jazıń..."
                  value={(answers[currentQuestionIndex] as string) || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-600 focus:ring-0 resize-none"
                />
                <p className="text-sm text-gray-500 mt-2 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" /> Ochiq savolga qisqa va aniq javob yozing.
                </p>
              </div>
            )}
          </div>

          {/* Navigatsiya tugmalari */}
          <div className="flex justify-between mt-12 pt-6 border-t">
            <Button
              variant="outline"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
            >
              Aldınǵı
            </Button>
            <Button
              disabled={currentQuestionIndex === questions.length - 1}
              onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Keyingi
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
