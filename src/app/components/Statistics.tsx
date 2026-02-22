import { useState, useEffect } from 'react';
import { ChevronLeft, TrendingUp, Target, Award, History, Zap, BarChart3, PieChart, Activity } from 'lucide-react';
import { supabase } from '../../supabase';

interface StatisticsProps {
  user: { streak: number; learnedWords: number; coins: number; phone: string };
  onBack: () => void;
}

export default function Statistics({ user, onBack }: StatisticsProps) {
  const [timeFilter, setTimeFilter] = useState<'kun' | 'hafta' | 'ay' | 'yil'>('hafta');
  const [mockHistory, setMockHistory] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalTests: 0,
    avgAccuracy: 0,
    todayWords: 0,
    bestScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data, error } = await supabase
          .from('mock_test_results')
          .select('*')
          .eq('user_phone', user.phone)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        if (data && data.length > 0) {
          setMockHistory(data);
          
          // 📈 HISOBLASH MANTIQI
          const totalTests = data.length;
          const totalAccuracy = data.reduce((acc, curr) => acc + (curr.score / curr.total_questions), 0);
          const avgAccuracy = Math.round((totalAccuracy / totalTests) * 100);
          const bestScore = Math.max(...data.map(d => Math.round((d.score / d.total_questions) * 100)));
          
          // Bugungi ishlangan so'zlarni filtrlash (masalan)
          const today = new Date().toISOString().split('T')[0];
          const todayData = data.filter(d => d.created_at.startsWith(today));
          const todayWords = todayData.reduce((acc, curr) => acc + curr.total_questions, 0);

          setStats({ totalTests, avgAccuracy, todayWords, bestScore });
        }
      } catch (err) {
        console.error("Xatolik:", err);
      }
    };
    fetchStats();
  }, [user.phone]);

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-20 flex flex-col">
      {/* 🟢 HEADER */}
      <div className="bg-[#2EB8A6] pt-14 pb-24 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 border border-white/30">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Analitika</h2>
      </div>

      <main className="px-6 -mt-16 space-y-6 relative z-10">
        
        {/* 📋 BUGUNGI NATIJA KARTASI */}
        <div className="bg-white rounded-[40px] p-6 shadow-xl border-b-[8px] border-[#E8DFCC]">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-[#E6F4F1] rounded-xl text-[#2EB8A6]"><Activity className="w-5 h-5" /></div>
            <h3 className="font-black text-[#2C4A44] uppercase text-sm">Bugungi belsendilik</h3>
          </div>
          <div className="grid grid-cols-2 gap-6 text-center">
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#2EB8A6]">{stats.todayWords}</p>
              <p className="text-[10px] font-black text-[#8DA6A1] uppercase">Ishlengen sózler</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black text-[#FF9500]">{stats.avgAccuracy}%</p>
              <p className="text-[10px] font-black text-[#8DA6A1] uppercase">Anıqlıq dárejesi</p>
            </div>
          </div>
        </div>

        {/* 📈 GRAFIK: INTERAKTIV VA KENGAYTIRILGAN */}
        <div className="bg-white rounded-[40px] p-6 shadow-lg border-b-[6px] border-[#E8DFCC] space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="font-black text-[#2C4A44] text-xs uppercase flex items-center">
               <TrendingUp className="w-4 h-4 mr-2 text-[#2EB8A6]" /> Progres grafigi
             </h3>
             <div className="flex space-x-1 bg-[#F5EEDC] p-1 rounded-xl">
               {['kun', 'hafta'].map(f => (
                 <button key={f} onClick={() => setTimeFilter(f as any)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase ${timeFilter === f ? 'bg-white text-[#2EB8A6]' : 'text-[#8DA6A1]'}`}>{f}</button>
               ))}
             </div>
          </div>
          
          <div className="relative h-48 flex items-end justify-between px-2 pt-10">
            {/* Grafik chiziqlari (Grid) */}
            <div className="absolute inset-0 flex flex-col justify-between py-2 opacity-10 pointer-events-none">
              <div className="border-t-2 border-[#2C4A44] w-full"></div>
              <div className="border-t-2 border-[#2C4A44] w-full"></div>
              <div className="border-t-2 border-[#2C4A44] w-full"></div>
            </div>
            
            {/* Dinamik ustunlar */}
            {[50, 70, 40, 90, 60, 85, 45].map((val, i) => (
              <div key={i} className="flex flex-col items-center group w-full">
                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-[#2C4A44] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">{val}%</div>
                <div className="w-4 bg-[#E6F4F1] rounded-full h-32 relative overflow-hidden flex items-end">
                  <div className="w-full bg-[#2EB8A6] rounded-full transition-all duration-1000 group-hover:bg-[#FF9500]" style={{ height: `${val}%` }}></div>
                </div>
                <span className="mt-2 text-[9px] font-black text-[#8DA6A1] uppercase tracking-tighter">{['D', 'S', 'Ch', 'P', 'J', 'Sh', 'Y'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 🏆 JAMI STATISTIKA (GRID) */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-[35px] border-b-[4px] border-[#E8DFCC] flex items-center space-x-3">
             <div className="w-10 h-10 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500"><PieChart className="w-5 h-5" /></div>
             <div>
               <p className="font-black text-[#2C4A44] leading-tight">{stats.totalTests}</p>
               <p className="text-[9px] font-black text-[#8DA6A1] uppercase">Jámi test</p>
             </div>
          </div>
          <div className="bg-white p-5 rounded-[35px] border-b-[4px] border-[#E8DFCC] flex items-center space-x-3">
             <div className="w-10 h-10 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500"><Target className="w-5 h-5" /></div>
             <div>
               <p className="font-black text-[#2C4A44] leading-tight">{stats.bestScore}%</p>
               <p className="text-[9px] font-black text-[#8DA6A1] uppercase">Eń joqarı</p>
             </div>
          </div>
        </div>

        {/* 📜 TARIX QISMI */}
        <div className="space-y-4 pt-2 pb-10">
          <h3 className="font-black text-[#2C4A44] text-lg uppercase tracking-tight flex items-center ml-2">
            <History className="w-5 h-5 mr-3 text-[#2EB8A6]" /> Mock Test Tariyxı
          </h3>
          {mockHistory.map((test, idx) => (
            <div key={idx} className="bg-white/80 backdrop-blur-sm p-5 rounded-[30px] border border-white flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-[#E6F4F1] rounded-2xl flex items-center justify-center mr-4 shadow-inner">
                  <Zap className="w-6 h-6 text-[#2EB8A6]" />
                </div>
                <div>
                  <h4 className="font-black text-[#2C4A44] text-sm uppercase">{Math.round((test.score / test.total_questions) * 100)}% Anıqlıq</h4>
                  <p className="text-[10px] font-bold text-[#8DA6A1]">{new Date(test.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="font-black text-lg text-[#2EB8A6]">{test.score}</span>
                <span className="text-[#2EB8A6]/50 font-bold text-xs">/{test.total_questions}</span>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
