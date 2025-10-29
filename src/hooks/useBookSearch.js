import { useQuery } from '@tanstack/react-query';
import { searchBooks, formatBookData } from '../lib/api';

export const useBookSearch = ({ query, author, subject, page = 1, limit = 20, enabled = true }) => {
  return useQuery({
    queryKey: ['books', { query, author, subject, page, limit }],
    queryFn: async () => {
      const data = await searchBooks({ query, author, subject, page, limit });
      return {
        ...data,
        docs: data.docs.map(formatBookData)
      };
    },
    enabled: enabled && (!!query || !!author || !!subject),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000, 
  });
};