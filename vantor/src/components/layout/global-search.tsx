"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, Phone, Mail, X } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  company: string | null;
  stage: string;
  stageColor: string;
  type: string;
}

export function GlobalSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeoutRef.current);
  }, [query]);

  function handleSelect(result: SearchResult) {
    router.push(`/leads/${result.id}`);
    setQuery("");
    setOpen(false);
  }

  return (
    <div className="relative hidden sm:block">
      <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 w-64 focus-within:ring-2 focus-within:ring-brand-500 focus-within:bg-white transition-all">
        <Search className="h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Buscar leads..."
          className="bg-transparent text-sm outline-none w-full placeholder:text-gray-400"
        />
        {query && (
          <button onClick={() => { setQuery(""); setResults([]); }} className="text-gray-400 hover:text-gray-600">
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && query.length >= 2 && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-50 max-h-80 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center text-sm text-gray-400">Buscando...</div>
            )}

            {!loading && results.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-400">Sin resultados</div>
            )}

            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => handleSelect(result)}
                className="w-full flex items-start gap-3 p-3 hover:bg-gray-50 transition-colors text-left border-b border-gray-50 last:border-0"
              >
                <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-900 truncate">{result.name}</span>
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${result.stageColor}20`, color: result.stageColor }}>
                      {result.stage}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    {result.phone && <span className="text-xs text-gray-500">{result.phone}</span>}
                    {result.email && <span className="text-xs text-gray-500 truncate">{result.email}</span>}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
