import React from 'react';
import { X, Heart, Calendar, BookOpen, Globe, Hash, Users } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { useBookContext } from '../context/BookContext';

export const BookModal = ({ book, isOpen, onClose }) => {
  const { toggleFavorite, isFavorite, addToReadingList, isInReadingList } = useBookContext();

  if (!book) return null;

  const favorite = isFavorite(book.key);
  const inList = isInReadingList(book.key);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="min-w-[50%] max-h-[90vh] p-0 [&>button]:text-white">
        <ScrollArea className="max-h-[90vh]">
          <div className="relative">
            {/* Header with cover background */}
            <div className="relative h-64 bg-gradient-to-b from-gray-900 to-gray-800 rounded-t-md">
              {book.coverUrlLarge && (
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 blur-sm"
                  style={{ backgroundImage: `url(${book.coverUrlLarge})` }}
                />
              )}
              
              <div className="relative h-full flex items-end p-6">
                <div className="flex gap-6 items-end">
                  {/* Cover Image */}
                  <div className="w-40 h-56 flex-shrink-0 bg-white dark:bg-gray-700 rounded-lg shadow-2xl overflow-hidden">
                    {book.coverUrlLarge ? (
                      <img
                        src={book.coverUrlLarge}
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <BookOpen className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Title and Quick Info */}
                  <div className="flex-1 pb-2">
                    <DialogTitle className="text-3xl font-bold text-white mb-2 pr-10">
                      {book.title}
                    </DialogTitle>
                    {book.authors && book.authors.length > 0 && (
                      <p className="text-xl text-gray-300 mb-3">
                        by {book.authors.join(', ')}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {book.firstPublishYear && (
                        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                          {book.firstPublishYear}
                        </Badge>
                      )}
                      {inList && (
                        <Badge className="bg-blue-500 text-white">
                          {inList === 'wantToRead' && 'Want to Read'}
                          {inList === 'currentlyReading' && 'Currently Reading'}
                          {inList === 'completed' && 'Completed'}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Action Buttons */}
              <div className="flex gap-2 mb-6">
                <Button
                  variant={favorite ? "default" : "outline"}
                  onClick={() => toggleFavorite(book)}
                  className="flex-1"
                >
                  <Heart className={`h-4 w-4 mr-2 ${favorite ? 'fill-current' : ''}`} />
                  {favorite ? 'Favorited' : 'Add to Favorites'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addToReadingList(book, 'wantToRead')}
                  className="flex-1"
                >
                  Want to Read
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addToReadingList(book, 'currentlyReading')}
                  className="flex-1"
                >
                  Currently Reading
                </Button>
                <Button
                  variant="outline"
                  onClick={() => addToReadingList(book, 'completed')}
                  className="flex-1"
                >
                  Completed
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Book Details Grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                {/* Left Column */}
                <div className="space-y-4">
                  <DetailItem
                    icon={<Calendar className="h-5 w-5" />}
                    label="First Published"
                    value={book.firstPublishYear || 'Unknown'}
                  />
                  
                  {book.publishers && book.publishers.length > 0 && (
                    <DetailItem
                      icon={<Users className="h-5 w-5" />}
                      label="Publishers"
                      value={book.publishers.slice(0, 3).join(', ')}
                    />
                  )}

                  {book.isbn && (
                    <DetailItem
                      icon={<Hash className="h-5 w-5" />}
                      label="ISBN"
                      value={book.isbn}
                    />
                  )}

                  {book.languages && book.languages.length > 0 && (
                    <DetailItem
                      icon={<Globe className="h-5 w-5" />}
                      label="Languages"
                      value={book.languages.join(', ')}
                    />
                  )}
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  {book.editionCount && (
                    <DetailItem
                      icon={<BookOpen className="h-5 w-5" />}
                      label="Editions"
                      value={`${book.editionCount} editions`}
                    />
                  )}

                  {book.pageCount && (
                    <DetailItem
                      icon={<BookOpen className="h-5 w-5" />}
                      label="Pages"
                      value={`${book.pageCount} pages (median)`}
                    />
                  )}
                </div>
              </div>

              {/* Subjects/Genres */}
              {book.subjects && book.subjects.length > 0 && (
                <>
                  <Separator className="my-6" />
                  <div>
                    <h3 className="font-semibold text-lg mb-3">Subjects & Genres</h3>
                    <div className="flex flex-wrap gap-2">
                      {book.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="outline">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Links */}
              <Separator className="my-6" />
              <div>
                <h3 className="font-semibold text-lg mb-3">External Links</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a
                      href={`https://openlibrary.org${book.key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View on Open Library
                    </a>
                  </Button>
                  {book.isbn && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                    >
                      <a
                        href={`https://www.google.com/search?q=${encodeURIComponent(book.title + ' ' + (book.authors?.[0] || ''))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Search Online
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

// Helper component for detail items
const DetailItem = ({ icon, label, value }) => (
  <div className="flex gap-3">
    <div className="text-gray-400 flex-shrink-0 mt-0.5">{icon}</div>
    <div className="flex-1">
      <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);