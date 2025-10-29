import React from 'react';
import { BookOpen, Heart, Plus, Calendar, User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useBookContext } from '../context/BookContext';
import { truncate } from '../lib/utils';

export const BookCard = ({ book, onViewDetails }) => {
  const { toggleFavorite, isFavorite, addToReadingList, isInReadingList } = useBookContext();
  
  const favorite = isFavorite(book.key);
  const inList = isInReadingList(book.key);

  const handleAddToList = (listType) => {
    addToReadingList(book, listType);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Book Cover */}
        <div className="relative aspect-[3/4] bg-gray-100 dark:bg-gray-800 overflow-hidden">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={book.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2UyZThmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBDb3ZlcjwvdGV4dD48L3N2Zz4=';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-gray-300" />
            </div>
          )}
          
          {/* Favorite Button */}
          <Button
            variant="secondary"
            size="sm"
            className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(book);
            }}
          >
            <Heart className={`h-4 w-4 ${favorite ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>

          {/* Reading List Badge */}
          {inList && (
            <Badge className="absolute top-2 left-2" variant="default">
              {inList === 'wantToRead' && 'Want to Read'}
              {inList === 'currentlyReading' && 'Reading'}
              {inList === 'completed' && 'Completed'}
            </Badge>
          )}
        </div>

        {/* Book Info */}
        <div className="p-4">
          <h3 
            className="font-semibold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
            onClick={() => onViewDetails(book)}
          >
            {book.title}
          </h3>
          
          {book.authors && book.authors.length > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 mb-2">
              <User className="h-3 w-3" />
              <span className="line-clamp-1">{book.authors.join(', ')}</span>
            </div>
          )}

          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 mb-3">
            {book.firstPublishYear && (
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>{book.firstPublishYear}</span>
              </div>
            )}
            {book.editionCount && (
              <span>{book.editionCount} editions</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onViewDetails(book)}
            >
              View Details
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="px-3">
                  <Plus className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleAddToList('wantToRead')}>
                  Want to Read
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToList('currentlyReading')}>
                  Currently Reading
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAddToList('completed')}>
                  Completed
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};