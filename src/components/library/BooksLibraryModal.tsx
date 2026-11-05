import React, { useState } from 'react';
import { X, BookOpen, Search, Sparkles, Sun, Moon, Quote } from 'lucide-react';
import { SACRED_BOOKS } from '../../data/booksData';
import { BookReference } from '../../types';

interface BooksLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = [
  'All Books',
  'Gratitude & Law of Attraction',
  'Mind & Neuroscience',
  'Water Alchemy & Vibration',
  'Sleep & Subconscious',
  'Longevity & Purpose',
];

export const BooksLibraryModal: React.FC<BooksLibraryModalProps> = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Books');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBook, setSelectedBook] = useState<BookReference | null>(SACRED_BOOKS[0]);

  if (!isOpen) return null;

  const filteredBooks = SACRED_BOOKS.filter((book) => {
    const matchesCategory =
      selectedCategory === 'All Books' || book.category === selectedCategory;
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.coreConcepts.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-emerald-900/10 max-h-[92vh] flex flex-col overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="library-modal-title"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-stone-200 flex items-center justify-between gap-4 bg-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-amber-300">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 id="library-modal-title" className="text-lg sm:text-xl font-bold font-heading">
                Sacred Book References &amp; Scientific Sources
              </h3>
              <p className="text-xs text-stone-300">
                Ancient rituals verified by neuroscience, water crystallization, and quantum consciousness
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close Reference Library"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-white hover:bg-stone-200 text-stone-700 border border-stone-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[200px]">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search author, topic, quote..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-300 focus:outline-emerald-600 bg-white"
            />
          </div>
        </div>

        {/* Two-Column Explorer: Book List & Expanded Reader */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Book Cards Grid */}
          <div className="lg:col-span-5 space-y-3">
            {filteredBooks.map((book) => {
              const isSelected = selectedBook?.id === book.id;

              return (
                <button
                  key={book.id}
                  onClick={() => setSelectedBook(book)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/80 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm'
                      : 'bg-white hover:bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-emerald-900 line-clamp-1">
                      {book.author}
                    </span>
                    <span className="text-[11px] text-stone-400 font-mono ml-2 shrink-0">{book.year}</span>
                  </div>

                  <h4 className="text-base font-bold font-heading text-stone-900 mt-1.5 line-clamp-1">
                    {book.title}
                  </h4>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {book.subtitle}
                  </p>
                </button>
              );
            })}

            {filteredBooks.length === 0 && (
              <div className="text-center py-10 text-stone-400 text-xs">
                No books found matching your criteria.
              </div>
            )}
          </div>

          {/* Book Details Pane */}
          <div className="lg:col-span-7 bg-stone-50/60 rounded-3xl p-6 border border-stone-200 space-y-5">
            {selectedBook ? (
              <>
                <div className="border-b border-stone-200 pb-4 space-y-1">
                  <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                    {selectedBook.category} • {selectedBook.year}
                  </span>
                  <h3 className="text-2xl font-bold font-heading text-emerald-950">
                    {selectedBook.title}
                  </h3>
                  <div className="text-sm font-semibold text-stone-700">
                    By {selectedBook.author}
                  </div>
                  <p className="text-xs text-stone-500 italic">{selectedBook.subtitle}</p>
                </div>

                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Executive Summary &amp; Wisdom
                  </h5>
                  <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-sans">
                    {selectedBook.summary}
                  </p>
                </div>

                {/* Core Concepts */}
                <div className="space-y-2">
                  <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Key Practices &amp; Pillars
                  </h5>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {selectedBook.coreConcepts.map((concept, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-emerald-600 font-bold mt-0.5">•</span>
                        <span>{concept}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Morning & Evening Integration Takeaways */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                      <Sun className="w-3.5 h-3.5 text-amber-600" /> Morning Takeaway
                    </div>
                    <p className="text-xs text-amber-950 leading-relaxed">
                      {selectedBook.morningTakeaway}
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200 space-y-1">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-900">
                      <Moon className="w-3.5 h-3.5 text-teal-600" /> Evening Takeaway
                    </div>
                    <p className="text-xs text-teal-950 leading-relaxed">
                      {selectedBook.eveningTakeaway}
                    </p>
                  </div>
                </div>

                {/* Famous Quote */}
                <blockquote className="p-4 rounded-2xl bg-white border border-stone-200 text-xs sm:text-sm font-serif-magic italic text-emerald-950 flex items-start gap-2.5 shadow-xs">
                  <Quote className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{selectedBook.famousQuote}</span>
                </blockquote>
              </>
            ) : (
              <div className="text-center py-20 text-stone-400">
                Select a book from the list to view its complete details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
