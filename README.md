# 📚 BookFinder - Your Personal Book Discovery Platform

A modern, feature-rich book search application built with React, Vite, Tailwind CSS, and shadcn/ui. Search through millions of books from the Open Library API.

## ✨ Features

### 🔍 Smart Search
- **Multi-field Search**: Search by title, author, or subject
- **Advanced Filters**: Filter by publication year range
- **Debounced Search**: Optimized search with 500ms debounce
- **Recent Searches**: Quick access to your last 10 searches

### 📖 Book Management
- **Reading Lists**: Organize books into three categories:
  - Want to Read
  - Currently Reading
  - Completed
- **Favorites**: Mark and save your favorite books
- **Export Functionality**: Export your lists as JSON

### 🎨 User Experience
- **Grid/List View Toggle**: Choose your preferred viewing mode
- **Dark/Light Mode**: Full theme support with system persistence
- **Responsive Design**: Works beautifully on all devices
- **Loading States**: Skeleton loaders for better UX
- **Empty States**: Helpful messages when no content
- **Pagination**: Navigate through large result sets

### 📚 Book Details
- **Comprehensive Information**: 
  - Cover images with fallbacks
  - Author information
  - Publication year
  - ISBN
  - Publisher details
  - Language information
  - Subject tags
  - Edition count
  - Page count (median)
- **External Links**: Direct links to Open Library and web search

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Install Dependencies**
```bash
npm install
```

2. **Install Required Packages**
```bash
# Core dependencies
npm install @tanstack/react-query lucide-react date-fns

# shadcn/ui components
npx shadcn@latest add button input card badge dialog select tabs dropdown-menu skeleton scroll-area separator toggle sonner slider
```

3. **Run Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
```

## 📁 Project Structure

```
book-finder/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── SearchBar.jsx    # Search component with filters
│   │   ├── BookCard.jsx     # Individual book display
│   │   ├── BookGrid.jsx     # Grid/List view
│   │   ├── BookModal.jsx    # Detailed book view
│   │   ├── ReadingList.jsx  # Reading lists modal
│   │   └── Navbar.jsx       # Navigation bar
│   ├── context/
│   │   └── BookContext.jsx  # Global state management
│   ├── hooks/
│   │   ├── useDebounce.js   # Debounce hook
│   │   └── useBookSearch.js # React Query hook
│   ├── lib/
│   │   ├── api.js           # Open Library API functions
│   │   └── utils.js         # Helper utilities
│   ├── App.jsx              # Main application
│   ├── main.jsx             # Entry point
│   └── index.css            # Global styles
└── package.json
```

## 🎯 Key Technologies

- **React 18**: Modern React with hooks
- **Vite**: Lightning-fast build tool
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **React Query**: Powerful data fetching and caching
- **Context API**: State management
- **Open Library API**: Book data source
- **Lucide React**: Beautiful icon library

## 🔑 Core Features Implementation

### Context-based State Management
All user data (reading lists, favorites, recent searches, theme, view preferences) is managed through React Context and persisted to localStorage.

### Smart Search with Debouncing
Search queries are debounced to avoid excessive API calls, providing smooth UX while optimizing performance.

### Responsive Image Handling
Book covers include error handling with fallback placeholders when images fail to load.

### Pagination
Navigate through large result sets with smart pagination controls.

## 📊 API Integration

Uses the Open Library Search API:
- Base URL: `https://openlibrary.org/search.json`
- Cover Images: `https://covers.openlibrary.org/b/id/{cover_id}-{size}.jpg`

## 🎨 Customization

### Theme Colors
Edit `src/index.css` to customize the color scheme. The app uses CSS variables for easy theming.

### Search Debounce Delay
Modify the debounce delay in `src/App.jsx`:
```javascript
const debouncedQuery = useDebounce(filters.query, 500); 
```

## 📝 Usage Tips

1. **Search**: Start typing in the search bar - results appear automatically
2. **Filters**: Click the "Filters" button to access advanced search options
3. **Add to List**: Click the "+" button on any book card to add to a reading list
4. **View Details**: Click on a book title or "View Details" for comprehensive information
5. **Favorites**: Click the heart icon to mark books as favorites
6. **Export**: Export your reading lists from the lists modal
7. **Theme**: Toggle between light/dark mode using the moon/sun icon

## 🐛 Troubleshooting

### Images not loading
- Open Library covers may have CORS restrictions or be unavailable
- The app includes fallback placeholders

### Search returns no results
- Try broader search terms
- Check your internet connection
- The Open Library API may be temporarily unavailable

## 📄 License

MIT License 

## 🤝 Contributing

Suggestions and improvements are welcome!

## 👨‍💻 Developer Notes

Built with love for Alex, the college student who needs the perfect book finder! 📚✨

### Performance Optimizations
- React Query caching (5 min stale time)
- Debounced search inputs
- Optimized re-renders with proper key usage
- Lazy loading potential for future images

### Accessibility
- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Sufficient color contrast

---

Happy Reading! 📖