import { ArrowLeft, Book, FileText, Download } from 'lucide-react';
import { Button } from './ui/button';

interface LiteratureProps {
  onBack: () => void;
}

export default function Literature({ onBack }: LiteratureProps) {
  const literatureItems = [
    {
      id: 1,
      title: 'Qaraqalpaq tili grammatikası',
      description: 'Tilde grammarlıq qáǵıydalar hám úlgileri',
      type: 'PDF',
      pages: 150,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      id: 2,
      title: 'Sózlik hám terminler',
      description: 'Basqı terminler menen tanısıw',
      type: 'PDF',
      pages: 85,
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 3,
      title: 'Sertifikat imtihanına tayorlaw',
      description: 'Imtihan formatı hám taslıq sorawlar',
      type: 'PDF',
      pages: 120,
      color: 'from-green-500 to-teal-500'
    },
    {
      id: 4,
      title: 'Aúdarma texnikaları',
      description: 'Aúdarma etiwdegi strateyalar',
      type: 'PDF',
      pages: 95,
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="p-2"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <h1 className="text-xl font-bold">Ádebiyatlar</h1>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Book className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Oqıw materialları
          </h2>
          <p className="text-gray-600">
            Sertifikatqa tayorlanıw ushın qájetti ádebiyatlar
          </p>
        </div>

        <div className="space-y-4">
          {literatureItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <div className="flex items-center p-6">
                <div className={`w-16 h-20 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center mr-4 flex-shrink-0`}>
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg text-gray-900 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {item.description}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                      {item.type}
                    </span>
                    <span>{item.pages} bet</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  className="ml-4 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
                >
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Info Card */}
        <div className="mt-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Book className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Kitaplar haqında</h3>
              <p className="text-white/90 text-sm">
                Bu materiallar Qaraqalpaq tili sertifikatına tayorlanıw ushın áhmiyetli qájetti bilimlerdi ózinde jamlaydi. 
                Úyreniw nátiyjeliligin artırıw ushın kún sayin oqıwdı tóńkemiz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
