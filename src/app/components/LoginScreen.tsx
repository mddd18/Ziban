import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';

interface LoginScreenProps {
  onLogin: (user: { firstName: string; lastName: string; phone: string; coins: number }) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Registration
      localStorage.setItem(`user_${phone}`, JSON.stringify({ firstName, lastName, password }));
      onLogin({ firstName, lastName, phone, coins: 0 });
    } else {
      // Login
      const userData = localStorage.getItem(`user_${phone}`);
      if (userData) {
        const { firstName, lastName, password: storedPassword } = JSON.parse(userData);
        if (password === storedPassword) {
          // Get coins from user data or default to 0
          const storedUser = localStorage.getItem('user');
          const coins = storedUser ? JSON.parse(storedUser).coins || 0 : 0;
          onLogin({ firstName, lastName, phone, coins });
        } else {
          alert('Nádurıs parol!');
        }
      } else {
        alert('Paydalanıwshı tabılmadı!');
      }
    }
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
              Qaraqalpaq tili sertifikası
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
              className="w-full bg-indigo-600 hover:bg-indigo-700"
            >
              {isRegistering ? 'Dizimnen ótiw' : 'Kiriw'}
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