import { ArrowLeft, Crown, CheckCircle2, ShieldCheck, Zap, Swords, Send } from 'lucide-react';
import { Button } from './ui/button';

interface PremiumScreenProps {
  onBack: () => void;
  onUpgradeSuccess: () => void;
}

export default function PremiumScreen({ onBack }: PremiumScreenProps) {
  
  // 👈 SHU YERGA O'Z TELEGRAM USERNAMINGIZNI YOZING (Masalan: UluginoChopuchino)
  const ADMIN_TELEGRAM = "UluginoChopuchino"; 

  const handleContactAdmin = () => {
    window.open(`https://t.me/${ADMIN_TELEGRAM}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white pb-10">
      <header className="sticky top-0 z-10 p-4">
        <Button variant="ghost" onClick={onBack} className="text-gray-300 hover:text-white hover:bg-white/10">
          <ArrowLeft className="w-6 h-6 mr-2" /> Artqa
        </Button>
      </header>

      <div className="max-w-md mx-auto px-4 pt-8 pb-12 text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(234,179,8,0.3)]">
          <Crown className="w-12 h-12 text-white" />
        </div>
        
        <h1 className="text-4xl font-black mb-4">PRO Tarıyfı</h1>
        <p className="text-gray-400 mb-8 text-lg">Milliy sertifikatqa 100% tayyar bolıń hám barlıq múmkinshiliklerden paydalanıń!</p>

        <div className="bg-gray-800 rounded-3xl p-6 mb-8 text-left border border-gray-700">
          <ul className="space-y-4">
            <li className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <span className="text-gray-200">Rásmiy <strong>Mock Testlar</strong>dı islew ruqsatı</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <span className="text-gray-200">Tapsırmalar islep <strong>Coin (Tanga)</strong> jıynaw</span>
            </li>
            <li className="flex items-start">
              <Swords className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <span className="text-gray-200"><strong>Sóz sawashı (1vs1)</strong> onlayn arenasına kiriw</span>
            </li>
            <li className="flex items-start">
              <ShieldCheck className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <span className="text-gray-200">Japıq ádebiyatlar hám qollanbalardı júklep alıw</span>
            </li>
            <li className="flex items-start">
              <Zap className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
              <span className="text-gray-200">Rekomlama hám sheklewlersiz paydalanıw</span>
            </li>
          </ul>
        </div>

        <div className="mb-8">
          <div className="text-5xl font-black text-white mb-2">99.000 <span className="text-2xl text-gray-400">UZS</span></div>
          <div className="text-gray-400">/ 1 ay ushın</div>
        </div>

        <Button 
          onClick={handleContactAdmin}
          className="w-full h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-gray-900 font-black text-xl rounded-2xl shadow-lg transition-transform hover:scale-[1.02]"
        >
          <Send className="w-6 h-6 mr-2" /> Admin arqalı satıp alıw
        </Button>
        <p className="text-sm text-gray-500 mt-4">Satıp alıw ushın adminge telegramnan jazıń</p>
      </div>
    </div>
  );
}
