import React, { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BookmarkForm } from './components/BookmarkForm';
import { Auth } from './components/Auth';
import { Bookmark, Category } from './types';
import { convertToBoltUrl } from './utils/boltUrl';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
import { User } from 'firebase/auth';
import { firestoreService } from './services/firestore';
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

const DEFAULT_CATEGORY_ID = 'default';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [categories, setCategories] = useState<Category[]>([
    { id: DEFAULT_CATEGORY_ID, name: 'Nouveaux signets' }
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY_ID);
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        try {
          setIsLoading(true);
          const [loadedBookmarks, loadedCategories] = await Promise.all([
            firestoreService.getBookmarks(user.uid),
            firestoreService.getCategories(user.uid)
          ]);
          
          setBookmarks(loadedBookmarks);
          setCategories(prev => {
            const defaultCategory = prev.find(c => c.id === DEFAULT_CATEGORY_ID);
            return [
              defaultCategory!,
              ...loadedCategories.filter(c => c.id !== DEFAULT_CATEGORY_ID)
            ];
          });
        } catch (error) {
          console.error('Error loading data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const saveBookmarks = async () => {
      if (user && !isLoading) {
        try {
          await firestoreService.saveBookmarks(user.uid, bookmarks);
        } catch (error) {
          console.error('Error saving bookmarks:', error);
        }
      }
    };

    saveBookmarks();
  }, [bookmarks, user, isLoading]);

  useEffect(() => {
    const saveCategories = async () => {
      if (user && !isLoading) {
        try {
          const categoriesToSave = categories.filter(c => c.id !== DEFAULT_CATEGORY_ID);
          await firestoreService.saveCategories(user.uid, categoriesToSave);
        } catch (error) {
          console.error('Error saving categories:', error);
        }
      }
    };

    saveCategories();
  }, [categories, user, isLoading]);

  const findMatchingCategory = (url: string): string => {
    const matchingCategory = categories.find(category => 
      category.urlPattern && url.includes(category.urlPattern)
    );
    return matchingCategory?.id || DEFAULT_CATEGORY_ID;
  };

  const addBookmark = (title: string, url: string) => {
    const processedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const boltUrl = convertToBoltUrl(processedUrl);
    const categoryId = findMatchingCategory(boltUrl);

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: title.trim(),
      url: boltUrl,
      categoryId
    };

    setBookmarks([...bookmarks, newBookmark]);
  };

  const deleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const addCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: 'Nouvelle catégorie'
    };
    setCategories([...categories, newCategory]);
  };

  const deleteCategory = (id: string) => {
    if (id === DEFAULT_CATEGORY_ID) return;
    
    const categoryToDelete = categories.find(c => c.id === id);
    if (!categoryToDelete) return;

    if (window.confirm(`Voulez-vous vraiment supprimer la catégorie "${categoryToDelete.name}" ? Les signets seront déplacés vers "Nouveaux signets".`)) {
      setBookmarks(bookmarks.map(bookmark => 
        bookmark.categoryId === id ? { ...bookmark, categoryId: DEFAULT_CATEGORY_ID } : bookmark
      ));
      setCategories(categories.filter(category => category.id !== id));
      if (selectedCategory === id) {
        setSelectedCategory(DEFAULT_CATEGORY_ID);
      }
    }
  };

  const renameCategory = (id: string, newName: string) => {
    if (id === DEFAULT_CATEGORY_ID) return;
    setCategories(categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    ));
  };

  const updateCategoryUrlPattern = (id: string, urlPattern: string) => {
    if (id === DEFAULT_CATEGORY_ID) return;
    
    const patternExists = categories.some(c => 
      c.id !== id && c.urlPattern === urlPattern
    );
    
    if (patternExists) {
      alert('Ce modèle d\'URL est déjà utilisé par une autre catégorie.');
      return;
    }

    setCategories(categories.map(category =>
      category.id === id ? { ...category, urlPattern } : category
    ));

    setBookmarks(bookmarks.map(bookmark => {
      if (bookmark.url.includes(urlPattern)) {
        return { ...bookmark, categoryId: id };
      }
      return bookmark;
    }));
  };

  const handleCopy = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const bookmark = bookmarks.find(b => b.id === active.id);
    if (!bookmark) return;

    if (over.id.toString().startsWith('category-')) {
      const categoryId = over.id.toString().replace('category-', '');
      setBookmarks(bookmarks.map(b => 
        b.id === active.id ? { ...b, categoryId } : b
      ));
    }
  };

  useKeyboardShortcut('b', true, () => {
    const url = window.prompt('Entrez l\'URL GitHub à convertir:');
    if (url) {
      const boltUrl = convertToBoltUrl(url);
      navigator.clipboard.writeText(boltUrl);
      alert('URL Bolt copiée dans le presse-papiers !');
    }
  });

  if (!user) {
    return <Auth onAuthStateChange={setUser} />;
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-dark-bg flex items-center justify-center p-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="w-full max-w-7xl h-[800px] bg-dark-card rounded-lg overflow-hidden shadow-xl neon-shadow">
          <div className="flex h-full flex-col md:flex-row">
            <Sidebar
              categories={categories}
              bookmarks={bookmarks}
              selectedCategory={selectedCategory}
              onCategorySelect={setSelectedCategory}
              onAddCategory={addCategory}
              onDeleteCategory={deleteCategory}
              onRenameCategory={renameCategory}
              onUpdateCategoryUrlPattern={updateCategoryUrlPattern}
              onDeleteBookmark={deleteBookmark}
              onCopyBookmark={handleCopy}
              searchTerm={searchTerm}
              onSearch={setSearchTerm}
            />
            <div className="w-full md:w-1/2 bg-dark-card p-6 border-t md:border-t-0 md:border-l border-white/10">
              <div className="flex items-center gap-2 mb-6">
                <LinkIcon className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-semibold text-white">Nouveau signet</h1>
              </div>
              <BookmarkForm onAdd={addBookmark} />
            </div>
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default App;