import React from 'react';
import { Trash2, Copy, ExternalLink, GripVertical } from 'lucide-react';
import { Bookmark } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
}

function SortableBookmark({ bookmark, onDelete, onCopy }: {
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

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(bookmark.url);
    onCopy(bookmark.url);
  };

  const confirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Voulez-vous vraiment supprimer ce signet ?')) {
      onDelete(bookmark.id);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center bg-white p-3 rounded-md shadow-sm hover:shadow-md transition-shadow group"
    >
      <div {...attributes} {...listeners} className="mr-2 cursor-grab">
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>
      <a
        href={bookmark.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 truncate flex-1 flex items-center gap-2"
        title={bookmark.title}
      >
        {bookmark.title}
        <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
      </a>
      <div className="flex items-center gap-2">
        <button
          onClick={handleCopy}
          className="text-gray-500 hover:text-gray-700 p-1"
          title="Copier le lien"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={confirmDelete}
          className="text-red-500 hover:text-red-700 p-1"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function BookmarkList({ bookmarks, onDelete, onCopy }: BookmarkListProps) {
  return (
    <div className="space-y-2">
      {bookmarks.map((bookmark) => (
        <SortableBookmark
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onCopy={onCopy}
        />
      ))}
    </div>
  );
}