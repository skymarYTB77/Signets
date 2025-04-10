import React, { useState } from 'react';
import { Search, Plus, ChevronDown, ChevronRight, Trash2, Copy, ExternalLink } from 'lucide-react';
import { Category, Bookmark } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface SidebarProps {
  categories: Category[];
  bookmarks: Bookmark[];
  selectedCategory: string;
  onCategorySelect: (id: string) => void;
  onAddCategory: () => void;
  onRenameCategory: (id: string, newName: string) => void;
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
  onDeleteBookmark,
  onCopyBookmark 
}: {
  category: Category;
  bookmarks: Bookmark[];
  isSelected: boolean;
  onSelect: () => void;
  onRename: (newName: string) => void;
  onDeleteBookmark: (id: string) => void;
  onCopyBookmark: (url: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(category.name);

  const categoryBookmarks = bookmarks.filter(b => b.categoryId === category.id);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center p-2 hover:bg-gray-100 rounded cursor-pointer ${
          isSelected ? 'bg-blue-50' : ''
        }`}
        onClick={() => {
          setIsExpanded(!isExpanded);
          onSelect();
        }}
      >
        {isExpanded ? (
          <ChevronDown className="w-4 h-4 text-gray-500 mr-1" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-500 mr-1" />
        )}
        {isEditing ? (
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-white border rounded px-2 py-1"
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span 
            className="flex-1 font-medium"
            onDoubleClick={handleDoubleClick}
          >
            {category.name}
          </span>
        )}
        <span className="text-sm text-gray-500">{categoryBookmarks.length}</span>
      </div>
      
      {isExpanded && (
        <div className="ml-6 space-y-1">
          {categoryBookmarks.map(bookmark => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onDelete={onDeleteBookmark}
              onCopy={onCopyBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function BookmarkItem({ 
  bookmark,
  onDelete,
  onCopy 
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: bookmark.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCopy(bookmark.url);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer ce signet ?')) {
      onDelete(bookmark.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex items-center p-2 hover:bg-gray-100 rounded-md group"
    >
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 text-sm text-gray-700 hover:text-blue-600 truncate flex items-center gap-1"
        onClick={(e) => e.stopPropagation()}
      >
        {bookmark.title}
        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100" />
      </a>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
        <button
          onClick={handleCopy}
          className="p-1 text-gray-500 hover:text-gray-700"
          title="Copier le lien"
        >
          <Copy className="w-3 h-3" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 text-red-500 hover:text-red-700"
          title="Supprimer"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

export function Sidebar({
  categories,
  bookmarks,
  selectedCategory,
  onCategorySelect,
  onAddCategory,
  onRenameCategory,
  onDeleteBookmark,
  onCopyBookmark,
  searchTerm,
  onSearch,
}: SidebarProps) {
  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-1/2 bg-white p-4 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={onAddCategory}
          className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          title="Nouvelle catégorie"
        >
          <Plus className="w-5 h-5" />
        </button>
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
            onDeleteBookmark={onDeleteBookmark}
            onCopyBookmark={onCopyBookmark}
          />
        ))}
      </div>
    </div>
  );
}