import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../config/firebase';
import { Bookmark, Category } from '../types';

// Fonction utilitaire pour valider les données
function validateData(data: any, schema: Record<string, string | { type: string; optional?: boolean }>): boolean {
  for (const [key, validation] of Object.entries(schema)) {
    if (typeof validation === 'string') {
      if (!(key in data) || typeof data[key] !== validation) {
        return false;
      }
    } else {
      if (!(key in data)) {
        if (!validation.optional) {
          return false;
        }
      } else if (data[key] !== null && typeof data[key] !== validation.type) {
        return false;
      }
    }
  }
  return true;
}

// Schémas de validation
const bookmarkSchema = {
  id: 'string',
  title: 'string',
  url: 'string',
  categoryId: 'string'
};

const categorySchema = {
  id: 'string',
  name: 'string',
  urlPattern: { type: 'string', optional: true }
};

export const firestoreService = {
  // Bookmarks
  async saveBookmarks(userId: string, bookmarks: Bookmark[]) {
    if (!userId) throw new Error('userId est requis');
    
    try {
      // Validation des données
      for (const bookmark of bookmarks) {
        if (!validateData(bookmark, bookmarkSchema)) {
          console.error('Signet invalide:', bookmark);
          throw new Error('Format de signet invalide');
        }
      }

      const batch = writeBatch(db);
      const userBookmarksRef = collection(db, `users/${userId}/bookmarks`);
      
      // Delete all existing bookmarks
      const snapshot = await getDocs(userBookmarksRef);
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });
      
      // Add new bookmarks
      bookmarks.forEach(bookmark => {
        const docRef = doc(userBookmarksRef, bookmark.id);
        batch.set(docRef, bookmark);
      });

      await batch.commit();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des signets:', error);
      throw error;
    }
  },

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    if (!userId) throw new Error('userId est requis');

    try {
      const userBookmarksRef = collection(db, `users/${userId}/bookmarks`);
      const snapshot = await getDocs(userBookmarksRef);
      const bookmarks = snapshot.docs.map(doc => doc.data() as Bookmark);
      
      // Validation des données
      for (const bookmark of bookmarks) {
        if (!validateData(bookmark, bookmarkSchema)) {
          console.error('Signet invalide dans la base de données:', bookmark);
          throw new Error('Format de signet invalide dans la base de données');
        }
      }

      return bookmarks;
    } catch (error) {
      console.error('Erreur lors de la récupération des signets:', error);
      throw error;
    }
  },

  // Categories
  async saveCategories(userId: string, categories: Category[]) {
    if (!userId) throw new Error('userId est requis');
    
    try {
      // Validation des données
      for (const category of categories) {
        if (!validateData(category, categorySchema)) {
          console.error('Catégorie invalide:', category);
          throw new Error('Format de catégorie invalide');
        }
      }

      const batch = writeBatch(db);
      const userCategoriesRef = collection(db, `users/${userId}/categories`);
      
      // Delete all existing categories
      const snapshot = await getDocs(userCategoriesRef);
      snapshot.docs.forEach(docSnapshot => {
        batch.delete(docSnapshot.ref);
      });
      
      // Add new categories
      categories.forEach(category => {
        const docRef = doc(userCategoriesRef, category.id);
        batch.set(docRef, { ...category });
      });

      await batch.commit();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des catégories:', error);
      throw error;
    }
  },

  async getCategories(userId: string): Promise<Category[]> {
    if (!userId) throw new Error('userId est requis');

    try {
      const userCategoriesRef = collection(db, `users/${userId}/categories`);
      const snapshot = await getDocs(userCategoriesRef);
      const categories = snapshot.docs.map(doc => doc.data() as Category);
      
      // Validation des données
      for (const category of categories) {
        if (!validateData(category, categorySchema)) {
          console.error('Catégorie invalide dans la base de données:', category);
          throw new Error('Format de catégorie invalide dans la base de données');
        }
      }

      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw error;
    }
  }
};