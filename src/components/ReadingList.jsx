import React from 'react';
import { X, Trash2, Download, BookOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { useBookContext } from '../context/BookContext';
import { formatDate } from '../lib/utils';

export const ReadingListModal = ({ isOpen, onClose, initialTab = 'all', onViewDetails }) => {
  const { readingLists, removeFromReadingList, favorites, toggleFavorite } = useBookContext();

  const exportList = (listType) => {
    let books = [];
    let filename = '';

    if (listType === 'all') {
      books = [
        ...readingLists.wantToRead,
        ...readingLists.currentlyReading,
        ...readingLists.completed
      ];
      filename = 'all-reading-lists.json';
    } else if (listType === 'favorites') {
      books = favorites;
      filename = 'favorite-books.json';
    } else {
      books = readingLists[listType];
      filename = `${listType}-books.json`;
    }

    const dataStr = JSON.stringify(books, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[50%] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>My Reading Lists</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={initialTab} className="flex-1">
          <div className="px-6">
            <TabsList className="w-full justify-start">
              <TabsTrigger value="all">
                All ({Object.values(readingLists).reduce((sum, list) => sum + list.length, 0)})
              </TabsTrigger>
              <TabsTrigger value="wantToRead">
                Want to Read ({readingLists.wantToRead.length})
              </TabsTrigger>
              <TabsTrigger value="currentlyReading">
                Currently Reading ({readingLists.currentlyReading.length})
              </TabsTrigger>
              <TabsTrigger value="completed">
                Completed ({readingLists.completed.length})
              </TabsTrigger>
              <TabsTrigger value="favorites">
                Favorites ({favorites.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="h-[60vh] px-6">
            <TabsContent value="all" className="mt-4">
              <div className="space-y-6">
                {readingLists.wantToRead.length > 0 && (
                  <ListSection
                    title="Want to Read"
                    books={readingLists.wantToRead}
                    listType="wantToRead"
                    onRemove={removeFromReadingList}
                    onViewDetails={onViewDetails}
                    onExport={() => exportList('wantToRead')}
                  />
                )}
                {readingLists.currentlyReading.length > 0 && (
                  <ListSection
                    title="Currently Reading"
                    books={readingLists.currentlyReading}
                    listType="currentlyReading"
                    onRemove={removeFromReadingList}
                    onViewDetails={onViewDetails}
                    onExport={() => exportList('currentlyReading')}
                  />
                )}
                {readingLists.completed.length > 0 && (
                  <ListSection
                    title="Completed"
                    books={readingLists.completed}
                    listType="completed"
                    onRemove={removeFromReadingList}
                    onViewDetails={onViewDetails}
                    onExport={() => exportList('completed')}
                  />
                )}
                {Object.values(readingLists).every(list => list.length === 0) && (
                  <EmptyState message="No books in your reading lists yet" />
                )}
              </div>
            </TabsContent>

            <TabsContent value="wantToRead" className="mt-4">
              {readingLists.wantToRead.length > 0 ? (
                <ListSection
                  books={readingLists.wantToRead}
                  listType="wantToRead"
                  onRemove={removeFromReadingList}
                  onViewDetails={onViewDetails}
                  onExport={() => exportList('wantToRead')}
                />
              ) : (
                <EmptyState message="No books in 'Want to Read' list" />
              )}
            </TabsContent>

            <TabsContent value="currentlyReading" className="mt-4">
              {readingLists.currentlyReading.length > 0 ? (
                <ListSection
                  books={readingLists.currentlyReading}
                  listType="currentlyReading"
                  onRemove={removeFromReadingList}
                  onViewDetails={onViewDetails}
                  onExport={() => exportList('currentlyReading')}
                />
              ) : (
                <EmptyState message="No books in 'Currently Reading' list" />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              {readingLists.completed.length > 0 ? (
                <ListSection
                  books={readingLists.completed}
                  listType="completed"
                  onRemove={removeFromReadingList}
                  onViewDetails={onViewDetails}
                  onExport={() => exportList('completed')}
                />
              ) : (
                <EmptyState message="No books in 'Completed' list" />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="mt-4">
              {favorites.length > 0 ? (
                <FavoritesSection
                  books={favorites}
                  onRemove={toggleFavorite}
                  onViewDetails={onViewDetails}
                  onExport={() => exportList('favorites')}
                />
              ) : (
                <EmptyState message="No favorite books yet" />
              )}
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

const ListSection = ({ title, books, listType, onRemove, onViewDetails, onExport }) => (
  <div className="space-y-3">
    {title && (
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg">{title}</h3>
        <Button variant="outline" size="sm" onClick={onExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    )}
    <div className="space-y-2">
      {books.map((book) => (
        <BookListItem
          key={book.key}
          book={book}
          onRemove={() => onRemove(book.key, listType)}
          onViewDetails={() => onViewDetails(book)}
        />
      ))}
    </div>
  </div>
);

const FavoritesSection = ({ books, onRemove, onViewDetails, onExport }) => (
  <div className="space-y-3">
    <div className="flex items-center justify-between">
      <Button variant="outline" size="sm" onClick={onExport}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </Button>
    </div>
    <div className="space-y-2">
      {books.map((book) => (
        <BookListItem
          key={book.key}
          book={book}
          onRemove={() => onRemove(book)}
          onViewDetails={() => onViewDetails(book)}
        />
      ))}
    </div>
  </div>
);

const BookListItem = ({ book, onRemove, onViewDetails }) => (
  <div className="flex gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
    <div className="w-12 h-16 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
      {book.coverUrl ? (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-gray-300" />
        </div>
      )}
    </div>
    <div className="flex-1 min-w-0">
      <h4 
        className="font-medium text-sm line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
        onClick={onViewDetails}
      >
        {book.title}
      </h4>
      {book.authors && book.authors.length > 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
          {book.authors.join(', ')}
        </p>
      )}
      {book.addedAt && (
        <p className="text-xs text-gray-400 mt-1">
          Added {formatDate(book.addedAt)}
        </p>
      )}
    </div>
    <Button
      variant="ghost"
      size="sm"
      onClick={onRemove}
      className="flex-shrink-0"
    >
      <Trash2 className="h-4 w-4 text-red-500" />
    </Button>
  </div>
);

const EmptyState = ({ message }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <BookOpen className="h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
    <p className="text-gray-500 dark:text-gray-400">{message}</p>
  </div>
);