import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCof6x4nXK1rKaTKAnyETLz9Ej33g_CL0c",
  projectId: "gestionnaire-de-fiches",
  authDomain: "gestionnaire-de-fiches.firebaseapp.com",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);