import { useState } from 'react';
import { supabase } from '../../supabase';
import { Loader2 } from 'lucide-react'; 

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
          alert('Nádurıs parol yamasa nomer!');
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
      alert("Xatolik yuz berdi: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    // FON: O'ta yorqin sariq rang va qora selection effekti
    <div className="min-h-screen bg-[#FFC900] flex items-center justify-center p-4 selection:bg-black selection:text-white font-sans">
      
      {/* KARTA: Qalin qora hoshiya va qattiq blokli soya */}
      <div className="w-full max-w-[420px] bg-white border-4 border-black p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] rounded-2xl relative">
        
        {/* Dekorativ element (yulduzcha) */}
        <div className="absolute -top-4 -right-4 bg-[#FF90E8] border-4 border-black w-12 h-12 rounded-full flex items-center justify-center shadow-[4px_4px_0_0_rgba(0,0,0,1)] z-10 transform rotate-12">
          <span className="font-black text-xl">✨</span>
        </div>

        {/* LOGO QISMI */}
        <div className="flex flex-col items-center mb-8 text-center mt-2">
          <div className="w-24 h-24 mb-6 bg-white border-4 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)] p-2 rounded-xl flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
            <img 
              src="/ziban.jpg" 
              alt="Ziyban Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter mb-2 transform skew-x-[-5deg]">
            Ziyban
          </h1>
          <p className="text-sm font-bold bg-[#A6FAEB] text-black px-3 py-1 border-2 border-black inline-block rounded-md uppercase tracking-wider shadow-[2px_2px_0_0_rgba(0,0,0,1)]">
            Milliy sertifikat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
             {/* INPUT 1: Qalin hoshiya, bosganda qattiq soya yo'qoladi va ichkariga kiradi */}
             <div className="relative">
               <label className="absolute -top-3 left-4 bg-[#FF4911] text-white px-2 py-0.5 text-xs font-black uppercase border-2 border-black rounded-md z-10">
                 Telefon
               </label>
               <input
                 type="tel"
                 value={phone}
                 onChange={handlePhoneChange}
                 required
                 className="w-full h-14 bg-white focus:bg-[#FFFDF8] border-4 border-black rounded-xl px-4 text-xl font-bold text-black outline-none transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
               />
             </div>

             {isRegistering && (
                <div className="flex gap-4 animate-in slide-in-from-top-4 duration-300">
                  <div className="relative w-full">
                    <label className="absolute -top-3 left-3 bg-[#B28DFF] text-white px-2 py-0.5 text-xs font-black uppercase border-2 border-black rounded-md z-10">
                      Atı
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full h-14 bg-white focus:bg-[#FFFDF8] border-4 border-black rounded-xl px-4 text-lg font-bold text-black outline-none transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
                    />
                  </div>
                  <div className="relative w-full">
                    <label className="absolute -top-3 left-3 bg-[#B28DFF] text-white px-2 py-0.5 text-xs font-black uppercase border-2 border-black rounded-md z-10">
                      Familiya
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full h-14 bg-white focus:bg-[#FFFDF8] border-4 border-black rounded-xl px-4 text-lg font-bold text-black outline-none transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none"
                    />
                  </div>
                </div>
             )}

             <div className="relative">
               <label className="absolute -top-3 left-4 bg-[#00C2FF] text-black px-2 py-0.5 text-xs font-black uppercase border-2 border-black rounded-md z-10">
                 Parol
               </label>
               <input
                 type="password"
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 required
                 className="w-full h-14 bg-white focus:bg-[#FFFDF8] border-4 border-black rounded-xl px-4 text-2xl font-black text-black outline-none transition-all shadow-[4px_4px_0_0_rgba(0,0,0,1)] focus:translate-x-1 focus:translate-y-1 focus:shadow-none tracking-[0.2em]"
               />
             </div>
          </div>

          {/* ASOSIY TUGMA: O'ta baqiruvchi va interaktiv */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full h-16 mt-4 border-4 border-black rounded-xl text-xl font-black uppercase tracking-widest transition-all flex items-center justify-center shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none disabled:opacity-50 disabled:translate-x-0 disabled:translate-y-0 disabled:shadow-[6px_6px_0_0_rgba(0,0,0,1)]
              ${isRegistering ? 'bg-[#00E59B] hover:bg-[#00c786] text-black' : 'bg-black text-white hover:bg-gray-800'}
            `}
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin text-white" /> : (isRegistering ? 'BASLAW! 🚀' : 'KIRIW')}
          </button>
        </form>

        {/* QOSHIMCHA TUGMA */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setPassword(''); }}
            className="text-black text-sm font-bold uppercase underline decoration-4 decoration-[#FFC900] hover:bg-[#FFC900] px-2 py-1 transition-all"
          >
            {isRegistering ? 'Mende akkaunt bar. Kiriw' : 'Jańa akkaunt ashıw'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
