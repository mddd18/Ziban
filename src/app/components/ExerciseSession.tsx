import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, X, RotateCcw, Loader2, Coins, Crown, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ExerciseType } from '../App';
import { supabase } from '../../supabase';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  word: string;
}

interface ExerciseSessionProps {
  exerciseType: ExerciseType;
  onComplete: () => void;
}

export default function ExerciseSession({ exerciseType, onComplete }: ExerciseSessionProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{word: string; correct: boolean}[]>([]);

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true);
      const { data, error } = await supabase
        .from('questions')
        .select('*')
        .eq('exercise_type', exerciseType);

      if (error) {
        console.error('Xatolik:', error);
      } else if (data) {
        const formattedQuestions = data.map((q: any) => ({
          id: q.id,
          question: q.question,
          word: q.word,
          options: q.options,
          correctAnswer: q.correct_answer
        }));
        setQuestions(formattedQuestions);
      }
      setLoading(false);
    }

    fetchQuestions();
  }, [exerciseType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Sorawlar bazadan júklenbekte...</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold mb-4">Házirshe bul bólimde sorawlar joq</h2>
        <Button onClick={onComplete}>Artqa qaytıw</Button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setShowResult(true);

    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    } else {
      setIncorrectAnswers(prev => prev + 1);
    }

    setAnsweredQuestions(prev => [...prev, { word: currentQuestion.word, correct: isCorrect }]);

    const stats = JSON.parse(localStorage.getItem('exerciseStats') || '{"total": 0, "correct": 0, "incorrect": 0}');
    stats.total += 1;
    if (isCorrect) stats.correct += 1;
    else stats.incorrect += 1;
    localStorage.setItem('exerciseStats', JSON.stringify(stats));
  };

  // 🌟 NATIJALAR VA PREMIUM UCHUN TANGALARNI HISOBLASH
  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);

      const currentUserStr = localStorage.getItem('user');
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const accuracy = Math.round((correctAnswers / questions.length) * 100);
        
        // 1. Natijani bazaga yozish (Hamma uchun)
        await supabase.from('user_results').insert([{
          user_phone: currentUser.phone,
          exercise_type: exerciseType,
          total_questions: questions.length,
          correct_answers: correctAnswers,
          accuracy: accuracy
        }]);

        // 2. Tangalar (Coins) hisoblash (FAQAT PREMIUM UCHUN)
        if (currentUser.isPremium && correctAnswers > 0) {
          const earnedCoins = correctAnswers * 5; // Har bir to'g'ri javobga 5 coin! 🪙
          const newCoins = (currentUser.coins || 0) + earnedCoins;
          
          // Bazadagi coinnni yangilaymiz
          await supabase.from('users').update({ coins: newCoins }).eq('phone', currentUser.phone);
          
          // LocalStorage ni yangilaymiz
          currentUser.coins = newCoins;
          localStorage.setItem('user', JSON.stringify(currentUser));
        }
      }
    }
  };

  const handleTryAgain = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setCorrectAnswers(0);
    setIncorrectAnswers(0);
    setIsComplete(false);
    setAnsweredQuestions([]);
  };

  if (isComplete) {
    const accuracy = Math.round((correctAnswers / questions.length) * 100);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const potentialCoins = correctAnswers * 5; // Har bir to'g'ri javob 5 coin turadi

    return (
      <div className="min-h-screen bg-gray-50 pb-10">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Shınıǵıw</h1>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Nátiyje saqlandı!</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Shınıǵıw tamamlandı!</h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-2xl p-4 md:p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold text-green-600 mb-2">{correctAnswers}</p>
                <p className="text-sm text-gray-600">Durıs</p>
              </div>
              <div className="bg-red-50 rounded-2xl p-4 md:p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold text-red-600 mb-2">{incorrectAnswers}</p>
                <p className="text-sm text-gray-600">Qáte</p>
              </div>
              <div className="bg-indigo-50 rounded-2xl p-4 md:p-6 text-center">
                <p className="text-3xl md:text-4xl font-bold text-indigo-600 mb-2">{accuracy}%</p>
                <p className="text-sm text-gray-600">Durıslıq</p>
              </div>
            </div>

            {/* 🌟 COIN YIG'ISH BANNERI 🌟 */}
            {currentUser.isPremium ? (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-4 flex items-center justify-between text-white mb-8 shadow-md">
                <div className="flex items-center">
                  <Coins className="w-10 h-10 mr-3" />
                  <div>
                    <p className="font-bold text-lg md:text-xl">PRO Tarıyfı bonusı!</p>
                    <p className="text-yellow-100 text-sm font-medium">Toǵrı juwaplar ushın tangalar aldıńız</p>
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-black">+{potentialCoins}</div>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between text-white mb-8 shadow-md border border-gray-700">
                <div className="flex items-center">
                  <Lock className="w-8 h-8 mr-3 text-yellow-500" />
                  <div>
                    <p className="font-bold text-yellow-500 text-lg">+{potentialCoins} Coin joǵalttıńız!</p>
                    <p className="text-gray-400 text-xs md:text-sm font-medium">Coin jıynaw ushın PRO tarıyfın alıń</p>
                  </div>
                </div>
                <Crown className="w-8 h-8 text-gray-600 hidden md:block" />
              </div>
            )}

            <div className="space-y-3 mb-8">
              <Button onClick={handleTryAgain} className="w-full bg-indigo-600 hover:bg-indigo-700 h-14 rounded-xl text-lg font-bold">
                <RotateCcw className="w-5 h-5 mr-2" /> Qayta baslaw
              </Button>
              <Button onClick={onComplete} variant="outline" className="w-full h-14 rounded-xl font-bold border-2">
                Bas betke qaytıw
              </Button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h3 className="font-bold text-lg mb-4 text-gray-800">Qáteler ústinde islew:</h3>
              <div className="space-y-2">
                {answeredQuestions.map((item, index) => (
                  <div key={index} className={`flex items-center justify-between p-4 rounded-xl border ${item.correct ? 'bg-green-50/50 border-green-100' : 'bg-red-50/50 border-red-100'}`}>
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-gray-700">{item.word}</span>
                      <Volume2 className="w-5 h-5 text-gray-400 cursor-pointer hover:text-indigo-600 transition-colors" />
                    </div>
                    {item.correct ? <Check className="w-6 h-6 text-green-500" /> : <X className="w-6 h-6 text-red-500" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Chap tomon: Navigatsiya va Savollar ro'yxati (Katta ekranda) */}
      <div className="hidden md:flex w-80 bg-white shadow-lg flex-col z-10">
        <div className="p-4 border-b flex items-center space-x-4 bg-white">
          <Button variant="ghost" onClick={onComplete} className="p-2 text-gray-600 hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-bold text-gray-800">Shınıǵıw</h1>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-sm font-bold text-gray-500">Jámi: {questions.length}</span>
            <span className="text-sm font-bold text-indigo-600">{currentQuestionIndex + 1}-soraw</span>
          </div>
          <div className="grid grid-cols-5 gap-2 content-start">
            {questions.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all border-2
                  ${currentQuestionIndex === idx ? 'border-indigo-600 bg-indigo-50 text-indigo-700 scale-105' : 'bg-white text-gray-400 border-gray-100'}
                `}
              >
                {idx + 1}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Asosiy Qism */}
      <div className="flex-1 overflow-y-auto bg-gray-50/50">
        
        {/* Mobil Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10 md:hidden border-b border-gray-100">
          <div className="px-4 py-3 flex items-center space-x-3">
            <Button variant="ghost" onClick={onComplete} className="p-2 -ml-2 text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs font-bold text-gray-500 mt-1 text-right">{currentQuestionIndex + 1}/{questions.length}</p>
            </div>
          </div>
        </header>

        <div className="max-w-3xl mx-auto p-4 md:p-8">
          <div className="bg-white rounded-3xl shadow-sm p-6 md:p-10 border border-gray-200 mt-2 md:mt-8">
            
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center mb-6 leading-relaxed">
                {currentQuestion.question}
              </h2>
              <button className="mx-auto block text-indigo-500 hover:text-indigo-700 bg-indigo-50 p-3 rounded-full transition-colors">
                <Volume2 className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === index;
                const isCorrect = index === currentQuestion.correctAnswer;
                const showCorrect = showResult && isCorrect;
                const showIncorrect = showResult && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`
                      w-full p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between group
                      ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                      ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                      ${!showResult && isSelected ? 'border-indigo-600 bg-indigo-50 shadow-md transform scale-[1.01]' : ''}
                      ${!showResult && !isSelected ? 'border-gray-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50' : ''}
                      ${showResult ? 'cursor-default' : 'cursor-pointer'}
                    `}
                  >
                    <span className={`text-lg ${showCorrect || showIncorrect || isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>
                      {option}
                    </span>
                    <div className="flex items-center">
                      {!showResult && (
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-indigo-600' : 'border-gray-300'}`}>
                          {isSelected && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                        </div>
                      )}
                      {showCorrect && <Check className="w-7 h-7 text-green-600 bg-green-100 rounded-full p-1" />}
                      {showIncorrect && <X className="w-7 h-7 text-red-600 bg-red-100 rounded-full p-1" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {!showResult ? (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 rounded-2xl text-xl font-bold shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:shadow-none"
              >
                Juwap beriw
              </Button>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-4">
                <div className={`text-center p-5 rounded-2xl border ${
                  selectedAnswer === currentQuestion.correctAnswer 
                    ? 'bg-green-50 border-green-200 text-green-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
                }`}>
                  <p className="font-black text-2xl flex items-center justify-center">
                    {selectedAnswer === currentQuestion.correctAnswer ? <><Check className="w-8 h-8 mr-2"/> Kúshli! Durıs juwap</> : <><X className="w-8 h-8 mr-2"/> Qáte, ele úyrenemiz!</>}
                  </p>
                </div>
                <Button onClick={handleNext} className="w-full bg-indigo-600 hover:bg-indigo-700 h-16 rounded-2xl text-xl font-bold shadow-lg shadow-indigo-200 transition-all">
                  {currentQuestionIndex < questions.length - 1 ? 'Keyingi soraw' : 'Natiyjeni kóriw'}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
