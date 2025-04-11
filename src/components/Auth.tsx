import React, { useEffect, useState } from 'react';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, onAuthStateChanged, User } from 'firebase/auth';
import { Lock } from 'lucide-react';

interface AuthProps {
  onAuthStateChange: (user: User | null) => void;
}

export function Auth({ onAuthStateChange }: AuthProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà authentifié dans l'application principale
    const checkParentAuth = () => {
      if (window.parent !== window) {
        // L'application est dans une iframe
        window.parent.postMessage({ type: 'CHECK_AUTH' }, '*');
      }
    };

    const handleParentMessage = (event: MessageEvent) => {
      if (event.data.type === 'AUTH_STATUS') {
        if (event.data.token) {
          // Utiliser le token pour s'authentifier automatiquement
          auth.signInWithCustomToken(event.data.token)
            .then((userCredential) => {
              onAuthStateChange(userCredential.user);
            })
            .catch((error) => {
              console.error('Erreur d\'authentification automatique:', error);
              setIsLoading(false);
            });
        } else {
          setIsLoading(false);
        }
      }
    };

    window.addEventListener('message', handleParentMessage);
    checkParentAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      onAuthStateChange(user);
      if (!user) {
        setIsLoading(false);
      }
    });

    return () => {
      window.removeEventListener('message', handleParentMessage);
      unsubscribe();
    };
  }, [onAuthStateChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      onAuthStateChange(userCredential.user);
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm">
      <div className="w-[400px] bg-dark-card rounded-lg overflow-hidden shadow-xl neon-shadow p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
        </div>
        
        <h1 className="text-2xl font-semibold text-white text-center mb-6">
          Connexion
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-error/10 border border-error/20 rounded-md text-error-light text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-text mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-text mb-1">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 bg-dark-bg border border-white/10 rounded-md text-white placeholder-neutral-text focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-primary text-white rounded-md hover:opacity-90 transition-opacity"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}