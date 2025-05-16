import React from 'react';
import {  Route, Routes } from 'react-router-dom'; //  No need for BrowserRouter here
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ConfessMain from './components/Confession/ConfessMain';
import Resources from './components/Resources/ResourcesHome';
import FeedsTest from './feeds/feeds';
import AuthPage from './pages/Auth/AuthPage';
import ProtectedRoute from './Context/ProtectedRoute';
import AppProvider from './Context/AppProvider';

function App() {
  return (
    <AppProvider>
      <Routes>
      <Route
          path="/auth"
          element={
            <ProtectedRoute>
              <AuthPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes> {/* Nested Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/about" />
                  <Route path="/feed" element={<FeedsTest />} />
                  <Route path="/confessions" element={<ConfessMain />} />
                  <Route path="/categories" />
                  <Route path="/resources" element={<Resources />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </AppProvider>
  );
}

export default App;