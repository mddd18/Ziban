import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { supabase } from '../../supabase';

// 👈 interface ga isPremium ni qo'shdik
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
    
    if (isRegistering) {
      // 1. SUPABASE GA YANGI FOYDALANUVCHINI QO'SHISH (Registration)
      const { data, error } = await supabase
        .from('users')
        .insert([{ 
          phone: phone, 
          first_name: firstName, 
          last_name: lastName, 
          password: password,
          coins: 0,
          is_premium: false // Yangi ro'yxatdan o'tganlar tekin tarifda bo'ladi
        }])
        .select();

      if (error) {
        alert("Xatolik! Bul nomer aldınnan dizimnen ótken bolıwı múmkin.");
        console.error(error);
      } else if (data) {
        localStorage.setItem('userPhone', phone);
        onLogin({ firstName, lastName, phone, coins: 0, isPremium: false });
      }
    } else {
      // 2. SUPABASE DAN FOYDALANUVCHINI QIDIRISH (Login)
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
        
        // 🌟 MANA SHU YERDA PRO STATUSINI HAM QO'SHDIK 🌟
        onLogin({ 
          firstName: data.first_name, 
          lastName: data.last_name, 
          phone: data.phone, 
          coins: data.coins || 0,
          isPremium: data.is_premium || false // Bazadan PRO statusni tortadi
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" strokeWidth="2" />
                <circle cx="12" cy="12" r="4" strokeWidth="2" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Qaraqalpaq tili sertifikatı
            </h1>
            <p className="text-indigo-600 font-semibold text-lg">
              Ilim - bul tákirarlaw!
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone">Telefon raqam</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+998 90 123 45 67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {isRegistering && (
              <>
                <div>
                  <Label htmlFor="firstName">Atı</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Atıńızdı kiritiń"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="lastName">Familiası</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Familıańızdı kiritiń"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}

            <div>
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type="password"
                placeholder="Parolıńızdı kiritiń"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {loading ? 'Kútiń...' : (isRegistering ? 'Dizimnen ótiw' : 'Kiriw')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              {isRegistering ? 'Aldınnan dizimnen ótkensiz be? Kiriń' : 'Dizimnen ótiw'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
