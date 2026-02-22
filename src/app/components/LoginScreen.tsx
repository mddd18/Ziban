import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../supabase';
import { Loader2 } from 'lucide-react'; 

interface LoginScreenProps {
  onLogin: (user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  // 👈 Default holatda +998 turadi
  const [phone, setPhone] = useState('+998'); 
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // 📞 Telefon raqamini to'g'ri kiritishni nazorat qiluvchi funksiya
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    
    // Agar +998 ni o'chirib yubormoqchi bo'lsa, qaytarib qo'yamiz
    if (input.length < 4 || !input.startsWith('+998')) {
      setPhone('+998');
      return;
    }
    
    // Faqatgina raqamlarni (0-9) qoldiramiz va bo'shliqlarni olib tashlaymiz
    const numbersOnly = input.slice(4).replace(/[^0-9]/g, '');
    
    // Telefon raqam uzunligini cheklaymiz (+998 dan keyin faqat 9 ta raqam)
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

    setLoading(true);
    
    try {
      if (isRegistering) {
        // --- REGISTRATSIYA ---
        const { data, error } = await supabase
          .from('users')
          .insert([{ 
            phone: phone, 
            first_name: firstName, 
            last_name: lastName, 
            password: password,
            coins: 0,
            is_premium: false
          }])
          .select();

        if (error) throw error;

        if (data) {
          localStorage.setItem('userPhone', phone);
          onLogin({ firstName, lastName, phone: phone, coins: 0, isPremium: false });
        }
      } else {
        // --- LOGIN ---
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
            isPremium: data.is_premium || false
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
    // 🔤 Shriftni 'Nunito' (yumaloq va chiroyli) shriftiga moslashtiramiz
    <div 
      className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden" 
      style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}
    >
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-[20%] right-[10%] w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-white rounded-[40px] shadow-xl p-8 border-[3px] border-gray-100">
          
          <div className="text-center mb-10">
            {/* 🖼 SIZNING LOGOTIPINGIZ */}
            <div className="w-28 h-28 bg-white rounded-[28px] mx-auto mb-6 shadow-md border border-gray-100 relative z-10 overflow-hidden flex items-center justify-center p-2">
              <img 
                src="/ziban.jpg" 
                alt="Ziyban Logo" 
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Agar rasm topilmasa, vaqtinchalik xabar chiqadi
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
            
            <h1 className="text-4xl font-black text-gray-800 mb-3 tracking-tight">
              ZIYBAN
            </h1>
            {/* 📝 YANGILANGAN TEKST */}
            <p className="text-indigo-500 font-bold text-lg leading-snug px-4">
              Milliy sertifikatqa biz menen birgelikte tayarlanıń
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <Label htmlFor="phone" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Telefon nomer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={handlePhoneChange}
                  required
                  className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-xl font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all tracking-wider"
                />
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Atı</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Atıńız"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Familiya</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Familiyańız"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="password" className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Parol
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-2xl font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all tracking-widest text-center"
                />
              </div>
            </div>

            <Button 
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
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-gray-500 hover:text-indigo-600 font-extrabold text-sm uppercase tracking-wider transition-colors border-2 border-transparent hover:border-indigo-100 px-4 py-2 rounded-xl"
            >
              {isRegistering ? 'Mende akkaunt bar. KIRIW' : 'Jańa akkaunt ashıw'}
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6 font-bold">
          © 2024 ZIYBAN. Qaraqalpaqstan Respublikası.
        </p>
      </div>
    </div>
  );
}
