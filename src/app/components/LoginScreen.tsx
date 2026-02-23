import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../supabase';
import { Loader2, GraduationCap, School, BookOpen, Target, Sparkles } from 'lucide-react';

export default function LoginScreen({ onLogin }: any) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegistering && !selectedRole) {
      alert("Iltimas, kimsiz ekenińizdi belgileń!");
      return;
    }

    setLoading(true);
    try {
      if (isRegistering) {
        const { data, error } = await supabase
          .from('users')
          .insert([{ 
            phone, 
            first_name: firstName, 
            last_name: lastName, 
            password,
            role: selectedRole, // ✅ Tanlangan rol bazaga yuboriladi
            coins: 0,
            is_premium: false 
          }])
          .select().single();

        if (error) throw error;
        onLogin(data);
      } else {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('phone', phone)
          .eq('password', password)
          .maybeSingle();

        if (error || !data) alert("Nádurıs parol yamasa nomer!");
        else onLogin(data);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] flex items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md bg-white rounded-[45px] shadow-xl p-10 border border-[#F0EBE0]">
        
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#F5EEDC] rounded-[28px] mx-auto mb-4 flex items-center justify-center shadow-inner">
            <img src="/ziban.jpg" alt="Logo" className="w-14 h-14 object-contain rounded-xl" />
          </div>
          <h1 className="text-3xl font-black text-[#2C4A44]">ZIYBAN</h1>
          <p className="text-[#8DA6A1] font-bold text-[10px] uppercase tracking-[0.2em] mt-2">
            {isRegistering ? 'Dizimnen ótiw' : 'Kiriw'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Telefon va Parol har doim ko'rinadi */}
          <div className="space-y-4">
            <Input 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="h-14 rounded-2xl border-2 border-[#F0EBE0] bg-[#FDFCF9] font-black text-center" 
            />

            {isRegistering && (
              <div className="space-y-4 animate-in fade-in duration-500">
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="Atıńız" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-14 rounded-2xl border-2 border-[#F0EBE0] font-bold" />
                  <Input placeholder="Familiya" value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-14 rounded-2xl border-2 border-[#F0EBE0] font-bold" />
                </div>

                {/* 🎓 ROL TANLASH BO'LIMI */}
                <div className="space-y-3">
                  <p className="text-[#2C4A44] font-black text-[10px] uppercase tracking-widest ml-2">Siz kimsiz?</p>
                  <div className="grid grid-cols-2 gap-2">
                    {roles.map((role) => (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                          selectedRole === role.name 
                            ? 'bg-[#2EB8A6] border-[#2EB8A6] text-white shadow-lg shadow-emerald-100' 
                            : 'bg-[#FDFCF9] border-[#F0EBE0] text-[#8DA6A1]'
                        }`}
                      >
                        {role.icon}
                        <span className="text-[9px] font-black uppercase tracking-tighter">{role.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <Input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="Parol"
              className="h-14 rounded-2xl border-2 border-[#F0EBE0] bg-[#FDFCF9] text-center font-black tracking-widest" 
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-16 bg-[#2EB8A6] text-white rounded-2xl font-black text-lg border-b-4 border-emerald-800 active:border-b-0 active:translate-y-1 transition-all mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isRegistering ? 'BASLAW' : 'KIRIW')}
          </Button>
        </form>

        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="w-full mt-6 text-[#8DA6A1] font-black text-[10px] uppercase tracking-[0.2em]"
        >
          {isRegistering ? 'Akkaunt bar? Kiriw' : 'Jańa akkaunt ashıw'}
        </button>
      </div>
    </div>
  );
}
