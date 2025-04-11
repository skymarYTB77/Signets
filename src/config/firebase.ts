import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
};

// Validation des variables d'environnement
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_AUTH_DOMAIN'
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`La variable d'environnement ${envVar} est manquante`);
  }
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configuration de la persistance de session
auth.setPersistence('session');

// Écouteur de changement d'état d'authentification
auth.onAuthStateChanged((user) => {
  if (user) {
    // Vérification du token toutes les 10 minutes
    setInterval(async () => {
      try {
        await user.getIdToken(true);
      } catch (error) {
        console.error('Erreur lors du rafraîchissement du token:', error);
        auth.signOut();
      }
    }, 10 * 60 * 1000);
  }
});