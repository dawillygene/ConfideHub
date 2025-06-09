import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../Context/AppProvider';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Clear user context and local storage
        setUser(null);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('authToken');
        
        // Navigate to auth page
        navigate('/auth');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleAuthAction = () => {
    if (user) {
      handleLogout();
    } else {
      navigate('/auth');
    }
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50 border-b border-gray-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <Link to="/" className="flex items-center group">
            <div className="text-3xl font-bold text-primary mr-3 transition-transform group-hover:scale-110">
              <i className="fas fa-comment-dots"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Confide<span className="text-tertiary">Hub</span>
              </h1>
              <p className="text-xs text-gray-500 font-medium">Safe Space for Anonymous Confessions</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-primary font-medium transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-home mr-2"></i>
              Home
            </Link>
            {user && (
              <>
                <Link 
                  to="/fyp" 
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-star mr-2"></i>
                  For You
                </Link>
                <Link 
                  to="/feed" 
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-stream mr-2"></i>
                  Feeds
                </Link>
                <Link 
                  to="/confessions" 
                  className="text-gray-600 hover:text-primary font-medium transition-colors duration-200 flex items-center"
                >
                  <i className="fas fa-heart mr-2"></i>
                  Confessions
                </Link>
              </>
            )}
            <Link 
              to="/resources" 
              className="text-gray-600 hover:text-primary font-medium transition-colors duration-200 flex items-center"
            >
              <i className="fas fa-book-medical mr-2"></i>
              Resources
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* User Profile Section */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 text-gray-600 hover:text-primary transition-colors duration-200"
                  >
                    <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {user.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium">{user}</span>
                  </Link>
                </div>

                {/* New Confession Button */}
                <Link 
                  to="/confessions/new"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 flex items-center shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  <i className="fas fa-plus mr-2"></i>
                  New Confession
                </Link>

                {/* Logout Button */}
                <button 
                  onClick={handleLogout}
                  className="hidden md:block bg-red-50 text-red-600 border border-red-200 px-4 py-2 rounded-full hover:bg-red-100 transition-all duration-300 flex items-center font-medium"
                >
                  <i className="fas fa-sign-out-alt mr-2"></i>
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* Sign In Button for non-authenticated users */}
                <button 
                  onClick={handleAuthAction}
                  className="hidden md:block bg-white text-primary border-2 border-primary px-6 py-2 rounded-full hover:bg-primary hover:text-white transition-all duration-300 font-medium"
                >
                  <i className="fas fa-sign-in-alt mr-2"></i>
                  Sign In
                </button>
                <Link 
                  to="/confessions"
                  className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition-all duration-300 flex items-center shadow-md hover:shadow-lg"
                >
                  <i className="fas fa-eye mr-2"></i>
                  View Confessions
                </Link>
              </>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden text-gray-700 hover:text-primary transition-colors p-2" 
              onClick={toggleMobileMenu}
            >
              <i className={isMobileMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl'}></i>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <nav
          className={`md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          } bg-white shadow-lg mt-4 rounded-lg p-4 border border-gray-100`}
        >
          <div className="flex flex-col space-y-4">
            {/* User Profile in Mobile */}
            {user && (
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                  {user.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-800">Welcome, {user}</p>
                  <Link 
                    to="/profile" 
                    className="text-sm text-primary hover:underline"
                    onClick={closeMobileMenu}
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            )}

            {/* Navigation Links */}
            <Link
              to="/"
              className="text-gray-600 hover:text-primary font-medium flex items-center py-2"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-home mr-3 w-5"></i>
              Home
            </Link>
            
            {user && (
              <>
                <Link
                  to="/fyp"
                  className="text-gray-600 hover:text-primary font-medium flex items-center py-2"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-star mr-3 w-5"></i>
                  For You
                </Link>
                <Link
                  to="/feed"
                  className="text-gray-600 hover:text-primary font-medium flex items-center py-2"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-stream mr-3 w-5"></i>
                  Feeds
                </Link>
                <Link
                  to="/confessions"
                  className="text-gray-600 hover:text-primary font-medium flex items-center py-2"
                  onClick={closeMobileMenu}
                >
                  <i className="fas fa-heart mr-3 w-5"></i>
                  Confessions
                </Link>
              </>
            )}

            <Link
              to="/resources"
              className="text-gray-600 hover:text-primary font-medium flex items-center py-2"
              onClick={closeMobileMenu}
            >
              <i className="fas fa-book-medical mr-3 w-5"></i>
              Resources
            </Link>

            {/* Mobile Action Buttons */}
            <div className="pt-4 border-t border-gray-200 space-y-3">
              {user ? (
                <>
                  <Link
                    to="/confessions/new"
                    className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center font-medium"
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-plus mr-2"></i>
                    New Confession
                  </Link>
                  <button 
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full bg-red-50 text-red-600 border border-red-200 px-4 py-3 rounded-lg hover:bg-red-100 transition-all duration-300 flex items-center justify-center font-medium"
                  >
                    <i className="fas fa-sign-out-alt mr-2"></i>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => {
                      handleAuthAction();
                      closeMobileMenu();
                    }}
                    className="w-full bg-white text-primary border-2 border-primary px-4 py-3 rounded-lg hover:bg-primary hover:text-white transition-all duration-300 font-medium"
                  >
                    <i className="fas fa-sign-in-alt mr-2"></i>
                    Sign In
                  </button>
                  <Link
                    to="/confessions"
                    className="w-full bg-primary text-white px-4 py-3 rounded-lg hover:bg-primary-dark transition-all duration-300 flex items-center justify-center font-medium"
                    onClick={closeMobileMenu}
                  >
                    <i className="fas fa-eye mr-2"></i>
                    View Confessions
                  </Link>
                </>
              )}
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;