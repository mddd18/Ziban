import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Target, History, Zap, Activity, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../supabase';

interface StatisticsProps {
  user: { streak: number; learnedWords: number; coins: number; phone: string };
  onBack: () => void;
}

export default function Statistics({ user, onBack }: StatisticsProps) {
  const [timeFilter, setTimeFilter] = useState<'kun' | 'hafta' | 'ay'>('hafta');
  const [mockHistory, setMockHistory] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const [displayStats, setDisplayStats] = useState({ testCount: 0, wordCount: 0, accuracy: 0 });

  useEffect(() => {
    const fetchRealData = async () => {
      try {
        const { data, error } = await supabase
          .from('mock_test_results')
          .select('*')
          .eq('user_phone', user.phone)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data) {
          setMockHistory(data);
          calculateStats(data, timeFilter);
          calculateWeeklyChart(data);
        }
      } catch (err) {
        console.error("Bazadan ma'lumot olishda xatolik:", err);
      }
    };
    fetchRealData();
  }, [user.phone, timeFilter]);

  // 📈 HAFTALIK GRAFIK UCHUN KUNLIK HISOBLASH
  const calculateWeeklyChart = (data: any[]) => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Dush-Yaksh
    const now = new Date();
    
    data.forEach(item => {
      const itemDate = new Date(item.created_at);
      const diffTime = Math.abs(now.getTime() - itemDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        // Haftaning kunini aniqlash (0-Yakshanba, 1-Dushanba...)
        let dayIndex = itemDate.getDay();
        // Dushanbani 0-index qilish uchun formatlash
        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1;
        counts[dayIndex] += item.total_questions;
      }
    });
    setWeeklyData(counts);
  };

  const calculateStats = (data: any[], filter: string) => {
    const now = new Date();
    const filtered = data.filter(item => {
      const itemDate = new Date(item.created_at);
      if (filter === 'kun') return itemDate.toDateString() === now.toDateString();
      if (filter === 'hafta') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        return itemDate >= weekAgo;
      }
      if (filter === 'ay') return itemDate.getMonth() === now.getMonth();
      return true;
    });

    setDisplayStats({
      testCount: filtered.length,
      wordCount: filtered.reduce((acc, curr) => acc + curr.total_questions, 0),
      accuracy: filtered.length > 0 
        ? Math.round((filtered.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0) / filtered.length) * 100)
        : 0
    });
  };

  const days = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'];
  const maxWords = Math.max(...weeklyData, 100); // Grafik balandligi uchun

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-20">
      <div className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md border border-white/30 active:scale-90">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Jetistikler</h2>
      </div>

      <main className="px-6 -mt-12 space-y-6">
        {/* 📑 TEPADAGI FILTR VA KARTALAR */}
        <div className="space-y-4">
          <div className="flex bg-white/50 backdrop-blur-md p-1.5 rounded-3xl border border-white shadow-sm">
            {(['kun', 'hafta', 'ay'] as const).map((f) => (
              <button key={f} onClick={() => setTimeFilter(f)} className={`flex-1 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all ${timeFilter === f ? 'bg-[#2EB8A6] text-white shadow-md' : 'text-[#8DA6A1]'}`}>
                {f}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-[28px] shadow-sm border-b-4 border-[#E8DFCC] text-center">
              <Activity className="w-5 h-5 mx-auto mb-1 text-[#2EB8A6]" />
              <p className="text-lg font-black text-[#2C4A44] leading-none">{displayStats.testCount}</p>
              <p className="text-[8px] font-black text-[#8DA6A1] uppercase mt-1">Testler</p>
            </div>
            <div className="bg-white p-4 rounded-[28px] shadow-sm border-b-4 border-[#E8DFCC] text-center">
              <Zap className="w-5 h-5 mx-auto mb-1 text-[#FF9500]" />
              <p className="text-lg font-black text-[#2C4A44] leading-none">{displayStats.wordCount}</p>
              <p className="text-[8px] font-black text-[#8DA6A1] uppercase mt-1">Sózler</p>
            </div>
            <div className="bg-white p-4 rounded-[28px] shadow-sm border-b-4 border-[#E8DFCC] text-center">
              <CheckCircle2 className="w-5 h-5 mx-auto mb-1 text-emerald-500" />
              <p className="text-lg font-black text-[#2C4A44] leading-none">{displayStats.accuracy}%</p>
              <p className="text-[8px] font-black text-[#8DA6A1] uppercase mt-1">Anıqlıq</p>
            </div>
          </div>
        </div>

        {/* 📈 HAFTALIK DINAMIK GRAFIK (BAZADAN) */}
        <div className="bg-white rounded-[40px] p-6 shadow-lg border-b-[6px] border-[#E8DFCC] space-y-4">
          <h3 className="font-black text-[#2C4A44] text-xs uppercase flex items-center ml-2">
            <TrendingUp className="w-4 h-4 mr-2 text-[#2EB8A6]" /> Haftalıq úyrenilgen sózler
          </h3>
          
          <div className="h-44 flex items-end justify-between px-2 pb-2">
            {weeklyData.map((val, i) => (
              <div key={i} className="flex flex-col items-center w-full group">
                <div className="relative mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2C4A44] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                  {val}
                </div>
                <div className="w-5 bg-[#E6F4F1] rounded-full h-32 relative overflow-hidden flex items-end">
                  <div 
                    className="w-full bg-[#2EB8A6] rounded-full transition-all duration-1000 group-hover:bg-[#FF9500]" 
                    style={{ height: `${(val / maxWords) * 100}%` }}
                  ></div>
                </div>
                <span className="mt-2 text-[9px] font-black text-[#8DA6A1] uppercase">{days[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 📜 SOŃǴI NÁTIYJELER */}
        <div className="space-y-4 pb-10">
          <h3 className="font-black text-[#2C4A44] text-lg uppercase tracking-tight flex items-center ml-2">
            <History className="w-5 h-5 mr-3 text-[#2EB8A6]" /> Sońǵı nátiyjeler
          </h3>
          {mockHistory.slice(0, 5).map((test, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm p-5 rounded-[30px] border border-white flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <div className="w-11 h-11 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mr-4">
                  <Target className="w-5 h-5 text-[#2EB8A6]" />
                </div>
                <div>
                  <h4 className="font-black text-[#2C4A44] text-sm leading-none mb-1">
                    {Math.round((test.score / test.total_questions) * 100)}% Anıqlıq
                  </h4>
                  <p className="text-[10px] font-bold text-[#8DA6A1]">{new Date(test.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right font-black text-[#2C4A44]">
                <span className="text-[#2EB8A6]">{test.score}</span>/{test.total_questions}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
