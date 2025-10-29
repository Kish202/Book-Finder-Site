import React, { useState } from 'react';
import { Search, Filter, X, Clock } from 'lucide-react';
import { Input } from './ui/input';
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

export const SearchBar = ({ onSearch, filters, setFilters }) => {
  const { recentSearches, addRecentSearch, clearRecentSearches } = useBookContext();
  const [showRecent, setShowRecent] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, query: value }));
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (filters.query.trim()) {
      addRecentSearch(filters.query);
      onSearch();
    }
  };

  const handleRecentSearchClick = (query) => {
    setFilters(prev => ({ ...prev, query }));
    setShowRecent(false);
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      author: '',
      subject: '',
      yearFrom: '',
      yearTo: ''
    });
  };

  const hasActiveFilters = filters.author || filters.subject || filters.yearFrom || filters.yearTo;

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSearchSubmit} className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search books by title..."
            value={filters.query}
            onChange={handleSearchChange}
            onFocus={() => setShowRecent(true)}
            onBlur={() => setTimeout(() => setShowRecent(false), 200)}
            className="pl-10 pr-20 h-12 text-lg"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-2">
            {filters.query && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  type="button" 
                  variant={hasActiveFilters ? "default" : "outline"} 
                  size="sm"
                  className="h-8"
                >
                  <Filter className="h-4 w-4 mr-1" />
                  Filters
                  {hasActiveFilters && (
                    <Badge variant="secondary" className="ml-2 h-5 px-1">
                      {[filters.author, filters.subject, filters.yearFrom, filters.yearTo]
                        .filter(Boolean).length}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Advanced Filters</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="p-4 space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Author</label>
                    <Input
                      placeholder="e.g., J.K. Rowling"
                      value={filters.author}
                      onChange={(e) => setFilters(prev => ({ ...prev, author: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject/Genre</label>
                    <Input
                      placeholder="e.g., Science Fiction"
                      value={filters.subject}
                      onChange={(e) => setFilters(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Year From</label>
                      <Input
                        type="number"
                        placeholder="1990"
                        value={filters.yearFrom}
                        onChange={(e) => setFilters(prev => ({ ...prev, yearFrom: e.target.value }))}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Year To</label>
                      <Input
                        type="number"
                        placeholder="2024"
                        value={filters.yearTo}
                        onChange={(e) => setFilters(prev => ({ ...prev, yearTo: e.target.value }))}
                      />
                    </div>
                  </div>
                  {hasActiveFilters && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearFilters}
                      className="w-full"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {showRecent && recentSearches.length > 0 && (
          <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-2 border-b">
              <span className="text-sm font-medium text-gray-500">Recent Searches</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearRecentSearches}
                className="h-6 text-xs"
              >
                Clear
              </Button>
            </div>
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => handleRecentSearchClick(search.query)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
              >
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{search.query}</span>
              </button>
            ))}
          </div>
        )}
      </form>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.author && (
            <Badge variant="secondary" className="gap-1">
              Author: {filters.author}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, author: '' }))}
              />
            </Badge>
          )}
          {filters.subject && (
            <Badge variant="secondary" className="gap-1">
              Subject: {filters.subject}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, subject: '' }))}
              />
            </Badge>
          )}
          {(filters.yearFrom || filters.yearTo) && (
            <Badge variant="secondary" className="gap-1">
              Year: {filters.yearFrom || '...'} - {filters.yearTo || '...'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, yearFrom: '', yearTo: '' }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};