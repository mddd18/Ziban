import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Check, X, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';

interface StatisticsProps {
  onBack: () => void;
}

type TimePeriod = '7days' | '30days' | '90days' | '1year' | 'all';

export default function Statistics({ onBack }: StatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('7days');
  const [stats, setStats] = useState({ total: 0, correct: 0, incorrect: 0 });

  useEffect(() => {
    const savedStats = localStorage.getItem('exerciseStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  const periods = [
    { id: '7days' as TimePeriod, label: '7 Kún' },
    { id: '30days' as TimePeriod, label: '30 Kún' },
    { id: '90days' as TimePeriod, label: '90 Kún' },
    { id: '1year' as TimePeriod, label: '1 Jıl' },
    { id: 'all' as TimePeriod, label: 'Hámmesi' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Statistika</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Time Period Selector */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="font-bold text-lg mb-4">Waqıt dawrı</h2>
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all
                  ${selectedPeriod === period.id
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* Total Questions */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-600 mb-2">Jámi sorawlar</h3>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-500 mt-1">Hámmesi: {stats.total}</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Target className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Correct Answers */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-600 mb-2">Durıs juwaplar</h3>
              <p className="text-4xl font-bold text-green-600">{stats.correct}</p>
              <p className="text-sm text-gray-500 mt-1">Hámmesi: {stats.correct}</p>
            </div>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-8 h-8 text-green-600" />
            </div>
          </div>
        </div>

        {/* Incorrect Answers */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-600 mb-2">Qáte juwaplar</h3>
              <p className="text-4xl font-bold text-red-600">{stats.incorrect}</p>
              <p className="text-sm text-gray-500 mt-1">Hámmesi: {stats.incorrect}</p>
              {stats.incorrect > 0 && (
                <button className="text-sm text-red-500 mt-2 hover:text-red-600">
                  Tapsırmalar ústinde islaw →
                </button>
              )}
            </div>
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <X className="w-8 h-8 text-red-600" />
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-600 mb-2">Durıslıq</h3>
              <p className="text-4xl font-bold text-indigo-600">{accuracy}%</p>
              <p className="text-sm text-gray-500 mt-1">Hámmesi waqıt: {accuracy}%</p>
            </div>
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Daily Performance */}
        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex border-b mb-6">
            <button className="px-4 py-2 text-gray-600 border-b-2 border-transparent hover:text-gray-900">
              Durıslıq diagramması
            </button>
            <button className="px-4 py-2 text-indigo-600 border-b-2 border-indigo-600 font-medium">
              Kúnlik islenisi
            </button>
          </div>

          <h3 className="font-bold text-lg mb-4">Kúnlik nátiyje</h3>
          
          {stats.total > 0 ? (
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Bul kún</p>
                  <div className="flex items-center space-x-4">
                    <div>
                      <span className="text-green-600 font-bold">✓ {stats.correct}</span>
                      <span className="text-sm text-gray-600 ml-1">durıs</span>
                    </div>
                    <div>
                      <span className="text-red-600 font-bold">✗ {stats.incorrect}</span>
                      <span className="text-sm text-gray-600 ml-1">qáte</span>
                    </div>
                    <div>
                      <span className="text-gray-600 font-bold">Jámi: {stats.total}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-green-600 mb-1">{accuracy}%</div>
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all"
                      style={{ width: `${accuracy}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Endi hesh qanday málimet joq</p>
              <p className="text-sm mt-2">Shınıǵıwlardı orinlań hám nátiyjeleriń bu jerde kórinedi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
