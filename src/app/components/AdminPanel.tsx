import { useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle, Crown, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  // 📚 Kitob yuklash uchun state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loadingBook, setLoadingBook] = useState(false);

  // 💎 Premium berish uchun state
  const [premiumPhone, setPremiumPhone] = useState('');
  const [loadingPremium, setLoadingPremium] = useState(false);

  // Xabarlar uchun
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // --- 1. KITOB YUKLASH FUNKSIYASI ---
  const handleUploadBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setMessage({ type: 'error', text: 'Kitap atı hám fayldı saylań!' });
      return;
    }

    setLoadingBook(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      const { error: uploadError } = await supabase.storage.from('books').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('books').getPublicUrl(filePath);

      const { error: dbError } = await supabase.from('literatures').insert([{
        title: title,
        description: description,
        file_url: publicUrl,
        type: file.type.includes('pdf') ? 'PDF' : 'DOC',
        pages: 0,
        color: 'from-blue-500 to-indigo-500' 
      }]);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Kitap tabıslı júklendi!' });
      setTitle(''); setDescription(''); setFile(null);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Xatolik: ' + error.message });
    } finally {
      setLoadingBook(false);
    }
  };

  // --- 2. PREMIUM BERISH FUNKSIYASI ---
  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!premiumPhone) {
      setMessage({ type: 'error', text: 'Paydalanıwshı telefon nomerin kiritiń!' });
      return;
    }

    setLoadingPremium(true);
    setMessage(null);

    try {
      const oneMonthLater = new Date();
      oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

      const { data, error } = await supabase
        .from('users')
        .update({ is_premium: true, premium_until: oneMonthLater.toISOString() })
        .eq('phone', premiumPhone)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        setMessage({ type: 'success', text: `Tabıslı! ${premiumPhone} nomerine 1 aylıq PRO tarıyfı berildi! 👑` });
        setPremiumPhone('');
      } else {
        setMessage({ type: 'error', text: 'Bul telefon nomeri bazada tabılmadı. Nomerdi toǵrı kiritiń.' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi: ' + error.message });
    } finally {
      setLoadingPremium(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-indigo-900 shadow-md sticky top-0 z-10 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        {/* Xabar chiqadigan joy */}
        {message && (
          <div className={`p-4 rounded-xl flex items-center font-medium shadow-sm ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}>
            {message.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertCircle className="w-6 h-6 mr-3" />}
            {message.text}
          </div>
        )}

        {/* =========================================
            1. PREMIUM BERISH BO'LIMI (YANGI)
        ========================================= */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-yellow-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-50 rounded-bl-full -z-10"></div>
          
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center mr-4 shadow-md">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">PRO Tarıyfın beriw</h2>
              <p className="text-gray-500 text-sm">Oqıwshınıń telefon nomerin kiritip 1 aylıq premium yoqıń</p>
            </div>
          </div>

          <form onSubmit={handleGrantPremium} className="flex gap-4">
            <input 
              type="text" 
              value={premiumPhone} 
              onChange={(e) => setPremiumPhone(e.target.value)}
              className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-yellow-500 outline-none transition-colors text-lg font-medium"
              placeholder="Mısalı: +998901234567"
            />
            <Button 
              type="submit" 
              disabled={loadingPremium || !premiumPhone}
              className="px-8 h-auto bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white font-bold text-lg rounded-xl shadow-md"
            >
              {loadingPremium ? <Loader2 className="w-6 h-6 animate-spin" /> : <><UserPlus className="w-5 h-5 mr-2" /> Beriw</>}
            </Button>
          </form>
        </div>

        {/* =========================================
            2. KITOB YUKLASH BO'LIMI
        ========================================= */}
        <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mr-4 text-indigo-600">
              <FileText className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">Jańa kitap júklew</h2>
          </div>

          <form onSubmit={handleUploadBook} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kitap atı (Title) *</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Mısalı: Qaraqalpaq tili grammatikası" required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Qısqasha maǵlıwmat (Description)</label>
              <textarea 
                value={description} onChange={(e) => setDescription(e.target.value)} rows={2}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Kitap haqqında maǵlıwmat kiritiń..."
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">PDF Fayl *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} className="hidden" id="file-upload"/>
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <FileText className={`w-10 h-10 mb-2 ${file ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-indigo-600 hover:text-indigo-700">
                    {file ? file.name : "Fayldı saylaw ushın basıń"}
                  </span>
                </label>
              </div>
            </div>
            <Button type="submit" disabled={loadingBook || !file || !title} className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-md">
              {loadingBook ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <><Upload className="w-5 h-5 mr-2" /> Bazaǵa júklew</>}
            </Button>
          </form>
        </div>

      </div>
    </div>
  );
}
