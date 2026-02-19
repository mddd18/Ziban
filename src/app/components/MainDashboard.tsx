import { Book, Target, BarChart3, FileText, LogOut, Menu, X, Coins, Gift, GraduationCap } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface MainDashboardProps {
  user: { firstName: string; lastName: string; phone: string; coins: number };
  onNavigate: (view: 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers') => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const menuItems = [
    { 
      id: 'exercises' as const, 
      title: 'Shınıǵıwlar', 
      icon: Target,
      description: 'Test hám terminlar',
      color: 'from-indigo-500 to-purple-500'
    },
    { 
      id: 'statistics' as const, 
      title: 'Statistika', 
      icon: BarChart3,
      description: 'Nátiyjeleriń',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'mock-test' as const, 
      title: 'Mock test', 
      icon: FileText,
      description: 'Aynıǵa 1 ret',
      color: 'from-pink-500 to-red-500'
    },
    { 
      id: 'literature' as const, 
      title: 'Ádebiyatlar', 
      icon: Book,
      description: 'Oqıw materialları',
      color: 'from-blue-500 to-indigo-500'
    },
    { 
      id: 'rewards' as const, 
      title: 'Coinlar alması', 
      icon: Gift,
      description: 'Chegirmalar alıw',
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      id: 'learning-centers' as const, 
      title: 'Oqıw merkezleri', 
      icon: GraduationCap,
      description: 'Offlayn oqıw',
      color: 'from-green-500 to-teal-500'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="9" strokeWidth="2" />
                  <circle cx="12" cy="12" r="4" strokeWidth="2" />
                </svg>
              </div>
              <div>
                <h1 className="font-bold text-gray-900">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-sm text-gray-500">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-2 rounded-full shadow-md">
                <Coins className="w-5 h-5" />
                <span className="font-bold">{user.coins || 0}</span>
              </div>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {menuOpen && (
            <div className="mt-4 pt-4 border-t">
              <Button
                variant="ghost"
                onClick={onLogout}
                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Shıǵıw
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Motto Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-2">Ilim - bul tákirarlaw!</h2>
          <p className="text-indigo-100">Hárbir kún júmıs jardeminde tabıslılıqqa jetesiń!</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer"
              >
                <div className={`bg-gradient-to-br ${item.color} p-8 text-white`}>
                  <div className="flex items-center justify-between mb-4">
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-white/90">{item.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}