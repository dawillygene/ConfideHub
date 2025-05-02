import React from 'react';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  return (
    <div className="bg-gray-50 font-sans">
      <Header />

        {children}

      <Footer />
    </div>
  );
};

export default MainLayout;