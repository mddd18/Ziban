import { useState } from 'react';
import { ArrowLeft, Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '../../supabase';

export default function AdminPanel({ onBack }: { onBack: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !file) {
      setMessage({ type: 'error', text: 'Kitap atı hám fayldı saylań!' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 1. Fayl nomini to'g'rilash (bo'shliqlarni olib tashlash va vaqt qo'shish)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `pdfs/${fileName}`;

      // 2. Storage'ga yuklash (books qutisiga)
      const { error: uploadError } = await supabase.storage
        .from('books')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 3. Ochiq (Public) URL manzilini olish
      const { data: { publicUrl } } = supabase.storage
        .from('books')
        .getPublicUrl(filePath);

      // 4. Ma'lumotlar bazasiga (literatures) yozish
      const { error: dbError } = await supabase.from('literatures').insert([{
        title: title,
        description: description,
        file_url: publicUrl,
        type: file.type.includes('pdf') ? 'PDF' : 'DOC',
        pages: 0, // Buni kelajakda qolda kiritadigan qilsa ham bo'ladi
        color: 'from-blue-500 to-indigo-500' // Standart rang
      }]);

      if (dbError) throw dbError;

      setMessage({ type: 'success', text: 'Kitap tabıslı júklendi!' });
      setTitle('');
      setDescription('');
      setFile(null);
      
    } catch (error: any) {
      console.error(error);
      setMessage({ type: 'error', text: 'Xatolik yuz berdi: ' + error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      <header className="bg-indigo-900 shadow-md sticky top-0 z-10 text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2 text-white hover:bg-white/20">
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-bold">Admin Panel: Kitap júklew</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-3xl shadow-md p-8 border border-gray-100">
          
          {message && (
            <div className={`p-4 rounded-xl mb-6 flex items-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle className="w-6 h-6 mr-3" /> : <AlertCircle className="w-6 h-6 mr-3" />}
              {message.text}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kitap atı (Title) *</label>
              <input 
                type="text" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Mısalı: Qaraqalpaq tili grammatikası"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Qısqasha maǵlıwmat (Description)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 outline-none transition-colors"
                placeholder="Kitap haqqında maǵlıwmat kiritiń..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">PDF Fayl *</label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors">
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                  <FileText className={`w-12 h-12 mb-3 ${file ? 'text-indigo-600' : 'text-gray-400'}`} />
                  <span className="font-medium text-indigo-600 hover:text-indigo-700">
                    {file ? file.name : "Fayldı saylaw ushın basıń"}
                  </span>
                  {!file && <span className="text-sm text-gray-500 mt-1">PDF formatında</span>}
                </label>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading || !file || !title}
              className="w-full h-14 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg rounded-xl shadow-md"
            >
              {loading ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : <><Upload className="w-5 h-5 mr-2" /> Bazaǵa júklew</>}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
