import { useState } from 'react';
import { supabase } from '../supabase';

interface ProfileScreenProps {
  user: any;
  onUpdateUser: (updatedUser: any) => void;
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfileScreen({ user, onUpdateUser, onBack, onLogout }: ProfileScreenProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const roles = ["Student", "Abiturient", "Mektep oqıwshısı", "Oqıtıwshı"];

  const handleRoleSelect = async (selectedRole: string) => {
    setIsUpdating(true);
    
    // 1. Supabase-da foydalanuvchi rolini yangilash
    const { data, error } = await supabase
      .from('users')
      .update({ role: selectedRole }) // Bazadagi 'role' ustuniga yozadi
      .eq('phone', user.phone)
      .select()
      .single();

    if (!error && data) {
      // 2. Local holatni (state) yangilash
      const updatedUser = { ...user, role: data.role };
      onUpdateUser(updatedUser);
      
      // 3. LocalStorage-ni yangilash (refresh bo'lganda ham saqlanib qolishi uchun)
      localStorage.setItem('user', JSON.stringify(data));
      
      alert(`Sizniń rolińiz "${selectedRole}" etip saqlandı! ✅`);
    } else {
      alert("Xatolik yuz berdi, qaytadan urinib ko'ring.");
    }
    
    setIsUpdating(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans pb-10">
      {/* ... Header kodi ... */}

      <div className="px-6 mt-10">
        <h3 className="text-[#2C4A44] font-black text-lg mb-4">Siz kimsiz?</h3>
        
        {/* Rollar ro'yxati */}
        <div className="grid grid-cols-1 gap-3">
          {roles.map((role) => (
            <button
              key={role}
              disabled={isUpdating}
              onClick={() => handleRoleSelect(role)}
              className={`p-5 rounded-[28px] font-black text-sm border-b-[6px] transition-all flex items-center justify-between ${
                user.role === role 
                  ? 'bg-[#2EB8A6] text-white border-emerald-700 -translate-y-1' 
                  : 'bg-white text-[#2C4A44] border-[#E8DFCC] active:translate-y-1 active:border-b-0'
              }`}
            >
              <span>{role}</span>
              {user.role === role && <div className="w-3 h-3 bg-white rounded-full animate-pulse" />}
            </button>
          ))}
        </div>

        {isUpdating && (
          <p className="text-center text-[#2EB8A6] text-[10px] font-bold mt-4 animate-pulse">
            Maǵlıwmatlar bazaga saqlanbaqta...
          </p>
        )}
      </div>

      {/* ... Logout va boshqa tugmalar ... */}
    </div>
  );
}
