import React, { useState } from 'react';
import { User, Settings, LogOut } from 'lucide-react';
import { auth } from '../config/firebase';

interface ProfileMenuProps {
  userEmail: string;
}

export function ProfileMenu({ userEmail }: ProfileMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const handleClearCache = async () => {
    try {
      await window.caches.keys().then(function(names) {
        for (let name of names) {
          window.caches.delete(name);
        }
      });
      localStorage.clear();
      sessionStorage.clear();
      alert('Cache vidé avec succès !');
    } catch (error) {
      console.error('Erreur lors du vidage du cache:', error);
      alert('Une erreur est survenue lors du vidage du cache.');
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="p-2 text-neutral-text hover:text-white hover:bg-white/5 rounded-md"
      >
        <User className="w-5 h-5" />
      </button>

      {isMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsMenuOpen(false)}
          />
          <div className="absolute right-0 top-full mt-1 w-48 py-1 bg-dark-card rounded-md shadow-lg border border-white/10 z-20">
            <button
              onClick={() => {
                handleClearCache();
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-neutral-text hover:text-white hover:bg-white/5 flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Vider le cache
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-error-light hover:text-error hover:bg-error/5 flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Déconnexion
            </button>
          </div>
        </>
      )}
    </div>
  );
}