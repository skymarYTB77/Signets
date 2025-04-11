import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCof6x4nXK1rKaTKAnyETLz9Ej33g_CL0c",
  projectId: "gestionnaire-de-fiches",
  authDomain: "gestionnaire-de-fiches.firebaseapp.com",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure session persistence
setPersistence(auth, browserSessionPersistence).catch((error) => {
  console.error('Error setting auth persistence:', error);
});

// Auth state change listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Token refresh check every 10 minutes
    setInterval(async () => {
      try {
        await user.getIdToken(true);
      } catch (error) {
        console.error('Error refreshing token:', error);
        auth.signOut();
      }
    }, 10 * 60 * 1000);
  }
});