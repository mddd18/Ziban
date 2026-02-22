import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Calendar, Target, Award, History, Zap, Star, BarChart3 } from 'lucide-react';
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

  const chartData = {
    kun: [40, 60, 80, 20, 90, 50, 70],
    hafta: [120, 300, 450, 200, 600, 400, 500],
    ay: [1500, 2000, 1800, 2500],
    yil: [12000, 15000, 18000, 22000, 19000, 25000]
  };

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-16 flex flex-col">
      {/* 🟢 HEADER SECTION */}
      <div className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 transition-all border border-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Jetistikler</h2>
      </div>

      <main className="px-6 -mt-10 space-y-8 relative z-10">
        
        {/* 🔢 ASOSIY RAQAMLAR (Kengaytirilgan) */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-[35px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
            <div className="w-12 h-12 bg-[#FFF4E5] rounded-2xl flex items-center justify-center mb-3">
              <Zap className="w-7 h-7 text-[#FF9500]" />
            </div>
            <span className="text-3xl font-black text-[#2C4A44] leading-none">{user.streak}</span>
            <span className="text-[11px] font-black text-[#8DA6A1] uppercase mt-2">Kúnlik Streak</span>
          </div>

          <div className="bg-white p-6 rounded-[35px] shadow-[0_10px_25px_rgba(0,0,0,0.05)] border-b-[6px] border-[#E8DFCC] flex flex-col items-center">
            <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mb-3">
              <Award className="w-7 h-7 text-[#2EB8A6]" />
            </div>
            <span className="text-3xl font-black text-[#2C4A44] leading-none">{user.learnedWords}</span>
            <span className="text-[11px] font-black text-[#8DA6A1] uppercase mt-2">Sózler yodlandı</span>
          </div>
        </div>

        {/* 📅 HAFTALIK GRAFIK BO'LIMI */}
        <div className="bg-white rounded-[40px] p-8 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-b-[6px] border-[#E8DFCC] space-y-8">
          <div className="flex justify-between items-center bg-[#F5EEDC]/60 p-1.5 rounded-[22px]">
            {(['kun', 'hafta', 'ay', 'yil'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all tracking-wider ${
                  timeFilter === f ? 'bg-white text-[#2EB8A6] shadow-md' : 'text-[#8DA6A1]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-end h-40 px-4">
            {chartData[timeFilter].map((val, idx) => (
              <div key={idx} className="flex flex-col items-center flex-1 group">
                <div className="w-3.5 bg-[#F5EEDC] rounded-full relative overflow-hidden flex items-end" style={{ height: '120px' }}>
                  <div 
                    className="w-full bg-[#2EB8A6] rounded-full transition-all duration-1000 group-hover:bg-[#FF9500]"
                    style={{ height: `${(val / Math.max(...chartData[timeFilter])) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-[11px] font-bold text-[#8DA6A1] uppercase flex items-center justify-center">
             <BarChart3 className="w-4 h-4 mr-2" /> {timeFilter}lıq belsendilik kórsetkishi
          </p>
        </div>

        {/* 🏆 MOCK TEST TARIYXI (Ochiqroq dizayn) */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-2">
            <h3 className="font-black text-[#2C4A44] text-xl uppercase tracking-tight flex items-center">
              <History className="w-6 h-6 mr-3 text-[#2EB8A6]" /> Mock Testler
            </h3>
          </div>
          
          <div className="space-y-4">
            {mockHistory.length > 0 ? (
              mockHistory.map((test, idx) => (
                <div key={idx} className="bg-white/70 backdrop-blur-sm p-6 rounded-[35px] border border-white flex items-center justify-between shadow-sm">
                  <div className="flex items-center">
                    <div className="w-14 h-14 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mr-5 shadow-inner">
                      <Target className="w-7 h-7 text-[#2EB8A6]" />
                    </div>
                    <div>
                      <h4 className="font-black text-[#2C4A44] text-md uppercase">Nátije: {Math.round((test.score / test.total_questions) * 100)}%</h4>
                      <p className="text-[11px] font-bold text-[#8DA6A1] mt-1 italic">
                        {new Date(test.created_at).toLocaleDateString('uz-UZ', { day: 'numeric', month: 'long' })}
                      </p>
                    </div>
                  </div>
                  <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-gray-50 text-center">
                    <p className="font-black text-xl text-[#2EB8A6] leading-none">{test.score}</p>
                    <p className="text-[9px] font-black text-[#8DA6A1] uppercase mt-1">Ball</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/40 border-4 border-dashed border-white rounded-[40px] p-12 text-center">
                <Star className="w-10 h-10 text-[#E8DFCC] mx-auto mb-3" />
                <p className="text-[#8DA6A1] font-black uppercase text-xs tracking-widest">Házirshe test tapsırılmadı</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[#8DA6A1]/40 text-[10px] font-black uppercase tracking-[0.4em] py-8">
          Ziyban Analytics v1.0
        </p>
      </main>
    </div>
  );
}
