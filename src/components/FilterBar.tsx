import React, { useState, useEffect } from 'react';
import type { Category } from '../types';
import { api } from '../services/api';

interface FilterBarProps {
  currentCategory: string;
  currentSearch: string;
  currentSort: 'newest' | 'oldest';
  currentDate: string;
  onFilterChange: (filters: {
    category: string;
    search: string;
    sort: 'newest' | 'oldest';
    date: string;
  }) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  currentCategory,
  currentSearch,
  currentSort,
  currentDate,
  onFilterChange
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState(currentSearch);

  useEffect(() => {
    // Load categories for dropdown filter
    const loadCategories = async () => {
      const data = await api.getCategories();
      setCategories(data);
    };
    loadCategories();
  }, []);

  // Update local search term state if prop changes
  useEffect(() => {
    setSearchTerm(currentSearch);
  }, [currentSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category: currentCategory,
      search: searchTerm,
      sort: currentSort,
      date: currentDate
    });
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      category: e.target.value,
      search: searchTerm,
      sort: currentSort,
      date: currentDate
    });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      category: currentCategory,
      search: searchTerm,
      sort: e.target.value as 'newest' | 'oldest',
      date: currentDate
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({
      category: currentCategory,
      search: searchTerm,
      sort: currentSort,
      date: e.target.value
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      category: '',
      search: '',
      sort: 'newest',
      date: ''
    });
  };

  const hasActiveFilters = currentCategory || currentSearch || currentDate || currentSort !== 'newest';

  return (
    <div className="filter-section animate-fade-in">
      <div className="filter-container">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="search-input-wrapper">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="search-input"
            placeholder="Search news by title or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" style={{ display: 'none' }}>Search</button>
        </form>

        {/* Other Filters */}
        <div className="filters-group">
          {/* Category Dropdown */}
          <select
            value={currentCategory}
            onChange={handleCategoryChange}
            className="filter-select"
            aria-label="Filter by Category"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Date Picker */}
          <input
            type="date"
            value={currentDate}
            onChange={handleDateChange}
            className="filter-date"
            title="Filter by publication date"
            aria-label="Filter by Date"
          />

          {/* Sort Dropdown */}
          <select
            value={currentSort}
            onChange={handleSortChange}
            className="filter-select"
            aria-label="Sort Order"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>

          {/* Clear Button */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn btn-outline"
              style={{ padding: '10px 14px', fontSize: '13px' }}
            >
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
