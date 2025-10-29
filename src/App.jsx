import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookProvider } from './context/BookContext';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { BookGrid } from './components/BookGrid';
import { BookModal } from './components/BookModal';
import { ReadingListModal } from './components/ReadingList';
import { useBookSearch } from './hooks/useBookSearch';
import { useDebounce } from './hooks/useDebounce';
import { Button } from './components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function AppContent() {
  const [filters, setFilters] = useState({
    query: '',
    author: '',
    subject: '',
    yearFrom: '',
    yearTo: ''
  });

  const [page, setPage] = useState(1);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showReadingLists, setShowReadingLists] = useState(false);
  const [readingListTab, setReadingListTab] = useState('all');

  // Debounce search query
  const debouncedQuery = useDebounce(filters.query, 500);
  const debouncedAuthor = useDebounce(filters.author, 500);
  const debouncedSubject = useDebounce(filters.subject, 500);

  // Build search query
  const searchQuery = [
    debouncedQuery,
    debouncedAuthor && `author:"${debouncedAuthor}"`,
    debouncedSubject && `subject:"${debouncedSubject}"`,
  ].filter(Boolean).join(' ');

  // Fetch books
  const { data, isLoading, error } = useBookSearch({
    query: searchQuery,
    page,
    limit: 20,
    enabled: searchQuery.length > 0
  });

  // Filter by year if needed
  const filteredBooks = data?.docs?.filter(book => {
    if (!book.firstPublishYear) return true;
    const year = book.firstPublishYear;
    const fromYear = filters.yearFrom ? parseInt(filters.yearFrom) : null;
    const toYear = filters.yearTo ? parseInt(filters.yearTo) : null;

    if (fromYear && year < fromYear) return false;
    if (toYear && year > toYear) return false;
    return true;
  }) || [];

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [debouncedQuery, debouncedAuthor, debouncedSubject]);

  const handleSearch = () => {
    setPage(1);
  };

  const handleViewDetails = (book) => {
    setSelectedBook(book);
  };

  const handleShowReadingLists = (tab = 'all') => {
    setReadingListTab(tab);
    setShowReadingLists(true);
  };

  const totalPages = data ? Math.ceil(data.numFound / 20) : 0;
  const hasSearchQuery = searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar 
        onShowReadingLists={handleShowReadingLists}
        onShowFavorites={() => handleShowReadingLists('favorites')}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Find Your Next Great Read
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Search from millions of books in the Open Library
            </p>
          </div>
          
          <SearchBar 
            onSearch={handleSearch}
            filters={filters}
            setFilters={setFilters}
          />
        </div>

        {/* Results Section */}
        {hasSearchQuery ? (
          <>
            {/* Results Info */}
            {data && !isLoading && (
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-600 dark:text-gray-400">
                  Found <span className="font-semibold">{data.numFound.toLocaleString()}</span> results
                  {filteredBooks.length !== data.docs.length && (
                    <span> (showing {filteredBooks.length} after filters)</span>
                  )}
                </p>
                
                {/* Pagination Info */}
                {totalPages > 1 && (
                  <p className="text-sm text-gray-500">
                    Page {page} of {totalPages}
                  </p>
                )}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">
                  Oops! Something went wrong while searching.
                </p>
                <Button onClick={handleSearch} variant="outline">
                  Try Again
                </Button>
              </div>
            )}

            {/* Books Grid */}
            <BookGrid 
              books={filteredBooks}
              isLoading={isLoading}
              onViewDetails={handleViewDetails}
            />

            {/* Pagination */}
            {!isLoading && filteredBooks.length > 0 && totalPages > 1 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Welcome State */
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-semibold mb-4">Welcome to BookFinder!</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Start by searching for a book title, author, or subject in the search bar above.
                You can also use advanced filters to narrow down your results.
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-semibold mb-2">📚 Search Books</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Search by title, author, or subject to discover books from millions of titles
                  </p>
                </div>
                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-semibold mb-2">❤️ Save Favorites</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Mark books as favorites and organize them into reading lists
                  </p>
                </div>
                <div className="p-6 border rounded-lg bg-white dark:bg-gray-900">
                  <h4 className="font-semibold mb-2">📖 Track Reading</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Keep track of books you want to read, are reading, or have completed
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <BookModal
        book={selectedBook}
        isOpen={!!selectedBook}
        onClose={() => setSelectedBook(null)}
      />

      <ReadingListModal
        isOpen={showReadingLists}
        onClose={() => setShowReadingLists(false)}
        initialTab={readingListTab}
        onViewDetails={handleViewDetails}
      />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BookProvider>
        <AppContent />
      </BookProvider>
    </QueryClientProvider>
  );
}

export default App;