import React, { useState, useEffect } from 'react';
import { Link as LinkIcon } from 'lucide-react';
import { Sidebar } from './components/Sidebar';
import { BookmarkForm } from './components/BookmarkForm';
import { Bookmark, Category } from './types';
import { convertToBoltUrl } from './utils/boltUrl';
import { useKeyboardShortcut } from './hooks/useKeyboardShortcut';
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
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    const savedCategories = saved ? JSON.parse(saved) : [];
    if (!savedCategories.some(c => c.id === DEFAULT_CATEGORY_ID)) {
      return [
        { id: DEFAULT_CATEGORY_ID, name: 'Nouveaux signets' },
        ...savedCategories
      ];
    }
    return savedCategories;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(DEFAULT_CATEGORY_ID);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  useEffect(() => {
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    const categoriesToSave = categories.filter(c => c.id !== DEFAULT_CATEGORY_ID);
    localStorage.setItem('categories', JSON.stringify(categoriesToSave));
  }, [categories]);

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
    
    // Vérifier si le modèle d'URL existe déjà dans une autre catégorie
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

    // Réorganiser les signets existants si nécessaire
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex w-[800px] h-[500px] bg-gray-100 rounded-lg overflow-hidden shadow-xl">
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
          <div className="w-1/2 bg-white p-4 border-l border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <LinkIcon className="w-5 h-5 text-blue-500" />
              <h1 className="text-lg font-semibold text-gray-800">Nouveau signet</h1>
            </div>
            <BookmarkForm onAdd={addBookmark} />
          </div>
        </div>
      </DndContext>
    </div>
  );
}

export default App;