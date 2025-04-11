import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { app } from '../config/firebase';
import { Bookmark, Category } from '../types';

const db = getFirestore(app);

// Fonction utilitaire pour valider les données
function validateData(data: any, schema: Record<string, string>): boolean {
  for (const [key, type] of Object.entries(schema)) {
    if (!(key in data) || typeof data[key] !== type) {
      return false;
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
  name: 'string'
};

export const firestoreService = {
  // Bookmarks
  async saveBookmarks(userId: string, bookmarks: Bookmark[]) {
    if (!userId) throw new Error('userId est requis');
    
    // Validation des données
    for (const bookmark of bookmarks) {
      if (!validateData(bookmark, bookmarkSchema)) {
        throw new Error('Format de signet invalide');
      }
    }

    const userBookmarksRef = collection(db, `users/${userId}/bookmarks`);
    
    try {
      // Delete all existing bookmarks
      const snapshot = await getDocs(userBookmarksRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Save new bookmarks
      const savePromises = bookmarks.map(bookmark => 
        setDoc(doc(userBookmarksRef, bookmark.id), bookmark)
      );
      await Promise.all(savePromises);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des signets:', error);
      throw new Error('Erreur lors de la sauvegarde des signets');
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
          throw new Error('Format de signet invalide dans la base de données');
        }
      }

      return bookmarks;
    } catch (error) {
      console.error('Erreur lors de la récupération des signets:', error);
      throw new Error('Erreur lors de la récupération des signets');
    }
  },

  // Categories
  async saveCategories(userId: string, categories: Category[]) {
    if (!userId) throw new Error('userId est requis');
    
    // Validation des données
    for (const category of categories) {
      if (!validateData(category, categorySchema)) {
        throw new Error('Format de catégorie invalide');
      }
    }

    const userCategoriesRef = collection(db, `users/${userId}/categories`);
    
    try {
      // Delete all existing categories
      const snapshot = await getDocs(userCategoriesRef);
      const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);
      
      // Save new categories
      const savePromises = categories.map(category => 
        setDoc(doc(userCategoriesRef, category.id), category)
      );
      await Promise.all(savePromises);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des catégories:', error);
      throw new Error('Erreur lors de la sauvegarde des catégories');
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
          throw new Error('Format de catégorie invalide dans la base de données');
        }
      }

      return categories;
    } catch (error) {
      console.error('Erreur lors de la récupération des catégories:', error);
      throw new Error('Erreur lors de la récupération des catégories');
    }
  }
};