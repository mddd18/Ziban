import { useState } from 'react';
import { ChevronLeft, Book, Download, Search } from 'lucide-react';

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
      accent: "#60A5FA", 
      lightAccent: "#EFF6FF" 
    },
    { 
      id: 2, 
      title: "Terminler sózligi", 
      author: "I. Sultanov", 
      type: "Sózlik", 
      accent: "#FBBF24", 
      lightAccent: "#FFFBEB" 
    },
    { 
      id: 3, 
      title: "Milliy sertifikat", 
      author: "Ziyban Team", 
      type: "Qollanba", 
      accent: "#34D399", 
      lightAccent: "#ECFDF5" 
    },
    { 
      id: 4, 
      title: "Ádebiyat tili", 
      author: "G. Bekmuratov", 
      type: "Sabaqlıq", 
      accent: "#F87171", 
      lightAccent: "#FEF2F2" 
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-12 flex flex-col">
      {/* 🟢 HEADER SECTION */}
      <div className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button 
          onClick={onBack} 
          className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md active:scale-90 border border-white/30"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Ádebiyatlar</h2>
        <p className="text-white/70 font-bold text-xs mt-1 uppercase tracking-widest">Kerekli kitaplar</p>
      </div>

      <main className="px-6 -mt-10 space-y-6 relative z-10 flex-1">
        
        {/* 🔍 SEARCH */}
        <div className="relative group mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#A0B8B4] group-focus-within:text-[#2EB8A6] transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Kitap yamasa avtor izlew..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-b-[4px] border-[#E8DFCC] focus:border-b-[#2EB8A6] rounded-[24px] py-4 pl-12 pr-4 outline-none font-bold text-[#2C4A44] placeholder-[#A0B8B4] transition-all shadow-sm"
          />
        </div>

        {/* 📋 LIST OF BOOKS */}
        <div className="space-y-4">
          {books.map((book) => (
            <div 
              key={book.id} 
              className="bg-white rounded-[32px] p-5 shadow-sm border-b-[6px] border-[#E8DFCC] flex items-center group hover:border-[#2EB8A6] transition-all"
            >
              {/* Kitob muqovasi */}
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

              {/* Yuklash tugmasi */}
              <button 
                className="p-3 bg-[#F5EEDC] text-[#A0B8B4] rounded-2xl group-hover:bg-[#2EB8A6] group-hover:text-white transition-all shadow-sm active:scale-95"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
