import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import LoadingSpinner from './LoadingSpinner'
import { useAuth } from '../context/AuthContext'

export default function Layout() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pharmacy-bg">
        <LoadingSpinner size="lg" text="Loading MS PharmaCare..." />
      </div>
    )
  }

  return (
    <div className="pch-root min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  )
}
