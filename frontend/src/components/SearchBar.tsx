// frontend/src/components/SearchBar.tsx
import { type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch();
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="w-full max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="relative group">
        {/* Glow effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-700" />
        
        {/* Input container */}
        <div className="relative flex items-center gap-2 p-1.5 bg-white/[0.03] backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl shadow-blue-500/5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-blue-500/10">
          {/* Search icon */}
          <div className="pl-4 text-gray-500">
            <Search className="w-5 h-5" />
          </div>

          {/* Input */}
          <input
            type="text"
            value={value}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            placeholder="Enter a GitHub username..."
            className="flex-1 py-3.5 px-2 bg-transparent text-white text-base placeholder:text-gray-600 focus:outline-none"
            disabled={isLoading}
            autoFocus
          />

          {/* Submit button */}
          <motion.button
            type="submit"
            disabled={isLoading || !value.trim()}
            className={`relative px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 flex items-center gap-2
              ${isLoading || !value.trim() 
                ? 'bg-white/5 text-gray-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            whileHover={!isLoading && value.trim() ? { scale: 1.02 } : {}}
            whileTap={!isLoading && value.trim() ? { scale: 0.98 } : {}}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </div>

        {/* Helper text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center text-gray-600 text-sm mt-4"
        >
          Try: <span className="text-gray-400">torvalds</span>,{' '}
          <span className="text-gray-400">gaearon</span>, or your own username ✨
        </motion.p>
      </div>
    </motion.form>
  );
}