import React from 'react';
import { X, Trash2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  if (!isOpen) return null;

  const handleClearCache = async () => {
    try {
      await window.caches.keys().then(function(names) {
        for (let name of names) {
          window.caches.delete(name);
        }
      });
      localStorage.clear();
      sessionStorage.clear();
      indexedDB.deleteDatabase('firebaseLocalStorageDb');
      alert('Cache vidé avec succès. Veuillez rafraîchir la page.');
      window.location.reload();
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
      alert('Une erreur est survenue lors du vidage du cache.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-dark-card rounded-lg shadow-xl w-[400px] p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Paramètres</h2>
          <button
            onClick={onClose}
            className="p-2 text-neutral-text hover:text-white hover:bg-white/5 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-md">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-medium mb-1">Vider le cache</h3>
                <p className="text-sm text-neutral-text">
                  Supprime toutes les données locales de l'application
                </p>
              </div>
              <button
                onClick={handleClearCache}
                className="p-2 text-error-light hover:text-error hover:bg-error/10 rounded"
                title="Vider le cache"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}