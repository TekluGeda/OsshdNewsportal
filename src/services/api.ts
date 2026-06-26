import type { News } from "../types";

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
  // ARTICLES (ONLY REAL WORKING ENDPOINT)
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

    const res = await fetch(
      `${API_BASE}/articles?${params.toString()}`
    );

    return handleResponse(res);
  },

  async getArticleById(id: string): Promise<News | null> {
    // Not implemented in backend yet → fallback
    const res = await fetch(`${API_BASE}/articles?id=${id}`);
    if (!res.ok) return null;

    const data = await res.json();
    return data?.[0] || null;
  },

  // ========================
  // PLACEHOLDERS (NOT ACTIVE YET)
  // ========================

  async getAuthors() {
    return [];
  },

  async getCategories() {
    return [];
  },

  async getStats() {
    return null;
  }
};
