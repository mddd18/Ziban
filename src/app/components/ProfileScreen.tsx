import { supabase } from '../../supabase'; // ✅ Build xatosi yechimi

export default function ProfileScreen({ user, onUpdateUser, onBack, onLogout }: any) {
  const roles = ["Student", "Abiturient", "Mektep oqıwshısı", "Oqıtıwshı"];

  const handleRoleSelect = async (selectedRole: string) => {
    const { error } = await supabase.from('users').update({ role: selectedRole }).eq('phone', user.phone);
    if (!error) {
      onUpdateUser({ ...user, role: selectedRole });
      alert("Saqlandı! ✅");
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFCF9] p-6">
      <button onClick={onBack} className="mb-8 p-3 bg-white rounded-2xl border border-[#E8DFCC]">⬅️ Qaytıw</button>
      
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-[#F0EBE0] text-center">
        <div className="w-20 h-20 bg-[#E6F4F1] rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl font-black text-[#2EB8A6]">{user.firstName[0]}</span>
        </div>
        <h2 className="text-xl font-black text-[#2C4A44]">{user.firstName} {user.lastName}</h2>
        <p className="text-[#8DA6A1] font-bold text-sm">{user.phone}</p>
      </div>

      <div className="mt-10 space-y-4">
        <p className="text-[#2C4A44] font-black text-sm uppercase ml-2">Siz kimsiz?</p>
        <div className="grid grid-cols-2 gap-3">
          {roles.map((r) => (
            <button key={r} onClick={() => handleRoleSelect(r)} className={`p-4 rounded-3xl font-black text-[10px] border-b-4 transition-all ${user.role === r ? 'bg-[#2EB8A6] text-white border-emerald-700' : 'bg-white text-[#2C4A44] border-[#E8DFCC]'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      <button onClick={onLogout} className="w-full mt-12 py-5 bg-red-50 text-red-500 rounded-3xl font-black uppercase tracking-widest">Shıǵıw</button>
    </div>
  );
}
