// frontend/src/components/SearchBar.tsx
import { useState, FormEvent } from 'react';
import { Search, Loader2 } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSearch();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter a GitHub username (e.g., torvalds)"
          className="w-full px-4 py-3 pl-12 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={isLoading}
        />
        <Search className="absolute left-4 w-5 h-5 text-gray-400" />
        <button
          type="submit"
          disabled={isLoading || !value.trim()}
          className="absolute right-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-md transition-colors"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Analyze'}
        </button>
      </div>
    </form>
  );
}