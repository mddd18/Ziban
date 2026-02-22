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

  // Telefon formati (+998 va 9 ta raqam)
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
    // Apple tizim shriftlari va #F5F5F7 fon
    <div 
      className="min-h-screen bg-[#F5F5F7] flex items-center justify-center p-4 selection:bg-[#007AFF] selection:text-white"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Roboto, Helvetica, Arial, sans-serif' }}
    >
      {/* Karta: Mutlaqo toza, nozik soya bilan */}
      <div className="w-full max-w-[400px] bg-white rounded-[28px] p-8 md:p-10 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        
        {/* Apple uslubidagi Sarlavha */}
        <div className="flex flex-col items-center mb-10 text-center">
          <div className="w-[72px] h-[72px] mb-5 rounded-2xl overflow-hidden shadow-sm border border-gray-100 p-1">
            <img 
              src="/ziban.jpg" 
              alt="Ziyban Logo" 
              className="w-full h-full object-contain rounded-xl"
            />
          </div>
          <h1 className="text-[26px] font-semibold text-[#1D1D1F] tracking-tight mb-1">
            Ziyban
          </h1>
          <p className="text-[15px] text-[#86868B]">
            Milliy sertifikatqa tayyarlıq
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
             {/* Inputlar: Apple'ning klassik och-kulrang foni (#F2F2F7), silliq outline */}
             <input
               type="tel"
               value={phone}
               onChange={handlePhoneChange}
               placeholder="Telefon nomer"
               required
               className="w-full h-[52px] bg-[#F2F2F7] focus:bg-white border focus:border-[#007AFF] border-transparent rounded-[14px] px-4 text-[17px] text-[#1D1D1F] outline-none transition-colors placeholder-[#86868B]"
             />

             {isRegistering && (
                <div className="flex gap-3 animate-in fade-in duration-300">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Atı"
                    required
                    className="w-full h-[52px] bg-[#F2F2F7] focus:bg-white border focus:border-[#007AFF] border-transparent rounded-[14px] px-4 text-[17px] text-[#1D1D1F] outline-none transition-colors placeholder-[#86868B]"
                  />
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Familiya"
                    required
                    className="w-full h-[52px] bg-[#F2F2F7] focus:bg-white border focus:border-[#007AFF] border-transparent rounded-[14px] px-4 text-[17px] text-[#1D1D1F] outline-none transition-colors placeholder-[#86868B]"
                  />
                </div>
             )}

             <input
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               placeholder="Parol"
               required
               className="w-full h-[52px] bg-[#F2F2F7] focus:bg-white border focus:border-[#007AFF] border-transparent rounded-[14px] px-4 text-[17px] text-[#1D1D1F] outline-none transition-colors placeholder-[#86868B] tracking-wide"
             />
          </div>

          {/* Tugma: Apple Blue, silliq bosilish effekti, ortiqcha chiziqlarsiz */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-[52px] mt-2 bg-[#007AFF] hover:bg-[#0066CC] active:scale-[0.98] text-white rounded-[14px] text-[17px] font-semibold transition-all flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Dawam etiw' : 'Kiriw')}
          </button>
        </form>

        {/* Qo'shimcha havolalar */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => { setIsRegistering(!isRegistering); setPassword(''); }}
            className="text-[#007AFF] text-[15px] hover:underline"
          >
            {isRegistering ? 'Mende akkaunt bar. Kiriw' : 'Jańa akkaunt ashıw'}
          </button>
        </div>
        
      </div>
    </div>
  );
}
