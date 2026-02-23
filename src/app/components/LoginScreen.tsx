import { useState } from 'react';
import { supabase } from '../../supabase';
import { Loader2, GraduationCap, School, BookOpen, Target, ArrowLeft, MessageSquare } from 'lucide-react'; 

export default function LoginScreen({ onLogin }: any) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [step, setStep] = useState(1); // 1 = Forma, 2 = SMS Kod kiritish
  
  const [phone, setPhone] = useState('+998'); 
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  
  const [generatedCode, setGeneratedCode] = useState(''); // Biz yaratgan 4 xonali kod
  const [enteredCode, setEnteredCode] = useState(''); // Foydalanuvchi yozgan kod
  const [loading, setLoading] = useState(false);

  const roles = [
    { id: 'Student', name: 'Student', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'Abiturient', name: 'Abiturient', icon: <Target className="w-5 h-5" /> },
    { id: 'Oqiwshi', name: 'Oqıwshı', icon: <School className="w-5 h-5" /> },
    { id: 'Oqitiwshi', name: 'Oqıtıwshı', icon: <BookOpen className="w-5 h-5" /> },
  ];

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let input = e.target.value;
    if (input.length < 4 || !input.startsWith('+998')) { setPhone('+998'); return; }
    const numbersOnly = input.slice(4).replace(/[^0-9]/g, '');
    if (numbersOnly.length <= 9) setPhone('+998' + numbersOnly);
  };

  // 📝 1-QADAM: FORMANI YUBORISH VA SMS JO'NATISH
  const handleInitialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length !== 13) return alert("Nomer tolıq kiritilmedi! (+998 hám 9 ta raqam)");
    
    setLoading(true);
    try {
      if (isRegistering) {
        if (!selectedRole) { setLoading(false); return alert("Iltimas, kimsiz ekenińizdi belgileń!"); }

        // BAZADA BORLIGINI TEKSHIRISH (SMS bekorga ketmasligi uchun)
        const { data: existingUser } = await supabase.from('users').select('phone').eq('phone', phone).maybeSingle();
        if (existingUser) { setLoading(false); return alert("Bul nomer aldınnan dizimnen ótken! Kiriw bólimine ótiń."); }

        // 4 xonali tasodifiy kod yaratamiz
        const code = Math.floor(1000 + Math.random() * 9000).toString();
        setGeneratedCode(code);

        // 🚀 TAYYOR API'GA SMS JO'NATISH
        const cleanPhone = phone.replace('+', ''); // Odatda SMS gateway'lar + siz qabul qiladi (99890...)
        const smsResponse = await fetch('https://test.regofis.uz/api/getsms/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            phone: cleanPhone,
            text: `Ziyban: Tastıyıqlaw kodińiz - ${code}`
          })
        });

        if (!smsResponse.ok) {
          throw new Error("SMS jo'natishda xatolik yuz berdi. Internetni tekshiring.");
        }
        
        // SMS jo'natildi, endi 2-qadamga (kod kiritishga) o'tamiz
        setStep(2);
      } else {
        // LOGIN QILISH (Bunda SMS shart emas)
        const { data, error } = await supabase.from('users').select('*').eq('phone', phone).eq('password', password).single();
        if (error || !data) alert('Nádurıs parol yamasa nomer! Qaytadan kórıń.');
        else {
          localStorage.setItem('userPhone', phone);
          onLogin({ firstName: data.first_name, lastName: data.last_name, phone: data.phone, coins: data.coins || 0, isPremium: data.is_premium || false, role: data.role });
        }
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 💬 2-QADAM: SMS KODNI TEKSHIRISH VA BAZAGA SAQLASH
  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Foydalanuvchi kiritgan kod biz yaratgan kodga tengmi?
    if (enteredCode !== generatedCode) {
      return alert("Kod qáte! Qaytadan kiritip kóriń.");
    }

    setLoading(true);
    try {
      // Kod to'g'ri! Endi ro'yxatdan o'tkazamiz
      const { data, error } = await supabase.from('users').insert([{ 
        phone: phone, first_name: firstName, last_name: lastName, password: password, role: selectedRole, coins: 0, is_premium: false
      }]).select().single();

      if (error) throw error;

      localStorage.setItem('userPhone', phone);
      alert("Tastıyıqlandı! 🎉 Akkaunt tabıslı jaratıldı.");
      onLogin({ firstName, lastName, phone: phone, coins: 0, isPremium: false, role: selectedRole });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] flex items-center justify-center p-4 relative overflow-hidden" style={{ fontFamily: '"Nunito", "Quicksand", sans-serif' }}>
      
      {/* Fon effektlari */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-400/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <div className="w-full max-w-md z-10 relative mt-10">
        <div className="bg-white rounded-[40px] shadow-xl p-8 sm:p-10 border-[3px] border-gray-100">
          
          {step === 1 ? (
            // ================= 1-QADAM: ASOSIY FORMA =================
            <>
              <div className="text-center mb-10">
                <div className="w-24 h-24 bg-white rounded-[28px] mx-auto mb-6 shadow-sm border border-gray-100 relative z-10 overflow-hidden flex items-center justify-center p-2">
                  <img src="/ziban.jpg" alt="Logo" className="w-full h-full object-contain" />
                </div>
                <h1 className="text-4xl font-black text-gray-800 mb-2 tracking-tight">ZIYBAN</h1>
                <p className="text-indigo-500 font-bold text-sm uppercase tracking-widest">{isRegistering ? 'Dizimnen ótiw' : 'Kiriw'}</p>
              </div>

              <form onSubmit={handleInitialSubmit} className="space-y-6">
                <div className="space-y-5">
                  <div>
                    <label className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Telefon nomer</label>
                    <input type="tel" value={phone} onChange={handlePhoneChange} required className="w-full h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-xl font-bold text-center tracking-wider outline-none focus:border-indigo-500" />
                  </div>
                  
                  {isRegistering && (
                    <div className="space-y-5 animate-in slide-in-from-top-4">
                      <div className="grid grid-cols-2 gap-4">
                        <input type="text" placeholder="Atıńız" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-full h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 font-bold focus:border-indigo-500 outline-none" />
                        <input type="text" placeholder="Familiya" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-full h-14 px-5 rounded-2xl border-2 border-gray-300 bg-gray-50 font-bold focus:border-indigo-500 outline-none" />
                      </div>

                      {/* ROL TANLASH */}
                      <div className="bg-gray-50 p-4 rounded-3xl border-2 border-gray-100">
                        <label className="text-gray-600 font-extrabold text-[10px] uppercase tracking-wider mb-3 block text-center">Siz kimsiz?</label>
                        <div className="grid grid-cols-2 gap-3">
                          {roles.map((r) => (
                            <button key={r.id} type="button" onClick={() => setSelectedRole(r.name)} className={`flex flex-col items-center justify-center p-3 rounded-2xl border-[3px] transition-all transform active:translate-y-1 gap-2 ${selectedRole === r.name ? 'bg-green-100 border-green-500 text-green-700' : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                              {r.icon}
                              <span className="text-[10px] font-black uppercase tracking-tight">{r.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="text-gray-600 font-extrabold text-sm uppercase tracking-wider ml-4 mb-2 block">Parol</label>
                    <input type="password" placeholder="********" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full h-14 px-6 rounded-2xl border-2 border-gray-300 bg-gray-50 text-xl font-bold tracking-widest text-center outline-none focus:border-indigo-500" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className={`w-full h-16 text-xl font-black rounded-2xl transition-all transform text-white flex items-center justify-center border-b-[6px] active:border-b-0 active:translate-y-[6px] disabled:opacity-70 ${isRegistering ? 'bg-green-500 border-green-700' : 'bg-indigo-500 border-indigo-700'}`}>
                  {loading ? <Loader2 className="w-8 h-8 animate-spin" /> : (isRegistering ? 'DAVAM ETIW' : 'KIRIW')}
                </button>
              </form>
              
              <button type="button" onClick={() => { setIsRegistering(!isRegistering); setPassword(''); setSelectedRole(''); }} className="w-full mt-8 text-gray-500 font-extrabold text-[10px] uppercase tracking-[0.2em] text-center hover:text-indigo-600 transition-colors">
                {isRegistering ? 'Mende akkaunt bar. KIRIW' : 'Jańa akkaunt ashıw'}
              </button>
            </>
          ) : (
            // ================= 2-QADAM: SMS KOD KUTISH EKRANI =================
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <button onClick={() => setStep(1)} className="p-2 bg-gray-100 rounded-xl text-gray-500 mb-6 active:scale-95 hover:bg-gray-200 transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-indigo-50 rounded-full mx-auto mb-4 flex items-center justify-center border-4 border-indigo-100">
                  <MessageSquare className="w-8 h-8 text-indigo-500" />
                </div>
                <h2 className="text-2xl font-black text-gray-800 mb-2">Tastıyıqlaw</h2>
                <p className="text-sm font-bold text-gray-500 leading-relaxed">
                  <span className="text-indigo-600">{phone}</span> nomerine 4 xanalı SMS kod jiberildi.
                </p>
              </div>

              <form onSubmit={handleVerifyOTP} className="space-y-6">
                <input 
                  type="number" 
                  placeholder="- - - -" 
                  value={enteredCode} 
                  onChange={(e) => setEnteredCode(e.target.value.slice(0, 4))} 
                  className="w-full h-20 rounded-3xl border-2 border-indigo-200 bg-indigo-50 text-4xl font-black text-center tracking-[0.5em] text-indigo-700 focus:border-indigo-500 outline-none" 
                  autoFocus 
                />
                
                <button type="submit" disabled={loading || enteredCode.length < 4} className="w-full h-16 text-xl font-black rounded-2xl bg-indigo-500 border-indigo-700 text-white border-b-[6px] active:border-b-0 active:translate-y-[6px] transition-all flex items-center justify-center disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" /> : 'TASTIYIQLAW 🚀'}
                </button>
              </form>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}
