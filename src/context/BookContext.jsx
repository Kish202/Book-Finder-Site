import React, { createContext, useContext, useState, useEffect } from 'react';
import { saveToLocalStorage, getFromLocalStorage } from '../lib/utils';

const BookContext = createContext();

export const useBookContext = () => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBookContext must be used within BookProvider');
  }
  return context;
};

export const BookProvider = ({ children }) => {
  const [readingLists, setReadingLists] = useState(() => 
    getFromLocalStorage('readingLists', {
      wantToRead: [],
      currentlyReading: [],
      completed: []
    })
  );

  const [favorites, setFavorites] = useState(() => 
    getFromLocalStorage('favorites', [])
  );

  const [recentSearches, setRecentSearches] = useState(() => 
    getFromLocalStorage('recentSearches', [])
  );

  const [viewMode, setViewMode] = useState(() => 
    getFromLocalStorage('viewMode', 'grid')
  );

  const [theme, setTheme] = useState(() => 
    getFromLocalStorage('theme', 'light')
  );

  useEffect(() => {
    saveToLocalStorage('readingLists', readingLists);
  }, [readingLists]);

  useEffect(() => {
    saveToLocalStorage('favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    saveToLocalStorage('recentSearches', recentSearches);
  }, [recentSearches]);

  useEffect(() => {
    saveToLocalStorage('viewMode', viewMode);
  }, [viewMode]);

  useEffect(() => {
    saveToLocalStorage('theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const addToReadingList = (book, listType) => {
    setReadingLists(prev => {
      const newLists = {
        wantToRead: prev.wantToRead.filter(b => b.key !== book.key),
        currentlyReading: prev.currentlyReading.filter(b => b.key !== book.key),
        completed: prev.completed.filter(b => b.key !== book.key)
      };
      newLists[listType] = [...newLists[listType], { ...book, addedAt: Date.now() }];
      
      return newLists;
    });
  };

  const removeFromReadingList = (bookKey, listType) => {
    setReadingLists(prev => ({
      ...prev,
      [listType]: prev[listType].filter(book => book.key !== bookKey)
    }));
  };

  const isInReadingList = (bookKey) => {
    for (const list in readingLists) {
      if (readingLists[list].some(book => book.key === bookKey)) {
        return list;
      }
    }
    return null;
  };

  const toggleFavorite = (book) => {
    setFavorites(prev => {
      const exists = prev.some(b => b.key === book.key);
      if (exists) {
        return prev.filter(b => b.key !== book.key);
      } else {
        return [...prev, { ...book, favoritedAt: Date.now() }];
      }
    });
  };

  const isFavorite = (bookKey) => {
    return favorites.some(book => book.key === bookKey);
  };

  const addRecentSearch = (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    setRecentSearches(prev => {
      const filtered = prev.filter(s => s.query !== searchQuery);
      const newSearches = [
        { query: searchQuery, timestamp: Date.now() },
        ...filtered
      ];
      return newSearches.slice(0, 10);
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value = {
    // Reading Lists
    readingLists,
    addToReadingList,
    removeFromReadingList,
    isInReadingList,
    
    // Favorites
    favorites,
    toggleFavorite,
    isFavorite,
    
    // Recent Searches
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
    
    // View Mode
    viewMode,
    setViewMode,
    
    // Theme
    theme,
    toggleTheme
  };

  return (
    <BookContext.Provider value={value}>
      {children}
    </BookContext.Provider>
  );
};