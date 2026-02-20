import { useState, useEffect } from 'react';
import { ArrowLeft, Store, Ticket, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
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
      // 1. Foydalanuvchi tangalarini olish
      const { data: userData } = await supabase.from('users').select('coins').eq('phone', userPhone).maybeSingle();
      if (userData) setUserCoins(userData.coins || 0);

      // 2. Aktiv vaucherlarni olish
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

    // 1. Foydalanuvchi balansidan tangani yechib olish
    const { error: updateError } = await supabase.from('users').update({ coins: newBalance }).eq('phone', userPhone);
    
    if (!updateError) {
      // 2. Xaridni user_vouchers jadvaliga yozib qo'yish
      await supabase.from('user_vouchers').insert([{ user_phone: userPhone, voucher_id: voucher.id }]);
      setUserCoins(newBalance);
      setMessage({ type: 'success', text: `Tabıslı! Siz "${voucher.title}" vaucherin satıp aldıńız.` });
    } else {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi. Qayta urinib ko\'ring.' });
    }
    setLoading(false);
  };

  if (loading && vouchers.length === 0) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Header */}
      <header className="bg-indigo-600 shadow-md sticky top-0 z-10 text-white">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onBack} className="p-2 text-white hover:bg-white/20">
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold flex items-center"><Store className="mr-2 w-6 h-6" /> Vaucherlar Dúkáni</h1>
          </div>
          <div className="bg-yellow-400 text-yellow-900 px-4 py-1.5 rounded-full font-black flex items-center shadow-inner">
            <span className="text-xl mr-2">🪙</span> {userCoins}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        {/* Xabar oynasi */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertCircle className="w-6 h-6 mr-3" />}
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {vouchers.map((voucher) => (
            <div key={voucher.id} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center mb-4 text-indigo-500">
                  <Ticket className="w-8 h-8 transform -rotate-45" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{voucher.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">{voucher.description}</p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="text-lg font-black text-yellow-600 flex items-center">
                  🪙 {voucher.cost_coins} <span className="text-sm font-medium text-gray-400 ml-1">coin</span>
                </div>
                <Button 
                  onClick={() => handleBuy(voucher)} 
                  disabled={loading || userCoins < voucher.cost_coins}
                  className={`px-6 py-2 rounded-xl font-bold ${userCoins >= voucher.cost_coins ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  {userCoins >= voucher.cost_coins ? 'Satıp alıw' : 'Coin jetispeydi'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {vouchers.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            <Store className="w-16 h-16 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Házirshe dúkánda vaucherler joq.</p>
          </div>
        )}
      </div>
    </div>
  );
}
