import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Trash2, Copy, ExternalLink, GripVertical, Settings } from 'lucide-react';
import { Category, Bookmark } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useDroppable } from '@dnd-kit/core';
import { detectUrlType } from '../utils/boltUrl';
import { SearchBar } from './SearchBar';
import { BookmarkList } from './BookmarkList';
import { ConfirmationModal } from './ConfirmationModal';

interface SidebarProps {
  categories: Category[];
  bookmarks: Bookmark[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  onAddCategory: () => void;
  onDeleteCategory: (id: string) => void;
  onRenameCategory: (id: string, newName: string) => void;
  onUpdateCategoryUrlPattern: (id: string, urlPattern: string) => void;
  onDeleteBookmark: (id: string) => void;
  onCopyBookmark: (url: string) => void;
  searchTerm: string;
  onSearch: (term: string) => void;
}

function CategoryItem({ 
  category,
  bookmarks,
  isSelected,
  onSelect,
  onRename,
  onDelete,
  onUpdateUrlPattern,
  onDeleteBookmark,
  onCopyBookmark,
  searchTerm
}: {
  category: Category;
  bookmarks: Bookmark[];
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDelete: (id: string) => void;
  onUpdateUrlPattern: (urlPattern: string) => void;
  onDeleteBookmark: (id: string) => void;
  onCopyBookmark: (url: string) => void;
  searchTerm: string;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);
  const [showSettings, setShowSettings] = useState(false);
  const [urlPattern, setUrlPattern] = useState(category.urlPattern || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { setNodeRef, isOver } = useDroppable({
    id: `category-${category.id}`,
  });

  const categoryBookmarks = bookmarks.filter(b => b.categoryId === category.id);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (category.id === 'default') return;
    setIsEditing(true);
    setEditName(category.name);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editName.trim() && editName !== category.name) {
      onRename(editName.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleBlur();
    }
  };

  const handleUrlPatternSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUrlPattern(urlPattern.trim());
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(category.id);
  };

  return (
    <div className="space-y-1" ref={setNodeRef}>
      <div 
        className={`flex items-center p-2 hover:bg-white/5 rounded cursor-pointer group ${
          isSelected ? 'bg-primary/10' : ''
        } ${isOver ? 'bg-primary/20' : ''}`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          onSelect();
        }}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-neutral-text mr-1" />
        ) : (
          <ChevronRight className="w-4 h-4 text-neutral-text mr-1" />
        )}
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-dark-bg border border-white/10 rounded px-2 py-1 text-white"
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span 
            className="flex-1 font-medium text-white"
            onDoubleClick={handleDoubleClick}
          >
            {category.name}
          </span>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-text">{categoryBookmarks.length}</span>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            {category.id !== 'default' && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSettings(!showSettings);
                  }}
                  className="p-1 text-neutral-text hover:text-white hover:bg-white/5 rounded"
                  title="Paramètres de la catégorie"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="p-1 text-error-light hover:text-error hover:bg-error/10 rounded"
                  title="Supprimer la catégorie"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      
      {showSettings && category.id !== 'default' && (
        <div className="ml-6 p-2 bg-dark-bg/50 rounded-md glass-effect" onClick={e => e.stopPropagation()}>
          <form onSubmit={handleUrlPatternSubmit} className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-neutral-text mb-1">
                Type d'URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={urlPattern}
                  onChange={(e) => setUrlPattern(e.target.value)}
                  placeholder="ex: bolt.new"
                  className="flex-1 px-2 py-1 text-sm bg-dark-bg border border-white/10 rounded text-white placeholder-neutral-text"
                />
                <button
                  type="submit"
                  className="px-2 py-1 text-sm bg-gradient-save text-white rounded hover:opacity-90"
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      
      {isExpanded && (
        <div className="ml-6">
          <BookmarkList
            bookmarks={categoryBookmarks}
            onDelete={onDeleteBookmark}
            onCopy={onCopyBookmark}
            searchTerm={searchTerm}
          />
        </div>
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer la catégorie"
        message={`Êtes-vous sûr de vouloir supprimer la catégorie "${category.name}" ? Les signets seront déplacés vers "Nouveaux signets".`}
        confirmLabel="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </div>
  );
}

export function Sidebar({
  categories,
  bookmarks,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onDeleteCategory,
  onRenameCategory,
  onUpdateCategoryUrlPattern,
  onDeleteBookmark,
  onCopyBookmark,
  searchTerm,
  onSearch,
}: SidebarProps) {
  const [searchFilter, setSearchFilter] = useState<string>('all');

  const filterBookmarks = (bookmarks: Bookmark[]) => {
    if (!searchTerm) return bookmarks;

    return bookmarks.filter(bookmark => {
      const term = searchTerm.toLowerCase();
      const titleMatch = bookmark.title.toLowerCase().includes(term);
      const urlMatch = bookmark.url.toLowerCase().includes(term);

      switch (searchFilter) {
        case 'title':
          return titleMatch;
        case 'url':
          return urlMatch;
        default:
          return titleMatch || urlMatch;
      }
    });
  };

  const filteredBookmarks = filterBookmarks(bookmarks);

  return (
    <div className="w-1/2 bg-dark-card p-4 flex flex-col h-full">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-4">
          <SearchBar
            searchTerm={searchTerm}
            onSearch={onSearch}
            onFilterChange={setSearchFilter}
            activeFilter={searchFilter}
            resultCount={filteredBookmarks.length}
          />
          <button
            onClick={onAddCategory}
            className="p-2 text-neutral-text hover:text-white hover:bg-white/5 rounded-md"
            title="Nouvelle catégorie"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {categories.map((category) => (
          <CategoryItem
            key={category.id}
            category={category}
            bookmarks={filteredBookmarks}
            isSelected={category.id === selectedCategory}
            onSelect={() => onCategorySelect(category.id)}
            onRename={(newName) => onRenameCategory(category.id, newName)}
            onDelete={onDeleteCategory}
            onUpdateUrlPattern={(urlPattern) => onUpdateCategoryUrlPattern(category.id, urlPattern)}
            onDeleteBookmark={onDeleteBookmark}
            onCopyBookmark={onCopyBookmark}
            searchTerm={searchTerm}
          />
        ))}
      </div>
    </div>
  );
}