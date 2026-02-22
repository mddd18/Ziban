import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Calendar, Target, Award, Clock, History, Star, Zap } from 'lucide-react';
import { supabase } from '../../supabase';

interface StatisticsProps {
  user: { streak: number; learnedWords: number; coins: number; phone: string };
  onBack: () => void;
}

export default function Statistics({ user, onBack }: StatisticsProps) {
  const [timeFilter, setTimeFilter] = useState<'kun' | 'hafta' | 'ay' | 'yil'>('hafta');
  const [mockHistory, setMockHistory] = useState<any[]>([]);

  useEffect(() => {
    const fetchMockResults = async () => {
      try {
        const { data, error } = await supabase
          .from('mock_test_results')
          .select('*')
          .eq('user_phone', user.phone)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) setMockHistory(data);
      } catch (err) {
        console.error("Xatolik natijalarni olishda:", err);
      }
    };
    fetchMockResults();
  }, [user.phone]);

  // Grafik uchun raqamlar
  const chartData = {
    kun: [40, 60, 80, 20, 90, 50, 70],
    hafta: [120, 300, 450, 200, 600, 400, 500],
    ay: [1500, 2000, 1800, 2500],
    yil: [12000, 15000, 18000, 22000, 19000, 25000]
  };

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10">
      {/* HEADER */}
      <div className="bg-[#2EB8A6] pt-12 pb-14 px-6 rounded-b-[50px] shadow-lg relative">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 border border-white/30">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-center text-white font-black text-xl uppercase tracking-widest pt-2">Jetistikler</h2>
      </div>

      <main className="px-6 -mt-8 space-y-6">
        
        {/* 🔢 ASOSIY RAQAMLI KO'RSATKICHLAR */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[30px] shadow-sm border-b-[6px] border-[#E8DFCC] flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#FFF4E5] rounded-2xl flex items-center justify-center shrink-0">
              <Zap className="w-6 h-6 text-[#FF9500]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#2C4A44] leading-none">{user.streak}</p>
              <p className="text-[10px] font-bold text-[#8DA6A1] uppercase">Streak</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-[30px] shadow-sm border-b-[6px] border-[#E8DFCC] flex items-center space-x-4">
            <div className="w-10 h-10 bg-[#E6F4F1] rounded-2xl flex items-center justify-center shrink-0">
              <Award className="w-6 h-6 text-[#2EB8A6]" />
            </div>
            <div>
              <p className="text-2xl font-black text-[#2C4A44] leading-none">{user.learnedWords}</p>
              <p className="text-[10px] font-bold text-[#8DA6A1] uppercase">Sózler</p>
            </div>
          </div>
        </div>

        {/* 📅 HAFTALIK GRAFIK VA FILTRLAR */}
        <div className="bg-white rounded-[35px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC] space-y-6">
          <div className="flex justify-between items-center bg-[#F5EEDC]/50 p-1 rounded-2xl">
            {(['kun', 'hafta', 'ay', 'yil'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`flex-1 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${
                  timeFilter === f ? 'bg-white text-[#2EB8A6] shadow-sm' : 'text-[#8DA6A1]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-end h-36 px-2">
            {chartData[timeFilter].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <div className="w-3 bg-[#E6F4F1] rounded-full relative overflow-hidden flex items-end mx-1" style={{ height: '110px' }}>
                  <div 
                    className="w-full bg-[#2EB8A6] rounded-full transition-all duration-700"
                    style={{ height: `${(val / Math.max(...chartData[timeFilter])) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 MOCK TEST STATISTIKASI (RAQAMLARDA) */}
        <div className="space-y-4">
          <h3 className="font-black text-[#2C4A44] text-lg uppercase tracking-tight flex items-center ml-2">
            <History className="w-5 h-5 mr-2 text-[#2EB8A6]" /> Mock Test Tariyxı
          </h3>
          
          {mockHistory.length > 0 ? (
            mockHistory.map((test, idx) => (
              <div key={idx} className="bg-white rounded-[30px] p-5 shadow-sm border-b-[4px] border-[#E8DFCC] flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-[#2EB8A6]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#2C4A44] text-sm uppercase">
                      Nátije: {Math.round((test.score / test.total_questions) * 100)}%
                    </h4>
                    <p className="text-[10px] font-bold text-[#8DA6A1]">
                      {new Date(test.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="bg-[#E6F4F1] px-4 py-2 rounded-2xl">
                  <span className="font-black text-lg text-[#2EB8A6]">{test.score}</span>
                  <span className="text-[#2EB8A6]/60 font-bold">/{test.total_questions}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white/50 border-2 border-dashed border-[#E8DFCC] rounded-[30px] p-10 text-center text-[#8DA6A1] font-bold">
              Házirshe Mock Test tapsırılmadı
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
