export type NewsStatus = 'draft' | 'published';

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface Author {
  id: string;
  fullName: string;
  email: string;
}

export interface News {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string; // Category Name or Category ID. We will link by Category Name or ID. Let's use Category Name or ID for simple mapping, Category ID is cleaner.
  author: string;   // Author ID or Name. Let's use Author ID.
  publishDate: string; // ISO string or YYYY-MM-DD
  status: NewsStatus;
  featured: boolean;
  image1: string;
  image2: string;
  image3: string;
  createdDate: string;
  updatedDate: string;
  views?: number; // Added for statistics
}
