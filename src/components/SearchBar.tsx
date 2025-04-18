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
    <div className="flex-1 min-w-0 space-y-2">
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-neutral-text w-4 h-4" />
        <input
          type="text"
          placeholder="Rechercher un signet..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full pl-8 pr-8 py-1.5 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {searchTerm && (
          <button
            onClick={() => onSearch('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-neutral-text hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      
      {searchTerm && (
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 text-sm">
          <div className="text-neutral-text text-xs">
            {resultCount} résultat{resultCount !== 1 ? 's' : ''} trouvé{resultCount !== 1 ? 's' : ''}
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onFilterChange('all')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'all'
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-text hover:text-white'
              }`}
            >
              Tout
            </button>
            <button
              onClick={() => onFilterChange('title')}
              className={`px-2 py-0.5 rounded text-xs ${
                activeFilter === 'title'
                  ? 'bg-primary/20 text-primary'
                  : 'text-neutral-text hover:text-white'
              }`}
            >
              Titre
            </button>
            <button
              onClick={() => onFilterChange('url')}
              className={`px-2 py-0.5 rounded text-xs ${
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