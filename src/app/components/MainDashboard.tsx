import { Book, Target, BarChart3, FileText, LogOut, Menu, X, Coins, Gift, GraduationCap, Settings, Crown, Lock, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

// 👈 SHU YERGA O'Z RAQAMINGIZNI YOZING
const ADMIN_PHONE = "+998913773933"; 

interface MainDashboardProps {
  user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean };
  onNavigate: (view: 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium') => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Telefon raqamini faqat sonlarga aylantirib tekshirish (+ belgisiz)
  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const isAdmin = cleanPhone(user.phone) === cleanPhone(ADMIN_PHONE);

  const menuItems = [
    { id: 'exercises' as const, title: 'Shınıǵıwlar', icon: Target, description: 'Test hám terminlar', color: 'from-indigo-500 to-purple-500', isPremiumOnly: false },
    { id: 'statistics' as const, title: 'Statistika', icon: BarChart3, description: 'Nátiyjeleriń', color: 'from-purple-500 to-pink-500', isPremiumOnly: false },
    { id: 'mock-test' as const, title: 'Mock test', icon: FileText, description: 'Aynıǵa 1 ret', color: 'from-pink-500 to-red-500', isPremiumOnly: true },
    { id: 'literature' as const, title: 'Ádebiyatlar', icon: Book, description: 'Oqıw materialları', color: 'from-blue-500 to-indigo-500', isPremiumOnly: false },
    { id: 'rewards' as const, title: 'Coinlar alması', icon: Gift, description: 'Chegirmalar alıw', color: 'from-yellow-500 to-orange-500', isPremiumOnly: true },
    { id: 'learning-centers' as const, title: 'Oqıw merkezleri', icon: GraduationCap, description: 'Offlayn oqıw', color: 'from-green-500 to-teal-500', isPremiumOnly: false },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center relative">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2" /><circle cx="12" cy="12" r="4" strokeWidth="2" /></svg>
                {user.isPremium && <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1 shadow-md"><Crown className="w-3 h-3 text-white" /></div>}
              </div>
              <div>
                <h1 className="font-bold text-gray-900 flex items-center">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-xs font-bold text-gray-500">{user.isPremium ? <span className="text-yellow-600">PRO Paydalanıwshı</span> : 'Ápiwayı paydalanıwshı'}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => !user.isPremium && onNavigate('premium')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-md ${user.isPremium ? 'bg-gradient-to-r from-yellow-400 to-orange-400 text-white' : 'bg-gray-100 text-gray-400 cursor-pointer border border-gray-200'}`}
              >
                <Coins className="w-5 h-5" />
                <span className="font-bold">{user.isPremium ? (user.coins || 0) : 'PRO'}</span>
                {!user.isPremium && <Lock className="w-3 h-3 ml-1" />}
              </div>
              <button onClick={() => setMenuOpen(!menuOpen)} className="p-2 hover:bg-gray-100 rounded-lg">
                {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
          
          {menuOpen && (
            <div className="mt-4 pt-4 border-t">
              <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                <LogOut className="w-4 h-4 mr-2" /> Shıǵıw
              </Button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {!user.isPremium && (
          <div 
            onClick={() => onNavigate('premium')}
            className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-6 mb-8 text-white shadow-xl flex items-center justify-between cursor-pointer border border-gray-700 hover:scale-[1.02] transition-transform"
          >
            <div className="flex items-center">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg shadow-yellow-500/20">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-yellow-500 mb-1">PRO Tarıyfı nima beredi?</h3>
                <p className="text-gray-300 text-sm font-medium">Mock testlar, Coin jıynaw hám kóbirek...</p>
              </div>
            </div>
            <div className="bg-gray-700 rounded-full p-2">
              <ChevronRight className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.isPremiumOnly && !user.isPremium;
            
            return (
              <button
                key={item.id}
                onClick={() => isLocked ? onNavigate('premium') : onNavigate(item.id)}
                className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer text-left ${isLocked ? 'opacity-80 grayscale-[30%]' : ''}`}
              >
                <div className={`bg-gradient-to-br ${item.color} p-8 text-white h-full relative`}>
                  {isLocked && (
                    <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center">
                      <Lock className="w-4 h-4 mr-1" /> <span className="text-xs font-bold uppercase">PRO</span>
                    </div>
                  )}
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

        {/* 🌟 FAQAT ADMIN KO'RADIGAN TUGMA 🌟 */}
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin-panel')}
            className="w-full mt-8 bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-bold py-5 px-6 rounded-2xl flex items-center justify-start shadow-sm transition-all border-2 border-indigo-200 cursor-pointer"
          >
            <div className="bg-indigo-600 p-3 rounded-xl mr-4">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold">Admin Panel</h3>
              <p className="text-indigo-600 font-medium text-sm mt-1">Kitap júklew hám sistemanı basqarıw</p>
            </div>
          </button>
        )}
        
      </div>
    </div>
  );
}
