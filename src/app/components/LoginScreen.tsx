import { useState } from 'react';
import { supabase } from '../../supabase';
import { Loader2, GraduationCap, School, BookOpen, Target } from 'lucide-react'; 

interface LoginScreenProps {
  onLogin: (user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean; role?: string }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('+998'); 
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState(''); // ✅ Rol tanlash uchun state
  const [loading, setLoading] = useState(false);

  // Rollar ro'yxati
  const roles = [
    { id: 'Student', name: 'Student', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'Abiturient', name: 'Abiturient', icon: <Target className="w-5 h-5" /> },
    { id: 'Oqiwshi', name: 'Oqıwshı', icon: <School className="w-5 h-5" /> },
    { id: 'Oqitiwshi', name: 'Oqıtıwshı', icon: <BookOpen className="w-5 h-5" /> },
  ];

  // Telefon raqamini to'g'ri kiritishni nazorat qilish
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    if (input.length < 4 || !input.startsWith('+998')) {
      setPhone('+998');
      return;
    }
    
    const numbersOnly = input.slice(4).replace(/[^0-9]/g, '');
    
    if (numbersOnly.length <= 9) {
      setPhone('+998' + numbersOnly);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 13) {
      alert("Nomer toliq kiritilmedi! (+998 hám 9 ta raqam)");
      return;
    }

    // ✅ Agar registratsiya bo'lsa va rol tanlanmagan bo'lsa
    if (isRegistering && !selectedRole) {
      alert("Iltimas, kimsiz ekenińizdi belgileń!");
      return;
    }

    setLoading(true);
    
    try {
      if (isRegistering) {
        // REGISTRATSIYA
        const { data, error } = await supabase
          .from('users')
          .insert([{ 
            phone: phone, 
            first_name: firstName, 
            last_name: lastName, 
            password: password,
            role: selectedRole, // ✅ Tanlangan rol bazaga saqlanadi
            coins: 0,
            is_premium: false
          }])
          .select()
          .single(); // ✅ Array o'rniga bitta obyekt qaytaradi

        if (error) throw error;

        if (data) {
          localStorage.setItem('userPhone', phone);
          onLogin({ 
            firstName, 
            lastName, 
            phone: phone, 
            coins: 0, 
            isPremium: false,
            role: selectedRole 
          });
        }
      } else {
        // LOGIN
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .eq('password', password)
          .single();

        if (error || !data) {
          alert('Nádurıs parol yamasa nomer! Qaytadan kórıń.');
        } else {
          localStorage.setItem('userPhone', phone);
          onLogin({ 
            firstName: data.first_name, 
            lastName: data.last_name, 
            phone: data.phone, 
            coins: data.coins || 0,
            isPremium: data.is_premium || false,
            role: data.role // ✅ Rolni bazadan olamiz
          });
        }
      }
    } catch (error: any) {
      console.error("Xatolik:", error.message);
      alert("Xatolik yuz berdi: " + (error.message.includes("unique") ? "Bul nomer aldınnan dizimnen ótken." : error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden" 
      style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
    >
      {/* Orqa fondagi xira sharlar */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 relative mt-10">
        <div className="bg-white rounded-[40px] shadow-xl p-8 sm:p-10 border-[3px] border-gray-100">
          
          <div className="text-center mb-10">
            <div className="w-28 h-28 bg-white rounded-[28px] mx-auto mb-6 shadow-sm border border-gray-100 relative z-10 overflow-hidden flex items-center justify-center p-2">
              <img 
                src="/ziban.jpg" 
                alt="Ziyban Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            
            <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
              ZIYBAN
            </h1>
            <p className="text-indigo-500 font-bold text-lg leading-snug px-4">
              Milliy sertifikatqa biz menen birgelikte tayarlanıń
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <label htmlFor="phone" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Telefon nomer
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="w-full h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-xl font-bold text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all tracking-wider outline-none"
                />
              </div>

              {isRegistering && (
                <div className="space-y-5 animate-in slide-in-from-top-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Atı</label>
                      <input
                        id="firstName"
                        type="text"
                        placeholder="Atıńız"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                        className="w-full h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Familiya</label>
                      <input
                        id="lastName"
                        type="text"
                        placeholder="Familiyańız"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                        className="w-full h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all outline-none"
                      />
                    </div>
                  </div>

                  {/* 🎓 ROL TANLASH BO'LIMI */}
                  <div className="bg-gray-50 p-4 rounded-3xl border-2 border-gray-100">
                    <label className="text-gray-600 font-extrabold text-sm uppercase tracking-wider mb-3 block text-center">Siz kimsiz?</label>
                    <div className="grid grid-cols-2 gap-3">
                      {roles.map((role) => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => setSelectedRole(role.name)}
                          className={`flex flex-col items-center justify-center p-3 rounded-2xl border-[3px] transition-all transform active:translate-y-1 gap-2 ${
                            selectedRole === role.name 
                              ? 'bg-green-100 border-green-500 text-green-700 shadow-sm' 
                              : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                          }`}
                        >
                          {role.icon}
                          <span className="text-[11px] font-black uppercase tracking-tight">{role.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="password" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Parol
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-2xl font-bold text-gray-800 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all tracking-widest text-center outline-none"
                />
              </div>
            </div>

            {/* DUOLINGO TUGMASI (Qalin ostki hoshiya bilan) */}
            <button 
              type="submit" 
              disabled={loading}
              className={`
                w-full h-16 text-xl font-black rounded-2xl transition-all transform
                text-white flex items-center justify-center tracking-wide
                border-b-[6px] active:border-b-0 active:translate-y-[6px]
                disabled:opacity-70 disabled:cursor-not-allowed
                ${isRegistering 
                  ? 'bg-green-500 border-green-700 hover:bg-green-400'  
                  : 'bg-indigo-500 border-indigo-700 hover:bg-indigo-400' 
                }
              `}
            >
              {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (isRegistering ? 'BASLAW! 🚀' : 'KIRIW')}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => { setIsRegistering(!isRegistering); setPassword(''); setSelectedRole(''); }}
              className="text-gray-500 hover:text-indigo-600 font-extrabold text-sm uppercase tracking-wider transition-colors border-2 border-transparent hover:border-indigo-100 px-4 py-2 rounded-xl"
            >
              {isRegistering ? 'Mende akkaunt bar. KIRIW' : 'Jańa akkaunt ashıw'}
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6 font-bold">
          © 2026 ZIYBAN. Qaraqalpaqstan Respublikası.
        </p>
      </div>
    </div>
  );
}
