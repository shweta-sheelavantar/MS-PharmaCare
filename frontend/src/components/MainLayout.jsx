import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardLayout from './DashboardLayout';

export default function MainLayout() {
  const { isAuthenticated } = useAuth();

  // Standard navigation layout for both public and authenticated users

  return (
    <div className="frontend-root min-h-screen flex flex-col">
      <Navbar />
      
      {/* Central Content Wrapper */}
      <main className="flex-grow w-full bg-transparent flex flex-col">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

