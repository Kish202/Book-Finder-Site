import React from 'react';
import { BookOpen, Moon, Sun, Library, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useBookContext } from '../context/BookContext';

export const Navbar = ({ onShowReadingLists, onShowFavorites }) => {
  const { theme, toggleTheme, readingLists, favorites } = useBookContext();

  const totalBooks = Object.values(readingLists).reduce((sum, list) => sum + list.length, 0);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 dark:bg-gray-900/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:supports-[backdrop-filter]:bg-gray-900/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-lg border">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold">BookFinder</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Discover your next read</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Favorites */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onShowFavorites}
              className="relative"
            >
              <Heart className="h-5 w-5" />
              {favorites.length > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {favorites.length}
                </Badge>
              )}
            </Button>

            {/* Reading Lists */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="relative">
                  <Library className="h-5 w-5" />
                  {totalBooks > 0 && (
                    <Badge 
                      variant="default" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {totalBooks}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Reading Lists</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onShowReadingLists('wantToRead')}>
                  <div className="flex items-center justify-between w-full">
                    <span>Want to Read</span>
                    <Badge variant="secondary">{readingLists.wantToRead.length}</Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowReadingLists('currentlyReading')}>
                  <div className="flex items-center justify-between w-full">
                    <span>Currently Reading</span>
                    <Badge variant="secondary">{readingLists.currentlyReading.length}</Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onShowReadingLists('completed')}>
                  <div className="flex items-center justify-between w-full">
                    <span>Completed</span>
                    <Badge variant="secondary">{readingLists.completed.length}</Badge>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => onShowReadingLists('all')}>
                  View All Lists
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
            >
              {theme === 'light' ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};