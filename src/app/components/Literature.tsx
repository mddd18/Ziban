import { useState } from 'react';
import { ChevronLeft, Book, Download, Search, Bookmark, ArrowRight, ExternalLink } from 'lucide-react';

interface LiteratureProps {
  onBack: () => void;
}

export default function Literature({ onBack }: LiteratureProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const books = [
    { 
      id: 1, 
      title: "Qaraqalpaq tili", 
      author: "P. Do'simov", 
      type: "Sabaqlıq", 
      accent: "#60A5FA", // Och ko'k
      lightAccent: "#EFF6FF" 
    },
    { 
      id: 2, 
      title: "Terminler sózligi", 
      author: "I. Sultanov", 
      type: "Sózlik", 
      accent: "#FBBF24", // Och sarg'ish
      lightAccent: "#FFFBEB" 
    },
    { 
      id: 3, 
      title: "Milliy sertifikat", 
      author: "Ziyban Team", 
      type: "Qollanba", 
      accent: "#34D399", // Och yashil
      lightAccent: "#ECFDF5" 
    },
    { 
      id: 4, 
      title: "Ádebiyat tili", 
      author: "G. Bekmuratov", 
      type: "Sabaqlıq", 
      accent: "#F87171", // Och qizil
      lightAccent: "#FEF2F2" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF9] font-sans pb-10">
      {/* 🌤️ TOP NAVIGATION (Och va shaffof) */}
      <div className="bg-white/80 backdrop-blur-md pt-14 pb-10 px-6 sticky top-0 z-50 border-b border-[#F0EBE0]">
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={onBack} 
            className="p-3 bg-[#F5EEDC]/50 rounded-2xl text-[#2C4A44] active:scale-90 transition-all border border-[#E8DFCC]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h2 className="text-[#2C4A44] font-black text-xl uppercase tracking-widest">Kitaplar</h2>
          <div className="w-12 h-12 bg-[#2EB8A6]/10 rounded-2xl flex items-center justify-center">
             <Bookmark className="w-5 h-5 text-[#2EB8A6]" />
          </div>
        </div>

        {/* 🔍 SEARCH (Minimalist) */}
        <div className="relative group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#A0B8B4] group-focus-within:text-[#2EB8A6] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Kitap yamasa avtor izlew..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#F5EEDC]/30 border-2 border-[#F0EBE0] focus:border-[#2EB8A6] rounded-2xl py-4 pl-12 pr-4 outline-none font-bold text-[#2C4A44] placeholder-[#A0B8B4] transition-all"
          />
        </div>
      </div>

      <main className="px-6 mt-8 space-y-5">
        <p className="text-[#8DA6A1] font-black text-[10px] uppercase tracking-[0.2em] ml-2">Barlıq ádebiyatlar</p>

        {/* 📋 LIST OF BOOKS */}
        <div className="space-y-4">
          {books.map((book) => (
            <div 
              key={book.id} 
              className="bg-white rounded-[32px] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-[#F0EBE0] flex items-center group hover:shadow-md hover:border-[#2EB8A6]/30 transition-all"
            >
              {/* Kitob muqovasi (Simvolik) */}
              <div 
                className="w-14 h-20 rounded-xl flex items-center justify-center shadow-inner relative overflow-hidden"
                style={{ backgroundColor: book.lightAccent }}
              >
                <div 
                  className="absolute left-0 top-0 bottom-0 w-1.5" 
                  style={{ backgroundColor: book.accent }}
                ></div>
                <Book className="w-8 h-8 opacity-40" style={{ color: book.accent }} />
              </div>

              {/* Kitob ma'lumotlari */}
              <div className="flex-1 ml-5">
                <div className="flex items-center space-x-2 mb-1">
                  <span 
                    className="text-[8px] font-black uppercase px-2 py-0.5 rounded-md"
                    style={{ backgroundColor: book.lightAccent, color: book.accent }}
                  >
                    {book.type}
                  </span>
                </div>
                <h3 className="font-black text-[#2C4A44] text-lg leading-tight mb-0.5">{book.title}</h3>
                <p className="text-[#A0B8B4] text-xs font-bold leading-none">{book.author}</p>
              </div>

              {/* Yuklash/O'qish tugmasi */}
              <button 
                className="p-3 bg-[#F5EEDC]/40 text-[#A0B8B4] rounded-2xl group-hover:bg-[#2EB8A6] group-hover:text-white transition-all shadow-sm active:scale-95"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        {/* 💡 MOTIVATION CARD */}
        <div className="bg-[#2EB8A6]/5 rounded-[40px] p-8 border-2 border-dashed border-[#2EB8A6]/20 flex flex-col items-center text-center mt-10">
           <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
              <Sparkles className="w-6 h-6 text-[#2EB8A6]" />
           </div>
           <h4 className="text-[#2C4A44] font-black text-sm uppercase">Bilim — kús!</h4>
           <p className="text-[#8DA6A1] text-[10px] font-bold mt-2 max-w-[200px]">
             Hár kúni 10 bet kitap oqıw arqalı sózlik qorańızdı bayıtıń.
           </p>
        </div>
      </main>
    </div>
  );
}
