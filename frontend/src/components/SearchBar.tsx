// frontend/src/components/SearchBar.tsx
import { type FormEvent, type ChangeEvent } from 'react';
import { Search, Loader2, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

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
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
        <div className="relative flex items-center gap-2 p-2 bg-[#1a1a2e] rounded-2xl border border-white/10">
          <div className="flex-1">
            <Input
              type="text"
              value={value}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
              placeholder="Enter a GitHub username..."
              className="border-0 bg-transparent focus:ring-0 text-lg placeholder:text-gray-500"
              icon={<Search className="w-5 h-5" />}
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            disabled={isLoading || !value.trim()}
            variant="gradient"
            size="md"
            loading={isLoading}
            className="min-w-[120px]"
          >
            {!isLoading && <Sparkles className="w-4 h-4 mr-2" />}
            {isLoading ? 'Analyzing...' : 'Analyze'}
          </Button>
        </div>
      </div>
      <p className="text-center text-gray-500 text-sm mt-4">
        Discover insights about any public GitHub profile ✨
      </p>
    </form>
  );
}