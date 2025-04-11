import { getFirestore, collection, doc, setDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore';
import { app } from '../config/firebase';
import { Bookmark, Category } from '../types';

const db = getFirestore(app);

export const firestoreService = {
  // Bookmarks
  async saveBookmarks(userId: string, bookmarks: Bookmark[]) {
    const userBookmarksRef = collection(db, `users/${userId}/bookmarks`);
    
    // Delete all existing bookmarks
    const snapshot = await getDocs(userBookmarksRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Save new bookmarks
    const savePromises = bookmarks.map(bookmark => 
      setDoc(doc(userBookmarksRef, bookmark.id), bookmark)
    );
    await Promise.all(savePromises);
  },

  async getBookmarks(userId: string): Promise<Bookmark[]> {
    const userBookmarksRef = collection(db, `users/${userId}/bookmarks`);
    const snapshot = await getDocs(userBookmarksRef);
    return snapshot.docs.map(doc => doc.data() as Bookmark);
  },

  // Categories
  async saveCategories(userId: string, categories: Category[]) {
    const userCategoriesRef = collection(db, `users/${userId}/categories`);
    
    // Delete all existing categories
    const snapshot = await getDocs(userCategoriesRef);
    const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    // Save new categories
    const savePromises = categories.map(category => 
      setDoc(doc(userCategoriesRef, category.id), category)
    );
    await Promise.all(savePromises);
  },

  async getCategories(userId: string): Promise<Category[]> {
    const userCategoriesRef = collection(db, `users/${userId}/categories`);
    const snapshot = await getDocs(userCategoriesRef);
    return snapshot.docs.map(doc => doc.data() as Category);
  }
};