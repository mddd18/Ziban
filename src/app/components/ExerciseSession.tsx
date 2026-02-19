import { useState, useEffect } from 'react';
import { ArrowLeft, Volume2, Check, X, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { ExerciseType } from '../App';

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

// Mock questions data
const mockQuestions: Record<ExerciseType, Question[]> = {
  definition: [
    {
      id: 1,
      question: 'What is the definition of "Pipeline"?',
      word: 'Pipeline',
      options: [
        'It sohasıda ketma ketlik 1 ish yakunlap keyingi ish boshlanishi',
        'Potensial kelishuv'
      ],
      correctAnswer: 0
    },
    {
      id: 2,
      question: 'What is the definition of "Opportunity"?',
      word: 'Opportunity',
      options: [
        'It sohasıda ketma ketlik 1 ish yakunlap keyingi ish boshlanishi',
        'Potensial kelishuv'
      ],
      correctAnswer: 1
    }
  ],
  translation: [
    {
      id: 1,
      question: '"Jumıs" sóziniń ingliz tilindegi mánisi?',
      word: 'Jumıs',
      options: ['Work', 'Rest', 'Play', 'Study'],
      correctAnswer: 0
    },
    {
      id: 2,
      question: '"Bilim" sóziniń ingliz tilindegi mánisi?',
      word: 'Bilim',
      options: ['Power', 'Money', 'Knowledge', 'Time'],
      correctAnswer: 2
    }
  ],
  terms: []
};

export default function ExerciseSession({ exerciseType, onComplete }: ExerciseSessionProps) {
  const [questions] = useState<Question[]>(mockQuestions[exerciseType] || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<{word: string; correct: boolean}[]>([]);

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

    // Save to localStorage
    const stats = JSON.parse(localStorage.getItem('exerciseStats') || '{"total": 0, "correct": 0, "incorrect": 0}');
    stats.total += 1;
    if (isCorrect) {
      stats.correct += 1;
    } else {
      stats.incorrect += 1;
    }
    localStorage.setItem('exerciseStats', JSON.stringify(stats));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
    } else {
      setIsComplete(true);
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

    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold">Exercise</h1>
              <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span className="text-sm font-medium">Nátiyje saqlandı!</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Shınıǵıw tamamlandı!
              </h2>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-green-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-green-600 mb-2">{correctAnswers}</p>
                <p className="text-sm text-gray-600">Durıs</p>
              </div>
              <div className="bg-red-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-red-600 mb-2">{incorrectAnswers}</p>
                <p className="text-sm text-gray-600">Qáte</p>
              </div>
              <div className="bg-indigo-50 rounded-xl p-6 text-center">
                <p className="text-4xl font-bold text-indigo-600 mb-2">{accuracy}%</p>
                <p className="text-sm text-gray-600">Durıslıq</p>
              </div>
            </div>

            <div className="space-y-3 mb-8">
              <Button
                onClick={handleTryAgain}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Qayta baslash
              </Button>
              <Button
                onClick={onComplete}
                variant="outline"
                className="w-full h-12"
              >
                Basqa shınıǵıwdı tańlash
              </Button>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-bold text-lg mb-4">Qayta kóriw:</h3>
              <div className="space-y-2">
                {answeredQuestions.map((item, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 rounded-lg ${
                      item.correct ? 'bg-green-50' : 'bg-red-50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{item.word}</span>
                      <Volume2 className="w-4 h-4 text-gray-400 cursor-pointer hover:text-gray-600" />
                    </div>
                    {item.correct ? (
                      <Check className="w-5 h-5 text-green-600" />
                    ) : (
                      <X className="w-5 h-5 text-red-600" />
                    )}
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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onComplete}
              className="p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">
              Shınıǵıw {currentQuestionIndex + 1}/{questions.length}
            </h1>
          </div>
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
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
              {currentQuestion.question}
            </h2>
            <button className="mx-auto block text-indigo-600 hover:text-indigo-700">
              <Volume2 className="w-6 h-6" />
            </button>
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
                    {showIncorrect && <X className="w-5 h-5 text-red-600" />}
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
            <div className="space-y-4">
              <div className={`text-center p-4 rounded-xl ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                <p className="font-bold text-lg">
                  {selectedAnswer === currentQuestion.correctAnswer ? 'Durıs!' : 'Qáte!'}
                </p>
              </div>
              <Button
                onClick={handleNext}
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12"
              >
                {currentQuestionIndex < questions.length - 1 ? 'Keyingi' : 'Tamamlaw'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
