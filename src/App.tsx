import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import { HomePage } from './pages/HomePage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { LoginPage } from './pages/LoginPage';

// Admin Pages
import { DashboardPage } from './pages/admin/DashboardPage';
import { NewsManagementPage } from './pages/admin/NewsManagementPage';
import { NewsFormPage } from './pages/admin/NewsFormPage';
import { CategoryManagementPage } from './pages/admin/CategoryManagementPage';
import { AuthorManagementPage } from './pages/admin/AuthorManagementPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/news/:id" element={<NewsDetailPage />} />
        
        {/* Admin Authentication */}
        <Route path="/admin/login" element={<LoginPage />} />
        
        {/* Protected Admin Routes */}
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/news" element={<NewsManagementPage />} />
        <Route path="/admin/news/new" element={<NewsFormPage />} />
        <Route path="/admin/news/edit/:id" element={<NewsFormPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
        <Route path="/admin/authors" element={<AuthorManagementPage />} />

        {/* Fallback Route */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
