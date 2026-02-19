import { ArrowLeft, MapPin, Phone, Clock, Star, Coins, Navigation } from 'lucide-react';
import { Button } from './ui/button';

interface LearningCentersProps {
  onBack: () => void;
  userCoins: number;
  onNavigateToRewards: () => void;
}

interface LearningCenter {
  id: number;
  name: string;
  address: string;
  phone: string;
  rating: number;
  hours: string;
  description: string;
  acceptsVouchers: boolean;
  color: string;
}

const learningCenters: LearningCenter[] = [
  {
    id: 1,
    name: 'Nukus Til Merkezi',
    address: 'Nukus qalası, Karakalpakstan kóshesi 45',
    phone: '+998 91 234 56 78',
    rating: 4.8,
    hours: '9:00 - 18:00',
    description: 'Qaraqalpaq tili sertifikatına tayorlanıw boyınsha professıonal oqıtıw',
    acceptsVouchers: true,
    color: 'from-blue-500 to-indigo-500'
  },
  {
    id: 2,
    name: 'Ilim Plus',
    address: 'Nukus qalası, Dostlıq daňǵılı 12',
    phone: '+998 91 345 67 89',
    rating: 4.9,
    hours: '8:00 - 20:00',
    description: 'Joqarı sapada oqıtıw hám tayorlaw xızmeti',
    acceptsVouchers: true,
    color: 'from-purple-500 to-pink-500'
  },
  {
    id: 3,
    name: 'Bilim Uyı',
    address: 'Nukus qalası, Jáslık kóshesi 78',
    phone: '+998 91 456 78 90',
    rating: 4.7,
    hours: '10:00 - 19:00',
    description: 'Tájribeli mugalimler menen qaraqalpaq tilinde mashǵulat',
    acceptsVouchers: true,
    color: 'from-green-500 to-teal-500'
  },
  {
    id: 4,
    name: 'Talant Akademiyası',
    address: 'Nukus qalası, Respublıka daňǵılı 34',
    phone: '+998 91 567 89 01',
    rating: 4.6,
    hours: '9:00 - 17:00',
    description: 'Sertifikat alıw ushın tolıq tayorlaw programmasi',
    acceptsVouchers: true,
    color: 'from-orange-500 to-red-500'
  }
];

export default function LearningCenters({ onBack, userCoins, onNavigateToRewards }: LearningCentersProps) {
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
              <h1 className="text-xl font-bold">Oqıw merkezleri</h1>
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
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Offlayn oqıw merkezleri
          </h2>
          <p className="text-gray-600">
            Professıonal mugalimler menen oqıń hám voucherlerdi paydalanıń
          </p>
        </div>

        {/* Voucher Reminder */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl shadow-lg p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">Voucherińiz bar ma?</h3>
              <p className="text-sm opacity-90">Coinlarıńızdı almastırıp, chegirma alıń!</p>
            </div>
            <Button
              onClick={onNavigateToRewards}
              className="bg-white text-orange-600 hover:bg-gray-100"
            >
              Alması
            </Button>
          </div>
        </div>

        {/* Learning Centers List */}
        <div className="space-y-4">
          {learningCenters.map((center) => (
            <div
              key={center.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all"
            >
              <div className={`h-2 bg-gradient-to-r ${center.color}`}></div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-gray-900 mb-2">
                      {center.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="font-medium text-gray-700">{center.rating}</span>
                      <span className="text-sm text-gray-500 ml-2">Bahalav</span>
                    </div>
                  </div>
                  {center.acceptsVouchers && (
                    <div className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Voucher qabıl etedi
                    </div>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{center.description}</p>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-700">{center.address}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <a
                      href={`tel:${center.phone}`}
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                    >
                      {center.phone}
                    </a>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{center.hours}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t flex space-x-3">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    onClick={() => alert(`${center.name} merkezine baylanısıw ushın: ${center.phone}`)}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Baylanısıw
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => alert(`Lokatsiya: ${center.address}`)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Jol kórsetiw
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-8 space-y-4">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4">Voucher qalayshe paydalanıw?</h3>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  1
                </div>
                <span>Mock test ótiń hám coinlar jıynań</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  2
                </div>
                <span>Coinlarıńızdı voucherge almastırıń (20%, 30%, yaki 50%)</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  3
                </div>
                <span>Oqıw merkezine baylanısıp, voucherińizdi kórsetiń</span>
              </li>
              <li className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm">
                  4
                </div>
                <span>Chegirma menen oqıwdı bashlań!</span>
              </li>
            </ol>
          </div>

          <div className="bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Ǵárdem kerek pe?</h3>
                <p className="text-white/90 text-sm">
                  Oqıw merkezleri boyınsha sorawlarıńız bolsa, bıylaysha baylanısıń: +998 91 000 00 00
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
