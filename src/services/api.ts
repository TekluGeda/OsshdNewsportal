// src/services/api.ts

import type { News, Category, Author } from '../types';

const API_BASE = "http://116.202.101.84:5000/api";

async function handleResponse(res: Response) {
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API request failed");
  }
  return res.json();
}

export const api = {
  // ========================
  // ARTICLES
  // ========================
  async getArticles(filters?: {
    category?: string;
    search?: string;
    status?: string;
    featured?: boolean;
    sort?: "newest" | "oldest";
    date?: string;
  }): Promise<News[]> {
    const params = new URLSearchParams();

    if (filters?.category) params.append("category", filters.category);
    if (filters?.search) params.append("search", filters.search);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.featured !== undefined)
      params.append("featured", String(filters.featured));
    if (filters?.sort) params.append("sort", filters.sort);
    if (filters?.date) params.append("date", filters.date);

    const res = await fetch(
      `${API_BASE}/articles?${params.toString()}`
    );

    return handleResponse(res);
  },

  async getArticleById(id: string): Promise<News | null> {
    const res = await fetch(`${API_BASE}/articles/${id}`);

    if (!res.ok) return null;

    return res.json();
  },

  async createArticle(data: Partial<News>): Promise<News> {
    const res = await fetch(`${API_BASE}/articles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async updateArticle(id: string, data: Partial<News>): Promise<News> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async deleteArticle(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/articles/${id}`, {
      method: "DELETE",
    });

    return handleResponse(res);
  },

  // ========================
  // AUTHORS
  // ========================
  async getAuthors(): Promise<Author[]> {
    const res = await fetch(`${API_BASE}/authors`);
    return handleResponse(res);
  },

  async createAuthor(data: Partial<Author>): Promise<Author> {
    const res = await fetch(`${API_BASE}/authors`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async deleteAuthor(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/authors/${id}`, {
      method: "DELETE",
    });

    return handleResponse(res);
  },

  // ========================
  // CATEGORIES
  // ========================
  async getCategories(): Promise<Category[]> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  async createCategory(data: Partial<Category>): Promise<Category> {
    const res = await fetch(`${API_BASE}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return handleResponse(res);
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
    });

    return handleResponse(res);
  },

  // ========================
  // STATS (optional dashboard)
  // ========================
  async getStats(): Promise<any> {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse(res);
  },
};
