import React, { useState } from 'react';
import { convertToBoltUrl } from '../utils/boltUrl';
import { Wand2 } from 'lucide-react';

interface BookmarkFormProps {
  onAdd: (title: string, url: string) => void;
}

export function BookmarkForm({ onAdd }: BookmarkFormProps) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [figmaUrl, setFigmaUrl] = useState('');
  const [error, setError] = useState<{ github?: string; figma?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd(title, url);
    setTitle('');
    setUrl('');
  };

  const validateGithubUrl = (url: string): boolean => {
    const githubRegex = /^https?:\/\/github\.com\/[^\/]+\/[^\/]+/;
    return githubRegex.test(url);
  };

  const validateFigmaUrl = (url: string): boolean => {
    const figmaRegex = /^https?:\/\/(?:www\.)?figma\.com\/(file|design)\//;
    return figmaRegex.test(url);
  };

  const handleGithubUrlChange = (value: string) => {
    setGithubUrl(value);
    setError(prev => ({
      ...prev,
      github: value && !validateGithubUrl(value) 
        ? 'Veuillez entrer une URL GitHub valide (ex: https://github.com/user/repo)'
        : undefined
    }));
  };

  const handleFigmaUrlChange = (value: string) => {
    setFigmaUrl(value);
    setError(prev => ({
      ...prev,
      figma: value && !validateFigmaUrl(value)
        ? 'Veuillez entrer une URL Figma valide (ex: https://figma.com/file/...)'
        : undefined
    }));
  };

  const handleBoltConvert = (e: React.FormEvent, sourceUrl: string, type: 'github' | 'figma') => {
    e.preventDefault();
    if (!sourceUrl.trim()) return;

    if (type === 'github' && !validateGithubUrl(sourceUrl)) {
      setError(prev => ({
        ...prev,
        github: 'Veuillez entrer une URL GitHub valide'
      }));
      return;
    }

    if (type === 'figma' && !validateFigmaUrl(sourceUrl)) {
      setError(prev => ({
        ...prev,
        figma: 'Veuillez entrer une URL Figma valide'
      }));
      return;
    }

    const boltUrl = convertToBoltUrl(sourceUrl);
    navigator.clipboard.writeText(boltUrl);
    if (type === 'github') setGithubUrl('');
    if (type === 'figma') setFigmaUrl('');
    setUrl(boltUrl);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-text mb-1">
            Titre
          </label>
          <input
            id="title"
            type="text"
            placeholder="Mon super site"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-neutral-text mb-1">
            URL
          </label>
          <input
            id="url"
            type="text"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-sm bg-gradient-primary text-white rounded-md hover:opacity-90 transition-opacity"
        >
          Ajouter le signet
        </button>
      </form>

      <div className="pt-2 border-t border-white/10 space-y-2">
        <form onSubmit={(e) => handleBoltConvert(e, githubUrl, 'github')} className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="URL GitHub à convertir"
              value={githubUrl}
              onChange={(e) => handleGithubUrlChange(e.target.value)}
              className={`flex-1 px-3 py-1.5 text-sm bg-dark-bg border ${
                error.github ? 'border-error' : 'border-white/10'
              } rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              type="submit"
              disabled={!!error.github || !githubUrl}
              className="px-3 py-1.5 text-sm bg-gradient-save text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Convertir en URL Bolt"
            >
              <Wand2 className="w-4 h-4" />
              Bolt
            </button>
          </div>
          {error.github && (
            <p className="text-xs text-error-light">{error.github}</p>
          )}
        </form>

        <form onSubmit={(e) => handleBoltConvert(e, figmaUrl, 'figma')} className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="URL Figma à convertir"
              value={figmaUrl}
              onChange={(e) => handleFigmaUrlChange(e.target.value)}
              className={`flex-1 px-3 py-1.5 text-sm bg-dark-bg border ${
                error.figma ? 'border-error' : 'border-white/10'
              } rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              type="submit"
              disabled={!!error.figma || !figmaUrl}
              className="px-3 py-1.5 text-sm bg-gradient-save text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Convertir en URL Bolt"
            >
              <Wand2 className="w-4 h-4" />
              Bolt
            </button>
          </div>
          {error.figma && (
            <p className="text-xs text-error-light">{error.figma}</p>
          )}
        </form>
      </div>
    </div>
  );
}