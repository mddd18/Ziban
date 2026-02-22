import { useState, useEffect } from 'react';
import { ChevronLeft, Store, Ticket, Loader2, AlertCircle, CheckCircle, Star, Sparkles, ShoppingBag } from 'lucide-react';
import { supabase } from '../../supabase';

interface VoucherStoreProps {
  onBack: () => void;
}

export default function VoucherStore({ onBack }: VoucherStoreProps) {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [userCoins, setUserCoins] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // App.tsx dan keladigan yoki localStorage dan olinadigan userPhone
  const userPhone = localStorage.getItem('userPhone');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    if (userPhone) {
      // 1. Foydalanuvchi tangalarini bazadan olish
      const { data: userData } = await supabase
        .from('users')
        .select('coins')
        .eq('phone', userPhone)
        .maybeSingle();
      if (userData) setUserCoins(userData.coins || 0);

      // 2. Aktiv vaucherlarni bazadan olish
      const { data: vData } = await supabase
        .from('vouchers')
        .select('*')
        .eq('is_active', true)
        .order('cost_coins', { ascending: true });
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

    // 1. Foydalanuvchi balansini yangilash
    const { error: updateError } = await supabase
      .from('users')
      .update({ coins: newBalance })
      .eq('phone', userPhone);
    
    if (!updateError) {
      // 2. Xaridni user_vouchers jadvaliga saqlash
      await supabase.from('user_vouchers').insert([
        { user_phone: userPhone, voucher_id: voucher.id }
      ]);
      
      setUserCoins(newBalance);
      setMessage({ type: 'success', text: `Tabıslı! Siz "${voucher.title}" vaucherin satıp aldıńız.` });
      
      // Xabarni 3 soniyadan keyin o'chirish
      setTimeout(() => setMessage(null), 3000);
    } else {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi. Qayta urinib ko\'ring.' });
    }
    setLoading(false);
  };

  if (loading && vouchers.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F5EEDC]">
        <Loader2 className="animate-spin text-[#2EB8A6] w-12 h-12 mb-4" />
        <p className="text-[#8DA6A1] font-black uppercase text-[10px] tracking-widest">Dúkán júklenbekte...</p>
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

        <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/30 text-white mb-4 shadow-inner">
           <Star className="w-5 h-5 text-[#F4C150] fill-[#F4C150]" />
           <span className="font-black text-lg tracking-wider">{userCoins} COIN</span>
        </div>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Vaucherler Dúkáni</h2>
      </header>

      {/* ⚪️ MAIN CONTENT */}
      <main className="max-w-4xl mx-auto px-6 -mt-10 space-y-6 relative z-10">
        
        {/* XABAR PANEL (Alert) */}
        {message && (
          <div className={`p-5 rounded-[30px] shadow-xl flex items-center border-b-4 transition-all animate-in slide-in-from-top-4 ${
            message.type === 'success' 
              ? 'bg-emerald-500 border-emerald-700 text-white' 
              : 'bg-[#F44336] border-red-800 text-white'
          }`}>
            {message.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3 shrink-0" /> : <AlertCircle className="w-6 h-6 mr-3 shrink-0" />}
            <span className="font-black text-xs uppercase tracking-tight leading-tight">{message.text}</span>
          </div>
        )}

        {/* VAUCHERLAR GRIDI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white rounded-[45px] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-b-[8px] border-[#E8DFCC] flex flex-col group active:translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-[#E6F4F1] rounded-[24px] flex items-center justify-center text-[#2EB8A6] shadow-inner group-hover:scale-110 transition-transform">
                  <Ticket className="w-8 h-8 transform -rotate-45" />
                </div>
                <div className="bg-[#FFF4E5] px-4 py-1.5 rounded-2xl border border-[#FFE8CC] flex items-center">
                   <Sparkles className="w-3 h-3 text-[#FF9500] mr-1.5" />
                   <span className="text-[#FF9500] font-black text-[9px] uppercase tracking-tighter">Chegirme</span>
                </div>
              </div>

              <div className="flex-1 space-y-2">
                <h3 className="text-xl font-black text-[#2C4A44] leading-tight">{voucher.title}</h3>
                <p className="text-[#8DA6A1] text-[11px] font-bold leading-relaxed">{voucher.description}</p>
              </div>
              
              <div className="mt-8 pt-6 border-t border-[#F5EEDC] flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black text-[#8DA6A1] uppercase mb-1">Quni</p>
                  <div className="text-xl font-black text-[#FF9500] flex items-center">
                    <span className="mr-1">🪙</span> {voucher.cost_coins}
                  </div>
                </div>

                <button 
                  onClick={() => handleBuy(voucher)} 
                  disabled={loading || userCoins < voucher.cost_coins}
                  className={`px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center space-x-2 ${
                    userCoins >= voucher.cost_coins 
                      ? 'bg-[#2EB8A6] text-white shadow-emerald-200 active:translate-y-1' 
                      : 'bg-[#E8DFCC] text-[#A0B8B4] cursor-not-allowed border-b-2 border-[#D1C7B1]'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{userCoins >= voucher.cost_coins ? 'Satıp alıw' : 'Jetispeydi'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* BO'SH HOLAT */}
        {vouchers.length === 0 && !loading && (
          <div className="text-center py-24 bg-white/40 rounded-[60px] border-4 border-dashed border-white/60">
            <Store className="w-16 h-16 mx-auto mb-4 text-[#A0B8B4] opacity-30" />
            <p className="text-[#8DA6A1] font-black uppercase text-xs tracking-[0.3em]">Házirshe dúkánda vaucherler joq</p>
          </div>
        )}
      </main>
    </div>
  );
}
