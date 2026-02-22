import { useState, useEffect } from 'react';
import { ChevronLeft, Store, Ticket, Loader2, AlertCircle, CheckCircle, Star, Sparkles } from 'lucide-react';
import { supabase } from '../../supabase';

export default function VoucherStore({ onBack }: { onBack: () => void }) {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const userPhone = localStorage.getItem('userPhone');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    if (userPhone) {
      const { data: userData } = await supabase.from('users').select('coins').eq('phone', userPhone).maybeSingle();
      if (userData) setUserCoins(userData.coins || 0);

      const { data: vData } = await supabase.from('vouchers').select('*').eq('is_active', true).order('cost_coins', { ascending: true });
      if (vData) setVouchers(vData);
    }
    setLoading(false);
  }

  const handleBuy = async (voucher: any) => {
    setMessage(null);
    if (!userPhone) return;

    if (userCoins < voucher.cost_coins) {
      setMessage({ type: 'error', text: 'Keshirińiz, vaucher satıp alıw ushın Coin jetispeydi!' });
      return;
    }

    setLoading(true);
    const newBalance = userCoins - voucher.cost_coins;

    const { error: updateError } = await supabase.from('users').update({ coins: newBalance }).eq('phone', userPhone);
    
    if (!updateError) {
      await supabase.from('user_vouchers').insert([{ user_phone: userPhone, voucher_id: voucher.id }]);
      setUserCoins(newBalance);
      setMessage({ type: 'success', text: `Tabıslı! Siz "${voucher.title}" vaucherin satıp aldıńız.` });
    } else {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi. Qayta urinib ko\'ring.' });
    }
    setLoading(false);
  };

  if (loading && vouchers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EEDC]">
        <Loader2 className="animate-spin text-[#2EB8A6] w-12 h-12 mb-4" />
        <p className="text-[#8DA6A1] font-black uppercase text-xs tracking-widest">Dúkán júklenbekte...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-16">
      {/* 🟢 HEADER SECTION */}
      <header className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 border border-white/30 transition-all"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 text-white mb-4">
           <Star className="w-5 h-5 text-[#F4C150] fill-[#F4C150]" />
           <span className="font-black text-lg tracking-wider">{userCoins} COIN</span>
        </div>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Vaucherler</h2>
      </header>

      {/* ⚪️ MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 -mt-10 space-y-6 relative z-10">
        
        {/* Xabar oynasi (Ziyban Style) */}
        {message && (
          <div className={`p-5 rounded-[30px] shadow-lg flex items-center animate-bounce-subtle ${
            message.type === 'success' 
              ? 'bg-emerald-500 text-white' 
              : 'bg-[#F44336] text-white'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3 shrink-0" /> : <AlertCircle className="w-6 h-6 mr-3 shrink-0" />}
            <span className="font-black text-xs uppercase tracking-tight">{message.text}</span>
          </div>
        )}

        {/* Vaucherlar ro'yxati */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white rounded-[45px] p-7 shadow-[0_10px_25px_rgba(0,0,0,0.03)] border-b-[8px] border-[#E8DFCC] flex flex-col group transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-[#E6F4F1] rounded-[24px] flex items-center justify-center text-[#2EB8A6] shadow-inner transform group-hover:rotate-6 transition-transform">
                  <Ticket className="w-8 h-8 transform -rotate-45" />
                </div>
                <div className="bg-[#FFF4E5] px-4 py-1.5 rounded-2xl border border-[#FFE8CC] flex items-center">
                   <Sparkles className="w-3 h-3 text-[#FF9500] mr-1.5" />
                   <span className="text-[#FF9500] font-black text-[10px] uppercase">Eksklyuziv</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#2C4A44] leading-tight">{voucher.title}</h3>
                <p className="text-[#8DA6A1] text-xs font-bold leading-relaxed">{voucher.description}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-[#8DA6A1] uppercase mb-1">Bahası</p>
                  <div className="text-xl font-black text-[#FF9500] flex items-center">
                    <span className="mr-1">🪙</span> {voucher.cost_coins}
                  </div>
                </div>

                <button 
                  onClick={() => handleBuy(voucher)} 
                  disabled={loading || userCoins < voucher.cost_coins}
                  className={`px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.1em] transition-all shadow-lg active:translate-y-1 ${
                    userCoins >= voucher.cost_coins 
                      ? 'bg-[#2EB8A6] text-white shadow-emerald-200' 
                      : 'bg-[#E8DFCC] text-[#A0B8B4] cursor-not-allowed border-b-2 border-[#D1C7B1]'
                  }`}
                >
                  {userCoins >= voucher.cost_coins ? 'Satıp alıw' : 'Jetispeydi'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bo'sh holat */}
        {vouchers.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/40 rounded-[50px] border-4 border-dashed border-white/60">
            <Store className="w-16 h-16 mx-auto mb-4 text-[#A0B8B4] opacity-30" />
            <p className="text-[#8DA6A1] font-black uppercase text-xs tracking-widest">Házirshe dúkánda vaucherler joq.</p>
          </div>
        )}
      </main>
    </div>
  );
}
