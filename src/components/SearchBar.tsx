import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
  searchTerm: string;
  onSearch: (term: string) => void;
  onFilterChange: (filter: string) => void;
  activeFilter: string;
  resultCount: number;
}

export function SearchBar({ searchTerm, onSearch, onFilterChange, activeFilter, resultCount }: SearchBarProps) {
  return (
    <div className="space-y-2">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-text w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un signet..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-10 pr-12 py-2 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-text hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="flex items-center justify-between text-sm">
          <div className="text-neutral-text">
            {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2 py-1 rounded ${
                activeFilter === 'all'
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-text hover:text-white'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => onFilterChange('title')}
              className={`px-2 py-1 rounded ${
                activeFilter === 'title'
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-text hover:text-white'
              }`}
            >
              Titre
            </button>
            <button
              onClick={() => onFilterChange('url')}
              className={`px-2 py-1 rounded ${
                activeFilter === 'url'
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-text hover:text-white'
              }`}
            >
              URL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}