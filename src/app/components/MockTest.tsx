import { useState, useEffect } from 'react';
import { ArrowLeft, Trophy, Coins, Check, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface MockTestProps {
  onBack: () => void;
  userPhone: string;
  onUpdateCoins: (newCoins: number) => void;
}

// Mock test questions
const mockTestQuestions: Question[] = [
  {
    id: 1,
    question: '"Qaraqalpaq" sóziniń mánisi nede?',
    options: ['Qara qalpaq', 'Халық аты', 'Tilde ataw', 'Jerdiń atı'],
    correctAnswer: 1
  },
  {
    id: 2,
    question: 'Qaraqalpaq tili qaysı til toparına kiredi?',
    options: ['Slavyan', 'Túrkiy', 'German', 'Roman'],
    correctAnswer: 1
  },
  {
    id: 3,
    question: '"Ilim" sóziniń mánisi?',
    options: ['Bilim', 'Jumıs', 'Kitap', 'Mektep'],
    correctAnswer: 0
  },
  {
    id: 4,
    question: 'Qaraqalpaqstan paytaxtı?',
    options: ['Tashkent', 'Nukus', 'Xiva', 'Urganch'],
    correctAnswer: 1
  },
  {
    id: 5,
    question: '"Tákirarlaw" sóziniń mánisi?',
    options: ['Jazıw', 'Qayta qaytariw', 'Oqıw', 'Ángimeleşiw'],
    correctAnswer: 1
  }
];

export default function MockTest({ onBack, userPhone, onUpdateCoins }: MockTestProps) {
  const [canTakeTest, setCanTakeTest] = useState(true);
  const [lastTestDate, setLastTestDate] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [earnedCoins, setEarnedCoins] = useState(0);

  useEffect(() => {
    const lastTest = localStorage.getItem(`mockTest_${userPhone}`);
    if (lastTest) {
      const testData = JSON.parse(lastTest);
      const lastDate = new Date(testData.date);
      const today = new Date();
      const diffTime = Math.abs(today.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 30) {
        setCanTakeTest(false);
        setLastTestDate(testData.date);
      }
    }
  }, [userPhone]);

  const currentQuestion = mockTestQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mockTestQuestions.length) * 100;

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
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < mockTestQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      completeTest();
    }
  };

  const completeTest = () => {
    const accuracy = Math.round((correctAnswers / mockTestQuestions.length) * 100);
    let coins = 0;

    // Award coins based on score
    if (accuracy >= 80) {
      coins = 100; // 80%+ gets 100 coins
    } else if (accuracy >= 60) {
      coins = 50; // 60-79% gets 50 coins
    } else if (accuracy >= 40) {
      coins = 25; // 40-59% gets 25 coins
    }

    setEarnedCoins(coins);

    // Save test date
    localStorage.setItem(`mockTest_${userPhone}`, JSON.stringify({
      date: new Date().toISOString(),
      score: accuracy,
      coins: coins
    }));

    // Update user coins
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      onUpdateCoins((user.coins || 0) + coins);
    }

    setIsComplete(true);
  };

  const handleStartTest = () => {
    setTestStarted(true);
  };

  if (!canTakeTest && !testStarted) {
    const daysUntilNext = lastTestDate ? 30 - Math.ceil(Math.abs(new Date().getTime() - new Date(lastTestDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-bold">Mock Test</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Clock className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Test waqtı endi jete joq
            </h2>
            <p className="text-gray-600 mb-8">
              Mock test aynıǵa 1 ret qabıl etiledi. Kelesi test ushın {daysUntilNext} kún kútiń.
            </p>
            <div className="bg-indigo-50 rounded-xl p-6 mb-6">
              <p className="text-indigo-900 font-medium">
                Soñǵı testińiz: {lastTestDate ? new Date(lastTestDate).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <Button onClick={onBack} className="bg-indigo-600 hover:bg-indigo-700">
              Bas betke qaytıw
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const accuracy = Math.round((correctAnswers / mockTestQuestions.length) * 100);

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <h1 className="text-xl font-bold text-center">Mock Test Nátiyje</h1>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Tabıslarımız menen!
              </h2>
              <p className="text-gray-600">Mock test tamamlandı</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">{correctAnswers}/{mockTestQuestions.length}</p>
                <p className="text-sm text-gray-600">Durıs juwaplar</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">{accuracy}%</p>
                <p className="text-sm text-gray-600">Durıslıq</p>
              </div>
            </div>

            {earnedCoins > 0 && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-8">
                <div className="flex items-center justify-center space-x-3 text-white">
                  <Coins className="w-8 h-8" />
                  <div>
                    <p className="text-3xl font-bold">+{earnedCoins} Coin</p>
                    <p className="text-sm opacity-90">Sizge berildi!</p>
                  </div>
                  <Check className="w-8 h-8" />
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">80%+ </span>
                  <span className="font-bold text-yellow-600">100 Coins</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">60-79%</span>
                  <span className="font-bold text-yellow-600">50 Coins</span>
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">40-59%</span>
                  <span className="font-bold text-yellow-600">25 Coins</span>
                </div>
              </div>
            </div>

            <Button onClick={onBack} className="w-full mt-8 bg-indigo-600 hover:bg-indigo-700 h-12">
              Bas betke qaytıw
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!testStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-bold">Mock Test</h1>
            </div>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Mock Test
              </h2>
              <p className="text-gray-600">
                Aynıǵa 1 ret qabıl etiledi
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="bg-indigo-50 rounded-xl p-4 flex items-start space-x-3">
                <Check className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Jámi {mockTestQuestions.length} soraw</p>
                  <p className="text-sm text-gray-600">Hárbir sorawǵa juwap beriń</p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-xl p-4 flex items-start space-x-3">
                <Coins className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Coinlar tabıw</p>
                  <p className="text-sm text-gray-600">Joqarı ball — kóp coin!</p>
                </div>
              </div>

              <div className="bg-red-50 rounded-xl p-4 flex items-start space-x-3">
                <Clock className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">Aynıǵa 1 ret</p>
                  <p className="text-sm text-gray-600">30 kún ishinde qayta test aldırıw múmkin emes</p>
                </div>
              </div>
            </div>

            <Button onClick={handleStartTest} className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 h-12">
              Testi baslaw
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-center">
            Soraw {currentQuestionIndex + 1}/{mockTestQuestions.length}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-600">Jılıw</span>
              <span className="text-sm font-medium text-gray-900">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
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
                    w-full p-4 rounded-xl border-2 text-left transition-all
                    ${showCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${showIncorrect ? 'border-red-500 bg-red-50' : ''}
                    ${!showResult && isSelected ? 'border-indigo-500 bg-indigo-50' : ''}
                    ${!showResult && !isSelected ? 'border-gray-200 hover:border-indigo-300' : ''}
                    ${showResult ? 'cursor-default' : 'cursor-pointer'}
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className={`${showCorrect || showIncorrect ? 'font-medium' : ''}`}>
                      {option}
                    </span>
                    {showCorrect && <Check className="w-5 h-5 text-green-600" />}
                    {showIncorrect && <Check className="w-5 h-5 text-red-600 rotate-45" />}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Button */}
          {!showResult ? (
            <Button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
            >
              Juwap beriw
            </Button>
          ) : (
            <Button onClick={handleNext} className="w-full bg-indigo-600 hover:bg-indigo-700 h-12">
              {currentQuestionIndex < mockTestQuestions.length - 1 ? 'Keyingi' : 'Tamamlaw'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
