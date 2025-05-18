import React from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = ({ children }) => {
  const location = useLocation();
  

  const shouldHideFooter = () => {
    const noFooterRoutes = ['/feed', '/fyp'];
    return noFooterRoutes.some(route => location.pathname.startsWith(route));
  };

  return (
    <div className="bg-gray-50 font-sans min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {children}
      </main>
      
      {!shouldHideFooter() && <Footer />}
    </div>
  );
};

export default MainLayout;