import React from 'react';
import { BookCard } from './BookCard';
import { Skeleton } from './ui/skeleton';
import { BookOpen, Grid3X3, List, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useBookContext } from '../context/BookContext';
import { Badge } from './ui/badge';
import { ButtonGroup } from "@/components/ui/button-group"

export const BookGrid = ({ books, isLoading, onViewDetails }) => {
  const { viewMode, setViewMode } = useBookContext();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {[...Array(10)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="aspect-[2/3] w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-20 w-20 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold mb-2">No books found</h3>
        <p className="text-gray-500 dark:text-gray-400">
          Try adjusting your search or filters
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* View Toggle */}
      <div className="flex justify-end">
        <ButtonGroup>
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </div>

      {/* Books Display */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.key} book={book} onViewDetails={onViewDetails} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {books.map((book) => (
            <BookCardList key={book.key} book={book} onViewDetails={onViewDetails} />
          ))}
        </div>
      )}
    </div>
  );
};

// List view version of book card
const BookCardList = ({ book, onViewDetails }) => {
  const { toggleFavorite, isFavorite, addToReadingList, isInReadingList } = useBookContext();

  const favorite = isFavorite(book.key);
  const inList = isInReadingList(book.key);

  return (
    <div className="flex gap-4 p-4 border rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800">
      {/* Cover Thumbnail */}
      <div className="w-24 h-36 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen className="h-8 w-8 text-gray-300" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3
            className="font-semibold text-lg cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1"
            onClick={() => onViewDetails(book)}
          >
            {book.title}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="flex-shrink-0"
            onClick={() => toggleFavorite(book)}
          >
            <Heart className={`h-5 w-5 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>

        {book.authors && book.authors.length > 0 && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            by {book.authors.join(', ')}
          </p>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          {book.firstPublishYear && (
            <Badge variant="outline">{book.firstPublishYear}</Badge>
          )}
          {book.editionCount && (
            <Badge variant="outline">{book.editionCount} editions</Badge>
          )}
          {inList && (
            <Badge>
              {inList === 'wantToRead' && 'Want to Read'}
              {inList === 'currentlyReading' && 'Reading'}
              {inList === 'completed' && 'Completed'}
            </Badge>
          )}
        </div>

        {book.subjects && book.subjects.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {book.subjects.slice(0, 3).map((subject, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                {subject}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onViewDetails(book)}>
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};