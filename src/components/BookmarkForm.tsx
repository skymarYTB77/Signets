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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd(title, url);
    setTitle('');
    setUrl('');
  };

  const handleBoltConvert = (e: React.FormEvent, sourceUrl: string) => {
    e.preventDefault();
    if (!sourceUrl.trim()) return;
    const boltUrl = convertToBoltUrl(sourceUrl);
    navigator.clipboard.writeText(boltUrl);
    if (sourceUrl === githubUrl) setGithubUrl('');
    if (sourceUrl === figmaUrl) setFigmaUrl('');
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
        <form onSubmit={(e) => handleBoltConvert(e, githubUrl)} className="flex gap-2">
          <input
            type="text"
            placeholder="URL GitHub à convertir"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-gradient-save text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
            title="Convertir en URL Bolt"
          >
            <Wand2 className="w-4 h-4" />
            Bolt
          </button>
        </form>

        <form onSubmit={(e) => handleBoltConvert(e, figmaUrl)} className="flex gap-2">
          <input
            type="text"
            placeholder="URL Figma à convertir"
            value={figmaUrl}
            onChange={(e) => setFigmaUrl(e.target.value)}
            className="flex-1 px-3 py-1.5 text-sm bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="px-3 py-1.5 text-sm bg-gradient-save text-white rounded-md hover:opacity-90 transition-opacity flex items-center gap-1"
            title="Convertir en URL Bolt"
          >
            <Wand2 className="w-4 h-4" />
            Bolt
          </button>
        </form>
      </div>
    </div>
  );
}