import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../supabase';
import { Sun, Loader2 } from 'lucide-react'; 

interface LoginScreenProps {
  onLogin: (user: { firstName: string; lastName: string; phone: string; coins: number; isPremium?: boolean }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isRegistering) {
        // --- REGISTRATSIYA ---
        const cleanPhone = phone.replace(/\s+/g, ''); 
        const { data, error } = await supabase
          .from('users')
          .insert([{ 
            phone: cleanPhone, 
            first_name: firstName, 
            last_name: lastName, 
            password: password,
            coins: 0, // 👈 Bonus olib tashlandi, 0 dan boshlaydi
            is_premium: false
          }])
          .select();

        if (error) throw error;

        if (data) {
          localStorage.setItem('userPhone', cleanPhone);
          onLogin({ firstName, lastName, phone: cleanPhone, coins: 0, isPremium: false }); // 👈 Bu yerda ham 0 qildik
        }
      } else {
        // --- LOGIN ---
        const cleanPhone = phone.replace(/\s+/g, '');
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', cleanPhone)
          .eq('password', password)
          .single();

        if (error || !data) {
          alert('Nádurıs parol yamasa nomer! Qaytadan kórıń.');
        } else {
          localStorage.setItem('userPhone', cleanPhone);
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
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-700"></div>
      <div className="absolute top-[20%] right-[10%] w-40 h-40 bg-green-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>

      <div className="w-full max-w-md z-10 relative">
        <div className="bg-white rounded-[40px] shadow-xl p-8 border-[3px] border-gray-100">
          
          <div className="text-center mb-10">
            <div className="inline-block relative">
              <div className="w-28 h-28 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white relative z-10 ring-4 ring-yellow-100">
                <Sun className="w-14 h-14 text-white animate-[spin_10s_linear_infinite]" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white transform rotate-12">
                BETA
              </div>
            </div>
            <h1 className="text-3xl font-black text-gray-800 mb-2 tracking-tight">
              ZIYBAN
            </h1>
            <p className="text-indigo-500 font-bold text-lg">
              Milliy sertifikatqa oyın arqalı tayyarlan!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div>
                <Label htmlFor="phone" className="text-gray-600 font-bold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Telefon nomer
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+998 90 123 45 67"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>

              {isRegistering && (
                <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-600 font-bold text-sm uppercase tracking-wider ml-4 mb-2 block">Atı</Label>
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="Atıńız"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-600 font-bold text-sm uppercase tracking-wider ml-4 mb-2 block">Familiya</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Familiyańız"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="password" className="text-gray-600 font-bold text-sm uppercase tracking-wider ml-4 mb-2 block">
                  Parol
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Parolıńız"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-lg font-bold focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 focus:bg-white transition-all placeholder:text-gray-400 text-2xl tracking-widest"
                  style={{ fontFamily: 'monospace' }} 
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className={`
                w-full h-16 text-xl font-black rounded-2xl transition-all transform
                text-white flex items-center justify-center
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
              className="text-gray-500 hover:text-indigo-600 font-bold text-sm uppercase tracking-wider transition-colors border-2 border-transparent hover:border-indigo-100 px-4 py-2 rounded-xl"
            >
              {isRegistering ? 'Mende akkaunt bar. KIRIW' : 'Jańa akkaunt ashıw'}
            </button>
          </div>
        </div>
        
        <p className="text-center text-gray-400 text-sm mt-6 font-medium">
          © 2024 ZIYBAN. Qaraqalpaqstan Respublikası.
        </p>
      </div>
    </div>
  );
}
