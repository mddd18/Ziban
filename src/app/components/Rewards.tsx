import { useState, useEffect } from 'react';
import { ArrowLeft, Gift, Coins, Percent, Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

interface RewardsProps {
  onBack: () => void;
  userCoins: number;
  onUpdateCoins: (newCoins: number) => void;
}

interface Voucher {
  id: number;
  discount: number;
  cost_coins: number;
  color: string;
  description: string;
}

export default function Rewards({ onBack, userCoins, onUpdateCoins }: RewardsProps) {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [purchasedVouchers, setPurchasedVouchers] = useState<any[]>([]);
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(true);
  const [buying, setBuying] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    const userPhone = localStorage.getItem('userPhone');
    
    // 1. Aktiv vaucherlarni bazadan tortamiz
    const { data: vData } = await supabase.from('vouchers').select('*').eq('is_active', true).order('cost_coins', { ascending: true });
    if (vData) setVouchers(vData);

    // 2. Foydalanuvchining sotib olgan vaucherlarini tortamiz
    if (userPhone) {
      const { data: pData } = await supabase
        .from('user_vouchers')
        .select(`
          id,
          purchased_at,
          vouchers ( discount, description, color )
        `)
        .eq('user_phone', userPhone)
        .order('purchased_at', { ascending: false });
        
      if (pData) setPurchasedVouchers(pData);
    }
    setLoading(false);
  }

  const handlePurchase = async (voucher: Voucher) => {
    const userPhone = localStorage.getItem('userPhone');
    if (!userPhone) return;

    if (userCoins >= voucher.cost_coins) {
      setBuying(true);
      const newCoins = userCoins - voucher.cost_coins;
      
      // Bazadan tangalarni ayirib yozamiz
      const { error: userErr } = await supabase.from('users').update({ coins: newCoins }).eq('phone', userPhone);
      
      if (!userErr) {
        // Xarid qilingan vaucherni tarixga qo'shamiz
        await supabase.from('user_vouchers').insert([{ user_phone: userPhone, voucher_id: voucher.id }]);
        
        onUpdateCoins(newCoins); // Tizimdagi coinni yangilaymiz
        await fetchData(); // Ro'yxatni yangilaymiz
        alert(`Tabıslarımız! ${voucher.discount}% chegirma voucherińiz tabıslı satın alındı!`);
      } else {
        alert("Xatolik yuz berdi. Qayta urinib ko'ring.");
      }
      
      setBuying(false);
      setSelectedVoucher(null);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="animate-spin text-indigo-600 w-12 h-12" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="p-2">
                <ArrowLeft className="w-6 h-6" />
              </Button>
              <h1 className="text-xl font-bold">Coinlar alması</h1>
            </div>
            <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-md">
              <Coins className="w-5 h-5" />
              <span className="font-bold">{userCoins}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Gift className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Coinlarıńızdı almastırıń</h2>
          <p className="text-gray-600">Oqıw merkezlerinde paydalanıw ushın chegirma voucherlerin satın alıń</p>
        </div>

        {/* Barcha vaucherlar (Magazin) */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Sıyılıqlar dúkáni</h3>
          {vouchers.map((voucher) => {
            const canAfford = userCoins >= voucher.cost_coins;

            return (
              <div key={voucher.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all">
                <div className="flex items-center">
                  <div className={`w-32 h-32 bg-gradient-to-br ${voucher.color} flex items-center justify-center flex-shrink-0`}>
                    <div className="text-center text-white">
                      <Percent className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-3xl font-bold">{voucher.discount}%</p>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">{voucher.discount}% Chegirma Voucher</h4>
                    <p className="text-gray-600 text-sm mb-3">{voucher.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-lg text-gray-900">{voucher.cost_coins} Coins</span>
                      </div>
                      <Button
                        onClick={() => setSelectedVoucher(voucher)}
                        disabled={!canAfford || buying}
                        className={`${canAfford ? 'bg-indigo-600 hover:bg-indigo-700 text-white' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                      >
                        {canAfford ? 'Satın alıw' : 'Jetispeydi'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mening xaridlarim (Tarix) */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-600" /> Meniń voucherlerim
          </h3>
          {purchasedVouchers.length > 0 ? (
            <div className="space-y-3">
              {purchasedVouchers.map((item) => (
                <div key={item.id} className={`bg-gradient-to-r ${item.vouchers.color} rounded-xl p-4 text-white shadow-sm`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                        <Percent className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-lg">{item.vouchers.discount}% Chegirma</p>
                        <p className="text-sm opacity-90">{new Date(item.purchased_at).toLocaleDateString('uz-UZ')}</p>
                      </div>
                    </div>
                    <Check className="w-6 h-6" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Endi voucher satın alınbadı</p>
              <p className="text-sm mt-2">Coinlar jıynap, chegirmalardan paydalanıń!</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasdiqlash Modali */}
      {selectedVoucher && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Satın alıwdı tastıyıqlań</h3>
            <div className={`bg-gradient-to-r ${selectedVoucher.color} rounded-xl p-6 text-white mb-6`}>
              <div className="text-center">
                <Percent className="w-12 h-12 mx-auto mb-2" />
                <p className="text-4xl font-bold mb-2">{selectedVoucher.discount}%</p>
                <p className="text-sm opacity-90">{selectedVoucher.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4 mb-6">
              <span className="text-gray-600">Bahası:</span>
              <div className="flex items-center space-x-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="font-bold text-lg">{selectedVoucher.cost_coins} Coins</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={() => setSelectedVoucher(null)} variant="outline" className="flex-1" disabled={buying}>
                Bıykarlaw
              </Button>
              <Button onClick={() => handlePurchase(selectedVoucher)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" disabled={buying}>
                {buying ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : 'Tastıyıqlaw'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
