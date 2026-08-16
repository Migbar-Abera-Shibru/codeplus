import { type ChangeEvent, type FormEvent } from 'react';
import { ArrowRight, Loader2, Search } from 'lucide-react';

interface SearchBarProps { value: string; onChange: (value: string) => void; onSearch: () => void; isLoading: boolean; }

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (value.trim() && !isLoading) onSearch(); };
  return <form className="search-form" onSubmit={handleSubmit}><div className="search-input-wrap"><Search /><input aria-label="GitHub username" value={value} onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)} placeholder="Enter GitHub username..." disabled={isLoading} /><kbd>⌘ K</kbd></div><button type="submit" disabled={isLoading || !value.trim()}>{isLoading ? <><Loader2 className="spin" /> Analyzing</> : <>Analyze Profile <ArrowRight /></>}</button></form>;
}
