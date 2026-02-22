import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Calendar, Target, Award, Clock, History } from 'lucide-react';
import { supabase } from '../supabase';

interface StatisticsProps {
  user: { streak: number; learnedWords: number; coins: number; phone: string };
  onBack: () => void;
}

export default function Statistics({ user, onBack }: StatisticsProps) {
  const [timeFilter, setTimeFilter] = useState<'kun' | 'hafta' | 'ay' | 'yil'>('hafta');
  const [mockHistory, setMockHistory] = useState<any[]>([]);

  // Mock Test natijalarini bazadan olish
  useEffect(() => {
    const fetchMockResults = async () => {
      const { data } = await supabase
        .from('mock_test_results')
        .select('*')
        .eq('user_phone', user.phone)
        .order('created_at', { ascending: false });
      if (data) setMockHistory(data);
    };
    fetchMockResults();
  }, [user.phone]);

  // Namunaviy grafik ma'lumotlari (Filterga qarab o'zgarishi mumkin)
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
        
        {/* TIME FILTER (KUN/HAFTA/AY/YIL) */}
        <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-3xl border border-white flex justify-between shadow-sm">
          {['kun', 'hafta', 'ay', 'yil'].map((f) => (
            <button
              key={f}
              onClick={() => setTimeFilter(f as any)}
              className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${
                timeFilter === f ? 'bg-[#2EB8A6] text-white shadow-md' : 'text-[#8DA6A1]'
              }`}
            >
              {f === 'kun' ? 'Kúnlik' : f === 'hafta' ? 'Haftalıq' : f === 'ay' ? 'Aylıq' : 'Jıllıq'}
            </button>
          ))}
        </div>

        {/* GRAFIK QISMI */}
        <div className="bg-white rounded-[35px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-black text-[#2C4A44] text-xs uppercase flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-[#2EB8A6]" /> Úyreniw belsendiligi
            </h3>
          </div>
          <div className="flex justify-between items-end h-36 px-2">
            {(chartData[timeFilter] as number[]).map((val, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <div 
                  className="w-3 bg-[#E6F4F1] rounded-full relative overflow-hidden flex items-end mx-1"
                  style={{ height: '110px' }}
                >
                  <div 
                    className="w-full bg-[#2EB8A6] rounded-full transition-all duration-700"
                    style={{ height: `${(val / Math.max(...chartData[timeFilter])) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* MOCK TEST NATIJALARI */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[#2C4A44] text-lg uppercase tracking-tight flex items-center">
              <History className="w-5 h-5 mr-2 text-[#2EB8A6]" /> Mock Test Tariyxı
            </h3>
            <span className="bg-[#2EB8A6]/10 text-[#2EB8A6] px-3 py-1 rounded-full text-[10px] font-black uppercase">
              Jami: {mockHistory.length}
            </span>
          </div>

          {mockHistory.length > 0 ? (
            mockHistory.map((test, idx) => (
              <div key={idx} className="bg-white rounded-[30px] p-5 shadow-sm border-b-[4px] border-[#E8DFCC] flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mr-4">
                    <Target className="w-6 h-6 text-[#2EB8A6]" />
                  </div>
                  <div>
                    <h4 className="font-black text-[#2C4A44] text-sm uppercase">Nátije: {Math.round((test.score / test.total_questions) * 100)}%</h4>
                    <p className="text-[10px] font-bold text-[#8DA6A1]">{new Date(test.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-[#2EB8A6]">{test.score}/{test.total_questions}</p>
                  <p className="text-[9px] font-black text-[#8DA6A1] uppercase">Ball</p>
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
