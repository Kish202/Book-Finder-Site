// API functions for Open Library

const BASE_URL = 'https://openlibrary.org';

/**
 * Search books with various parameters
 */
export const searchBooks = async ({ 
  query = '', 
  author = '', 
  subject = '',
  page = 1,
  limit = 20 
}) => {
  const params = new URLSearchParams();
  
  if (query) params.append('q', query);
  if (author) params.append('author', author);
  if (subject) params.append('subject', subject);
  
  params.append('page', page);
  params.append('limit', limit);
  params.append('fields', 'key,title,author_name,first_publish_year,isbn,cover_i,publisher,language,subject,edition_count,number_of_pages_median');

  const response = await fetch(`${BASE_URL}/search.json?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }
  
  return response.json();
};

/**
 * Get book cover URL
 */
export const getCoverUrl = (coverId, size = 'M') => {
  if (!coverId) return null;
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
};

/**
 * Get book details by key
 */
export const getBookDetails = async (bookKey) => {
  const response = await fetch(`${BASE_URL}${bookKey}.json`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch book details');
  }
  
  return response.json();
};

/**
 * Format book data for consistent use
 */
export const formatBookData = (book) => {
  return {
    key: book.key,
    title: book.title,
    authors: book.author_name || [],
    firstPublishYear: book.first_publish_year,
    isbn: book.isbn?.[0],
    coverId: book.cover_i,
    coverUrl: getCoverUrl(book.cover_i, 'M'),
    coverUrlLarge: getCoverUrl(book.cover_i, 'L'),
    publishers: book.publisher || [],
    languages: book.language || [],
    subjects: book.subject?.slice(0, 10) || [],
    editionCount: book.edition_count,
    pageCount: book.number_of_pages_median,
  };
};