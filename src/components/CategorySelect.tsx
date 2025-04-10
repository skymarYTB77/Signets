import React from 'react';
import { FolderPlus } from 'lucide-react';
import { Category } from '../types';

interface CategorySelectProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  onAddCategory: () => void;
}

export function CategorySelect({ categories, selectedCategory, onCategoryChange, onAddCategory }: CategorySelectProps) {
  return (
    <div className="flex gap-2">
      <select
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Tous les signets</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
      <button
        onClick={onAddCategory}
        className="p-2 text-blue-500 hover:text-blue-600 bg-blue-50 rounded-md"
        title="Ajouter une catégorie"
      >
        <FolderPlus className="w-5 h-5" />
      </button>
    </div>
  );
}