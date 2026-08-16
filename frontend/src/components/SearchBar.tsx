import { type FormEvent, type ChangeEvent } from 'react';
import { Loader2, Search, ArrowUpRight } from 'lucide-react';

interface SearchBarProps { value: string; onChange: (value: string) => void; onSearch: () => void; isLoading: boolean; }

export function SearchBar({ value, onChange, onSearch, isLoading }: SearchBarProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); if (value.trim() && !isLoading) onSearch(); };
  return <form onSubmit={handleSubmit} className="mx-auto w-full max-w-2xl">
    <label htmlFor="github-username" className="font-mono-label mb-3 block text-xs text-zinc-500">GitHub username</label>
    <div className="surface flex flex-col gap-2 rounded-2xl p-2 sm:flex-row sm:items-center">
      <div className="flex min-w-0 flex-1 items-center gap-3 px-3">
        <Search aria-hidden="true" className="size-5 shrink-0 text-zinc-500" />
        <input id="github-username" value={value} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} placeholder="e.g. torvalds" disabled={isLoading} autoComplete="off" className="focus-ring min-w-0 flex-1 bg-transparent py-3 text-base text-zinc-100 outline-none placeholder:text-zinc-600" />
      </div>
      <button type="submit" disabled={isLoading || !value.trim()} className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-zinc-100 px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500">
        {isLoading ? <><Loader2 className="size-4 animate-spin" />Analyzing</> : <>Analyze profile <ArrowUpRight className="size-4" /></>}
      </button>
    </div>
    <p className="mt-3 text-center text-sm text-zinc-500">Public GitHub data only. No sign-in required.</p>
  </form>;
}
