import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-3xl font-bold text-primary mr-2">
              <i className="fas fa-comment-dots"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                Confide<span className="text-tertiary">Hub</span>
              </h1>
              <p className="text-xs text-gray-500">Safe Space for Anonymous Confessions</p>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/feed" className="text-gray-600 hover:text-primary">
              Feeds
            </Link>
            <Link to="/confessions" className="text-gray-600 hover:text-primary">
              Confessions
            </Link>
            <Link to="/" className="text-gray-600 hover:text-primary">
              Home
            </Link>
            <Link to="/resources" className="text-gray-600 hover:text-primary">
              Resources
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            <button className="hidden md:block bg-white text-primary border border-primary px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300">
              Sign In
            </button>
            <button className="bg-primary text-white px-4 py-2 rounded-full hover:bg-opacity-90 transition duration-300">
              <i className="fas fa-plus mr-2"></i>New Confession
            </button>
            <button className="md:hidden text-gray-700" onClick={toggleMobileMenu}>
              <i className={isMobileMenuOpen ? 'fas fa-times text-xl' : 'fas fa-bars text-xl'}></i>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <nav
          className={`md:hidden ${
            isMobileMenuOpen ? 'block' : 'hidden'
          } bg-white shadow-md mt-2 rounded-lg p-4`}
        >
          <div className="flex flex-col space-y-4">
            <Link
              to="/feed"
              className="text-gray-600 hover:text-primary"
              onClick={closeMobileMenu}
            >
              Feeds
            </Link>
            <Link
              to="/confessions"
              className="text-gray-600 hover:text-primary"
              onClick={closeMobileMenu}
            >
              Confessions
            </Link>
            <Link to="/" className="text-gray-600 hover:text-primary" onClick={closeMobileMenu}>
              Home
            </Link>
            <Link
              to="/resources"
              className="text-gray-600 hover:text-primary"
              onClick={closeMobileMenu}
            >
              Resources
            </Link>
            <button className="bg-white text-primary border border-primary px-4 py-2 rounded-full hover:bg-gray-100 transition duration-300 mt-2">
              Sign In
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;