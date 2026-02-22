import { Book, Target, BarChart3, FileText, LogOut, Menu, X, Coins, Gift, GraduationCap, Settings, Crown, Lock, ChevronRight, User } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

// 👈 SHU YERGA O'Z RAQAMINGIZNI YOZING (Masalan: +998901234567)
const ADMIN_PHONE = "+998913773933"; 

interface MainDashboardProps {
  user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean };
  onNavigate: (view: 'exercises' | 'statistics' | 'literature' | 'mock-test' | 'rewards' | 'learning-centers' | 'admin-panel' | 'premium') => void;
  onLogout: () => void;
}

export default function MainDashboard({ user, onNavigate, onLogout }: MainDashboardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  // Telefon raqamini tozalab tekshirish (Admin ekanligini bilish uchun)
  const cleanPhone = (phone: string) => phone.replace(/[^0-9]/g, '');
  const isAdmin = cleanPhone(user.phone) === cleanPhone(ADMIN_PHONE);

  // Menyular ro'yxati (Minimalistik va aniq ranglar bilan)
  const menuItems = [
    { id: 'exercises' as const, title: 'Shınıǵıwlar', icon: Target, desc: 'Test & Terminlar', bgColor: 'bg-blue-100', iconColor: 'text-blue-500', isPremiumOnly: false },
    { id: 'statistics' as const, title: 'Statistika', icon: BarChart3, desc: 'Nátiyjeleriń', bgColor: 'bg-green-100', iconColor: 'text-green-500', isPremiumOnly: false },
    { id: 'mock-test' as const, title: 'Mock test', icon: FileText, desc: 'Aynıǵa 1 ret', bgColor: 'bg-pink-100', iconColor: 'text-pink-500', isPremiumOnly: true },
    { id: 'literature' as const, title: 'Ádebiyatlar', icon: Book, desc: 'Oqıw materialları', bgColor: 'bg-purple-100', iconColor: 'text-purple-500', isPremiumOnly: false },
    { id: 'rewards' as const, title: 'Coinlar alması', icon: Gift, desc: 'Chegirmalar', bgColor: 'bg-yellow-100', iconColor: 'text-yellow-500', isPremiumOnly: true },
    { id: 'learning-centers' as const, title: 'Oqıw merkezleri', icon: GraduationCap, desc: 'Offlayn oqıw', bgColor: 'bg-teal-100', iconColor: 'text-teal-500', isPremiumOnly: false },
  ];

  return (
    // Minimalist fon: Och kulrang
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20" style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}>
      
      {/* 🌟 HEADER: Qalin hoshiyali, oq va toza */}
      <header className="bg-white sticky top-0 z-20 border-b-[4px] border-gray-200 px-4 py-3 md:py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          
          {/* Chap tomon: Profil */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-gray-100 rounded-2xl border-2 border-gray-200 flex items-center justify-center relative shadow-sm">
              <User className="w-6 h-6 md:w-8 md:h-8 text-gray-400" />
              {/* Premium Toji */}
              {user.isPremium && (
                <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-sm border-2 border-white">
                  <Crown className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div>
              <h1 className="font-black text-gray-800 text-base md:text-xl tracking-tight leading-none">
                {user.firstName}
              </h1>
              <p className={`text-xs md:text-sm font-extrabold mt-1 ${user.isPremium ? 'text-yellow-500' : 'text-gray-400'}`}>
                {user.isPremium ? 'PRO Paydalanıwshı' : 'Ápiwayı oqıwshı'}
              </p>
            </div>
          </div>

          {/* O'ng tomon: Tangalar va Menyu */}
          <div className="flex items-center space-x-3">
            <div 
              onClick={() => !user.isPremium && onNavigate('premium')}
              className={`flex items-center space-x-1 md:space-x-2 px-3 py-2 md:px-5 md:py-3 rounded-2xl border-b-[4px] active:border-b-0 active:translate-y-1 transition-all cursor-pointer ${
                user.isPremium 
                  ? 'bg-yellow-100 border-yellow-300 text-yellow-600' 
                  : 'bg-gray-100 border-gray-200 text-gray-400'
              }`}
            >
              <Coins className="w-5 h-5 md:w-6 md:h-6" />
              <span className="font-black text-base md:text-lg">{user.isPremium ? (user.coins || 0) : 'PRO'}</span>
              {!user.isPremium && <Lock className="w-3 h-3 ml-1 md:w-4 md:h-4" />}
            </div>

            <button 
              onClick={() => setMenuOpen(!menuOpen)} 
              className="p-3 bg-gray-100 text-gray-600 rounded-2xl border-b-[4px] border-gray-200 active:border-b-0 active:translate-y-1 transition-all"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Ochiladigan menyu */}
        {menuOpen && (
          <div className="max-w-5xl mx-auto mt-4 pt-4 border-t-2 border-dashed border-gray-200 animate-in slide-in-from-top-2">
            <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 font-bold text-lg h-14 rounded-2xl">
              <LogOut className="w-5 h-5 mr-3" /> Akkaunttan shıǵıw
            </Button>
          </div>
        )}
      </header>

      {/* 🌟 ASOSIY QISM */}
      <main className="max-w-5xl mx-auto px-4 mt-8 md:mt-10">
        
        {/* PREMIUM BANNER (Qalin, yorqin, o'yinqaroq) */}
        {!user.isPremium && (
          <div 
            onClick={() => onNavigate('premium')}
            className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-[32px] p-6 mb-10 text-white shadow-sm border-b-[6px] border-orange-600 active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center">
              <div className="w-16 h-16 bg-white/20 rounded-[20px] flex items-center justify-center mr-5 backdrop-blur-sm border-2 border-white/30 group-hover:scale-110 transition-transform">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white mb-1 drop-shadow-sm">PRO Tarıyfı</h3>
                <p className="text-yellow-100 font-bold text-sm md:text-base">Sheklewsiz imkaniyatlardı ashıń!</p>
              </div>
            </div>
            <div className="bg-white/20 rounded-full p-2 backdrop-blur-sm">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
          </div>
        )}

        {/* 🌟 MENYULAR TO'RI (Minimalistik kartalar) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isLocked = item.isPremiumOnly && !user.isPremium;
            
            return (
              <button
                key={item.id}
                onClick={() => isLocked ? onNavigate('premium') : onNavigate(item.id)}
                className={`
                  relative bg-white p-5 md:p-8 rounded-[32px] border-2 border-gray-200 
                  flex flex-col items-center text-center transition-all outline-none
                  ${isLocked ? 'opacity-80 grayscale-[20%]' : 'hover:border-indigo-300'}
                  border-b-[8px] active:border-b-2 active:translate-y-[6px]
                `}
              >
                {/* Qulf ikonchasi */}
                {isLocked && (
                  <div className="absolute top-4 right-4 bg-gray-100 px-3 py-1.5 rounded-full border-2 border-gray-200 flex items-center shadow-sm">
                    <Lock className="w-3.5 h-3.5 mr-1 text-gray-500" /> 
                    <span className="text-[10px] font-black uppercase text-gray-500 tracking-wider">PRO</span>
                  </div>
                )}

                <div className={`w-20 h-20 md:w-24 md:h-24 ${item.bgColor} rounded-[24px] flex items-center justify-center mb-4 md:mb-6 border-2 border-white shadow-inner transform ${!isLocked && 'group-hover:scale-110 transition-transform'}`}>
                  <Icon className={`w-10 h-10 md:w-12 md:h-12 ${item.iconColor}`} />
                </div>
                
                <h3 className="text-lg md:text-xl font-black text-gray-800 mb-1">{item.title}</h3>
                <p className="text-xs md:text-sm font-bold text-gray-400 uppercase tracking-wider">{item.desc}</p>
              </button>
            );
          })}
        </div>

        {/* 🌟 ADMIN TUGMASI (Faqat Adminga ko'rinadi) */}
        {isAdmin && (
          <button
            onClick={() => onNavigate('admin-panel')}
            className="w-full mt-10 bg-gray-800 hover:bg-gray-700 text-white p-5 rounded-[24px] flex items-center justify-center border-b-[6px] border-gray-900 active:border-b-0 active:translate-y-[6px] transition-all"
          >
            <Settings className="w-6 h-6 text-gray-300 mr-3" />
            <span className="text-lg font-black tracking-wide">Admin Panel</span>
          </button>
        )}
        
      </main>
    </div>
  );
}
