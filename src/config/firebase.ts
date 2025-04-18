import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA_fQ_OeOjMsYVJIIZ6YFHQZ5_luwMnt2E",
  projectId: "signets-f0082",
  authDomain: "signets-f0082.firebaseapp.com",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Configure local persistence instead of session persistence
setPersistence(auth, browserLocalPersistence).catch((error) => {
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