import React, { useState } from 'react';
import { Trash2, Copy, ExternalLink, GripVertical } from 'lucide-react';
import { Bookmark } from '../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ConfirmationModal } from './ConfirmationModal';

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
  searchTerm: string;
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
  
  return (
    <span>
      {parts.map((part, i) => 
        part.toLowerCase() === highlight.toLowerCase() ? (
          <span key={i} className="bg-primary/20 text-primary font-medium">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

function SortableBookmark({ 
  bookmark,
  onDelete,
  onCopy,
  searchTerm
}: {
  bookmark: Bookmark;
  onDelete: (id: string) => void;
  onCopy: (url: string) => void;
  searchTerm: string;
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  
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
    try {
      await navigator.clipboard.writeText(bookmark.url);
      onCopy(bookmark.url);
      setShowCopyNotification(true);
      setTimeout(() => setShowCopyNotification(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    setShowDeleteModal(false);
    onDelete(bookmark.id);
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="flex items-center p-1.5 hover:bg-white/5 rounded-md group relative"
      >
        <div {...attributes} {...listeners} className="cursor-grab mr-1.5">
          <GripVertical className="w-4 h-4 text-neutral-text" />
        </div>
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 min-w-0 text-sm text-primary hover:text-primary-light truncate flex items-center gap-1"
          title={bookmark.title}
        >
          <HighlightText text={bookmark.title} highlight={searchTerm} />
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 flex-shrink-0" />
        </a>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
          <button
            onClick={handleCopy}
            className="p-1 text-neutral-text hover:text-white relative"
            title="Copier le lien"
          >
            <Copy className="w-3 h-3" />
            {showCopyNotification && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-primary rounded whitespace-nowrap">
                Copié !
              </div>
            )}
          </button>
          <button
            onClick={handleDeleteClick}
            className="p-1 text-error-light hover:text-error"
            title="Supprimer"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showDeleteModal}
        title="Supprimer le signet"
        message={`Êtes-vous sûr de vouloir supprimer le signet "${bookmark.title}" ?`}
        confirmLabel="Supprimer"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        type="danger"
      />
    </>
  );
}

export function BookmarkList({ bookmarks, onDelete, onCopy, searchTerm }: BookmarkListProps) {
  return (
    <div className="space-y-1">
      {bookmarks.map((bookmark) => (
        <SortableBookmark
          key={bookmark.id}
          bookmark={bookmark}
          onDelete={onDelete}
          onCopy={onCopy}
          searchTerm={searchTerm}
        />
      ))}
    </div>
  );
}