import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Check, X, BarChart3, Award, Loader2, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

interface StatisticsProps {
  onBack: () => void;
}

type TimePeriod = '7days' | '30days' | '90days' | '1year' | 'all';

interface StatResult {
  id: number;
  exercise_type: string;
  total_questions: number;
  correct_answers: number;
  accuracy: number;
  created_at: string;
}

export default function Statistics({ onBack }: StatisticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<TimePeriod>('all');
  const [loading, setLoading] = useState(true);
  
  // Ma'lumotlar
  const [results, setResults] = useState<StatResult[]>([]);
  const [stats, setStats] = useState({ total: 0, correct: 0, incorrect: 0 });
  const [mockTests, setMockTests] = useState<StatResult[]>([]); // Milliy sertifikat natijalari

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const userPhone = localStorage.getItem('userPhone');
      
      if (userPhone) {
        // 1. Bazadan hamma natijalarni olish
        const { data, error } = await supabase
          .from('user_results')
          .select('*')
          .eq('user_phone', userPhone)
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Statistika yuklashda xato:", error);
        } else if (data) {
          setResults(data);
          
          // 2. Mock Testlarni alohida ajratib olish
          const mocks = data.filter(item => item.exercise_type === 'mock_test');
          setMockTests(mocks);

          // 3. Umumiy hisob-kitoblar (Faqat oddiy mashqlar uchun)
          let t = 0, c = 0, inc = 0;
          data.forEach(item => {
            if (item.exercise_type !== 'mock_test') {
              t += item.total_questions;
              c += item.correct_answers;
              inc += (item.total_questions - item.correct_answers);
            }
          });
          setStats({ total: t, correct: c, incorrect: inc });
        }
      }
      setLoading(false);
    }
    fetchStats();
  }, [selectedPeriod]); // Kelajakda period bo'yicha filter qilish mumkin

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;

  // Rash modeli bo'yicha darajani aniqlash
  const getLevel = (percent: number) => {
    if (percent >= 86) return { level: 'A+', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (percent >= 71) return { level: 'A', color: 'text-blue-500', bg: 'bg-blue-50' };
    if (percent >= 61) return { level: 'B+', color: 'text-green-600', bg: 'bg-green-100' };
    if (percent >= 56) return { level: 'B', color: 'text-green-500', bg: 'bg-green-50' };
    if (percent >= 50) return { level: 'C+', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    if (percent >= 46) return { level: 'C', color: 'text-yellow-500', bg: 'bg-yellow-50' };
    return { level: 'Dárejesiz', color: 'text-red-600', bg: 'bg-red-50' };
  };

  const periods = [
    { id: '7days' as TimePeriod, label: '7 Kún' },
    { id: '30days' as TimePeriod, label: '30 Kún' },
    { id: '90days' as TimePeriod, label: '90 Kún' },
    { id: '1year' as TimePeriod, label: '1 Jıl' },
    { id: 'all' as TimePeriod, label: 'Hámmesi' },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader2 className="animate-spin text-indigo-600 w-12 h-12" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold text-gray-800">Meniń Statistikam</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* 🌟 1. MILLIY SERTIFIKAT (MOCK TEST) NATIJALARI 🌟 */}
        {mockTests.length > 0 && (
          <div className="mb-8">
            <h2 className="font-bold text-xl mb-4 text-indigo-900 flex items-center">
              <Award className="mr-2 w-6 h-6 text-indigo-600" /> Milliy Sertifikat Nátiyjeleri
            </h2>
            <div className="space-y-4">
              {mockTests.map((item) => {
                const resLevel = getLevel(item.accuracy);
                return (
                  <div key={item.id} className="bg-white rounded-2xl p-6 shadow-md border-l-4 border-indigo-500 flex flex-col md:flex-row items-start md:items-center justify-between">
                    <div className="mb-4 md:mb-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-3 py-1 rounded-full uppercase">
                          Rásmiy Imtixan
                        </span>
                        <span className="text-sm text-gray-500 flex items-center font-medium">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(item.created_at).toLocaleString('uz-UZ', { day: '2-digit', month: 'short', hour: '2-digit', minute:'2-digit' })}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800">
                        Durıs: {item.correct_answers} / {item.total_questions}
                      </h3>
                    </div>

                    <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-xl">
                      <div className="text-center px-4 border-r border-gray-200">
                        <p className="text-sm text-gray-500 font-medium uppercase">Ózlestiriw</p>
                        <p className="text-2xl font-black text-indigo-600">{item.accuracy}%</p>
                      </div>
                      <div className={`text-center px-4 rounded-lg ${resLevel.bg} ${resLevel.color}`}>
                        <p className="text-sm font-semibold uppercase opacity-80">Dáreje</p>
                        <p className="text-3xl font-black">{resLevel.level}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- TIME PERIOD SELECTOR --- */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-4 text-gray-700">Ápiwayı shınıǵıwlar dáwiri</h2>
          <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
              <button
                key={period.id}
                onClick={() => setSelectedPeriod(period.id)}
                className={`
                  px-6 py-3 rounded-xl font-medium transition-all
                  ${selectedPeriod === period.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
                `}
              >
                {period.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- STAT CARDLAR --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Questions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-600 mb-2">Jámi sorawlar</h3>
                <p className="text-4xl font-black text-gray-800">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Accuracy */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-600 mb-2">Ulıwma Durıslıq</h3>
                <p className="text-4xl font-black text-indigo-600">{accuracy}%</p>
              </div>
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-indigo-500" />
              </div>
            </div>
          </div>

          {/* Correct Answers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-600 mb-2">Durıs juwaplar</h3>
                <p className="text-4xl font-black text-green-500">{stats.correct}</p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          {/* Incorrect Answers */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-lg text-gray-600 mb-2">Qáte juwaplar</h3>
                <p className="text-4xl font-black text-red-500">{stats.incorrect}</p>
                {stats.incorrect > 0 && (
                  <button className="text-sm text-red-400 mt-2 hover:text-red-600 font-medium">
                    Tapsırmalar ústinde islew →
                  </button>
                )}
              </div>
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center">
                <X className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
