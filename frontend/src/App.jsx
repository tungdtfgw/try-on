import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import ProfilePage from './pages/ProfilePage';
import CategoriesPage from './pages/CategoriesPage';
import ProductsPage from './pages/ProductsPage';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Container from './components/ui/Container';
import Card from './components/ui/Card';
import './App.css';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white pt-14">
      <Header />
      <main className="py-12">
        <Container className="max-w-3xl">
          <Card className="p-8">
            <h1 className="text-2xl font-black text-brand-black tracking-[-0.01em]">
              About
            </h1>
            <p className="mt-3 text-sm text-brand-grayMedium">
              TryOn is a learning project for building an e-commerce experience with AI-ready
              features (profiles, admin catalog management, and more).
            </p>
          </Card>
        </Container>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute requireAdmin>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute requireAdmin>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </Router>
  );
}

export default App;
