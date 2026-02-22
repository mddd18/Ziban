import { ChevronLeft, Book, ExternalLink, Search, Bookmark } from 'lucide-react';

interface LiteratureProps {
  onBack: () => void;
}

export default function Literature({ onBack }: LiteratureProps) {
  const books = [
    { id: 1, title: "Qaraqalpaq tili", author: "P. Do'simov", type: "Sabaqlıq", color: "bg-emerald-500", lightBg: "bg-emerald-50" },
    { id: 2, title: "Terminler sózligi", author: "I. Sultanov", type: "Sózlik", color: "bg-amber-500", lightBg: "bg-amber-50" },
    { id: 3, title: "Milliy sertifikat", author: "Ziyban Team", type: "Qollanba", color: "bg-indigo-500", lightBg: "bg-indigo-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F5EEDC] font-sans pb-10">
      {/* HEADER */}
      <div className="bg-[#2EB8A6] pt-14 pb-20 px-6 rounded-b-[60px] shadow-lg relative text-center">
        <button onClick={onBack} className="absolute top-12 left-6 p-2.5 bg-white/20 rounded-2xl text-white backdrop-blur-md border border-white/30 active:scale-90 transition-all">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h2 className="text-white font-black text-2xl uppercase tracking-[0.2em] pt-2">Ádebiyatlar</h2>
      </div>

      <main className="px-6 -mt-10 space-y-6">
        {/* QIDIRUV */}
        <div className="bg-white rounded-[35px] p-5 shadow-sm flex items-center border-b-[6px] border-[#E8DFCC]">
          <Search className="text-[#8DA6A1] w-6 h-6 mr-3" />
          <input 
            type="text" 
            placeholder="Kitap izlew..." 
            className="bg-transparent border-none outline-none w-full font-bold text-[#2C4A44] placeholder-[#A0B8B4]" 
          />
        </div>

        {/* KITOB KARTALARI */}
        <div className="space-y-5">
          {books.map((book) => (
            <div key={book.id} className="bg-white rounded-[40px] p-6 shadow-sm border-b-[6px] border-[#E8DFCC] flex items-center group active:translate-y-1 transition-all">
              <div className={`w-16 h-20 ${book.color} rounded-2xl flex items-center justify-center mr-5 shadow-lg transform group-hover:rotate-2 transition-transform`}>
                <Book className="text-white w-8 h-8" />
              </div>
              <div className="flex-1">
                <div className={`${book.lightBg} inline-block px-3 py-0.5 rounded-full mb-2`}>
                   <span className={`text-[9px] font-black uppercase tracking-widest ${book.color.replace('bg-', 'text-')}`}>
                     {book.type}
                   </span>
                </div>
                <h3 className="font-black text-[#2C4A44] text-lg leading-tight mb-1">{book.title}</h3>
                <p className="text-[#8DA6A1] text-xs font-bold italic">{book.author}</p>
              </div>
              <button className="w-12 h-12 bg-[#F5EEDC] rounded-2xl flex items-center justify-center text-[#2EB8A6] group-hover:bg-[#2EB8A6] group-hover:text-white transition-all">
                <ExternalLink className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
