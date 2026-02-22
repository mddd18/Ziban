import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../supabase';
import { Loader2 } from 'lucide-react'; 

// Logotipni chaqiramiz
<img 
  src="/ziban.jpg" 
  alt="Ziyban Logo" 
  className="w-full h-full object-contain"
/>

interface LoginScreenProps {
  onLogin: (user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('+998'); 
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  // Telefon raqami formati
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

    setLoading(true);
    
    try {
      if (isRegistering) {
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
    // FON: Apple uchun xos bo'lgan toza, ochiq kulrang fon (#F5F5F7)
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-blue-200">
      
      {/* KARTA: Yumshoq soya, shisha effekti va ingichka hoshiya */}
      <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-xl rounded-[2rem] shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 p-8 sm:p-10 transition-all duration-500">
        
        {/* HEADER / LOGO QISMI */}
        <div className="text-center mb-10">
          {/* Soya va ortiqcha bezaklarsiz, toza logotip */}
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-3xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] p-1 flex items-center justify-center overflow-hidden">
            <img 
              src={logoImage} 
              alt="Ziyban Logo" 
              className="w-full h-full object-contain"
              onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
            />
          </div>
          
          <h1 className="text-[28px] font-semibold text-gray-900 tracking-tight mb-2">
            ZIYBAN
          </h1>
          <p className="text-[15px] text-gray-500 font-medium">
            Milliy sertifikatqa tayyarlıq
          </p>
        </div>

        {/* FORMA */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="space-y-4">
            {/* INPUT 1: Telefon */}
            <div>
              <Label htmlFor="phone" className="sr-only">Telefon nomer</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                required
                className="w-full h-14 bg-[#F2F2F7] hover:bg-[#E5E5EA] focus:bg-white border-transparent focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 rounded-2xl px-5 text-[17px] text-gray-900 font-medium transition-all placeholder:text-gray-400 outline-none"
              />
            </div>

            {/* INPUT 2 & 3: Ism va Familiya (Faqat registratsiyada) */}
            {isRegistering && (
              <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div>
                  <Label htmlFor="firstName" className="sr-only">Atı</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Atı"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    className="w-full h-14 bg-[#F2F2F7] hover:bg-[#E5E5EA] focus:bg-white border-transparent focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 rounded-2xl px-5 text-[17px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="sr-only">Familiya</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Familiya"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    className="w-full h-14 bg-[#F2F2F7] hover:bg-[#E5E5EA] focus:bg-white border-transparent focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 rounded-2xl px-5 text-[17px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400"
                  />
                </div>
              </div>
            )}

            {/* INPUT 4: Parol */}
            <div>
              <Label htmlFor="password" className="sr-only">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="Parol"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full h-14 bg-[#F2F2F7] hover:bg-[#E5E5EA] focus:bg-white border-transparent focus:border-blue-500 focus:ring-[3px] focus:ring-blue-500/20 rounded-2xl px-5 text-[17px] text-gray-900 font-medium transition-all outline-none placeholder:text-gray-400 tracking-widest"
              />
            </div>
          </div>

          {/* ASOSIY TUGMA: Apple Blue (#007AFF) rangi va silliq UI */}
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-14 mt-2 bg-[#007AFF] hover:bg-[#0066CC] active:scale-[0.98] text-white rounded-2xl text-[17px] font-semibold transition-all shadow-[0_4px_14px_rgba(0,122,255,0.3)] disabled:opacity-50 disabled:shadow-none"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (isRegistering ? 'Dawam etiw' : 'Kiriw')}
          </Button>
        </form>

        {/* QOSHIMCHA TUGMA: Toza matn ko'rinishida */}
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegistering(!isRegistering);
              setPassword('');
            }}
            className="text-[#007AFF] hover:text-[#0056B3] text-[15px] font-medium transition-colors"
          >
            {isRegistering ? 'Mende akkaunt bar. Kiriw' : 'Jańa akkaunt ashıw'}
          </button>
        </div>
        
      </div>

      {/* FOOTER TEXT */}
      <div className="absolute bottom-8 text-center w-full text-[13px] text-gray-400 font-medium">
        ZIYBAN © {new Date().getFullYear()}
      </div>
    </div>
  );
}
