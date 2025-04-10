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

function App() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    const saved = localStorage.getItem('bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('categories');
    return saved ? JSON.parse(saved) : [];
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

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
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const addBookmark = (title: string, url: string) => {
    const processedUrl = url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`;
    const boltUrl = convertToBoltUrl(processedUrl);

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title: title.trim(),
      url: boltUrl,
      categoryId: selectedCategory || (categories.length > 0 ? categories[0].id : '')
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
    if (!selectedCategory) {
      setSelectedCategory(newCategory.id);
    }
  };

  const renameCategory = (id: string, newName: string) => {
    setCategories(categories.map(category =>
      category.id === id ? { ...category, name: newName } : category
    ));
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
            onRenameCategory={renameCategory}
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