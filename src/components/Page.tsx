import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui';
import { cn } from '../lib/utils';

interface PageProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showGradientHeader?: boolean;
  className?: string;
}

const Page: React.FC<PageProps> = ({ 
  children, 
  title, 
  subtitle, 
  showGradientHeader = true,
  className = '' 
}) => {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={cn("min-h-screen bg-gray-50", className)}>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="text-2xl font-bold text-purple-600 hover:text-purple-700">
                Health360
              </Link>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link 
                to="/chat" 
                className={cn(
                  "text-gray-600 hover:text-purple-600 transition-colors",
                  location.pathname === '/chat' && "text-purple-600 font-medium"
                )}
              >
                Assessment
              </Link>
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className={cn(
                    "text-gray-600 hover:text-purple-600 transition-colors",
                    location.pathname === '/dashboard' && "text-purple-600 font-medium"
                  )}
                >
                  My Dashboard
                </Link>
              )}
              {isAuthenticated && (
                <Link 
                  to="/plan" 
                  className={cn(
                    "text-gray-600 hover:text-purple-600 transition-colors",
                    location.pathname === '/plan' && "text-purple-600 font-medium"
                  )}
                >
                  My Plan
                </Link>
              )}
              <Link 
                to="/stories" 
                className={cn(
                  "text-gray-600 hover:text-purple-600 transition-colors",
                  location.pathname === '/stories' && "text-purple-600 font-medium"
                )}
              >
                Stories
              </Link>
              <Link 
                to="/catalog" 
                className={cn(
                  "text-gray-600 hover:text-purple-600 transition-colors",
                  location.pathname === '/catalog' && "text-purple-600 font-medium"
                )}
              >
                Products
              </Link>
              <Link 
                to="/booking" 
                className={cn(
                  "text-gray-600 hover:text-purple-600 transition-colors",
                  location.pathname === '/booking' && "text-purple-600 font-medium"
                )}
              >
                Book Test
              </Link>
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
                  <Button onClick={handleLogout} variant="outline" size="sm">
                    Logout
                  </Button>
                </div>
              ) : (
                <Button asChild>
                  <Link to="/auth">
                    Login
                  </Link>
                </Button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {title && showGradientHeader && (
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">{title}</h1>
              {subtitle && <p className="text-xl text-purple-100">{subtitle}</p>}
            </div>
          </div>
        </div>
      )}

      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};

export default Page;
