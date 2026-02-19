import { useState } from 'react';
import { ArrowLeft, Gift, Coins, Percent, Check, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface RewardsProps {
  onBack: () => void;
  userCoins: number;
  onUpdateCoins: (newCoins: number) => void;
}

interface Voucher {
  id: string;
  discount: number;
  cost: number;
  color: string;
  description: string;
}

const vouchers: Voucher[] = [
  {
    id: '20',
    discount: 20,
    cost: 50,
    color: 'from-blue-500 to-indigo-500',
    description: 'Oqıw merkezinde 20% chegirma'
  },
  {
    id: '30',
    discount: 30,
    cost: 100,
    color: 'from-purple-500 to-pink-500',
    description: 'Oqıw merkezinde 30% chegirma'
  },
  {
    id: '50',
    discount: 50,
    cost: 200,
    color: 'from-yellow-500 to-orange-500',
    description: 'Oqıw merkezinde 50% chegirma'
  }
];

export default function Rewards({ onBack, userCoins, onUpdateCoins }: RewardsProps) {
  const [purchasedVouchers, setPurchasedVouchers] = useState<string[]>(() => {
    const saved = localStorage.getItem('purchasedVouchers');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);

  const handlePurchase = (voucher: Voucher) => {
    if (userCoins >= voucher.cost) {
      const newCoins = userCoins - voucher.cost;
      onUpdateCoins(newCoins);
      
      const voucherId = `${voucher.id}_${Date.now()}`;
      const updated = [...purchasedVouchers, voucherId];
      setPurchasedVouchers(updated);
      localStorage.setItem('purchasedVouchers', JSON.stringify(updated));
      
      setSelectedVoucher(null);
      alert(`Tabıslarımız! ${voucher.discount}% chegirma voucherińiz tabıslı satın alındı!`);
    }
  };

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Coinlarıńızdı almastırıń
          </h2>
          <p className="text-gray-600">
            Oqıw merkezlerinde paydalanıw ushın chegirma voucherlerin satın alıń
          </p>
        </div>

        {/* Available Vouchers */}
        <div className="space-y-4 mb-8">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Sıyılıqlar</h3>
          {vouchers.map((voucher) => {
            const canAfford = userCoins >= voucher.cost;

            return (
              <div
                key={voucher.id}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                <div className="flex items-center">
                  <div className={`w-32 h-32 bg-gradient-to-br ${voucher.color} flex items-center justify-center flex-shrink-0`}>
                    <div className="text-center text-white">
                      <Percent className="w-8 h-8 mx-auto mb-1" />
                      <p className="text-3xl font-bold">{voucher.discount}%</p>
                    </div>
                  </div>
                  <div className="flex-1 p-6">
                    <h4 className="font-bold text-lg text-gray-900 mb-1">
                      {voucher.discount}% Chegirma Voucher
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      {voucher.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coins className="w-5 h-5 text-yellow-600" />
                        <span className="font-bold text-lg text-gray-900">{voucher.cost} Coins</span>
                      </div>
                      <Button
                        onClick={() => setSelectedVoucher(voucher)}
                        disabled={!canAfford}
                        className={`${
                          canAfford
                            ? 'bg-indigo-600 hover:bg-indigo-700'
                            : 'bg-gray-300 cursor-not-allowed'
                        }`}
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

        {/* My Vouchers */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-yellow-600" />
            Meniń voucherlerim
          </h3>
          {purchasedVouchers.length > 0 ? (
            <div className="space-y-3">
              {purchasedVouchers.map((voucherId) => {
                const discount = voucherId.split('_')[0];
                const voucher = vouchers.find(v => v.id === discount);
                
                return (
                  <div
                    key={voucherId}
                    className={`bg-gradient-to-r ${voucher?.color || 'from-gray-400 to-gray-500'} rounded-xl p-4 text-white`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                          <Percent className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="font-bold text-lg">{discount}% Chegirma</p>
                          <p className="text-sm opacity-90">Oqıw merkezlerinde paydalanıń</p>
                        </div>
                      </div>
                      <Check className="w-6 h-6" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Gift className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Endi voucher satın alınbadı</p>
              <p className="text-sm mt-2">Coinlar jıynap, chegirmalardan paydalanıń!</p>
            </div>
          )}
        </div>

        {/* Info Card */}
        <div className="mt-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Coinlar qalayshe tabıw múmkin?</h3>
              <ul className="text-white/90 text-sm space-y-1">
                <li>• Mock test ótiw hám joqarı ball alıw</li>
                <li>• Hárbir aynıǵa 1 ret test óte alasız</li>
                <li>• 80%+ - 100 coins, 60-79% - 50 coins, 40-59% - 25 coins</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Confirmation Modal */}
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
                <span className="font-bold text-lg">{selectedVoucher.cost} Coins</span>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={() => setSelectedVoucher(null)}
                variant="outline"
                className="flex-1"
              >
                Boldiw
              </Button>
              <Button
                onClick={() => handlePurchase(selectedVoucher)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700"
              >
                Tastıyıqlaw
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
