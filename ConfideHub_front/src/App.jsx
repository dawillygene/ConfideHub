import React from 'react';
import {  Route, Routes } from 'react-router-dom'; //  No need for BrowserRouter here
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import Resources from './components/Resources/ResourcesHome';
import FeedsTest from './feeds/feeds';
import AuthPage from './pages/Auth/AuthPage';
import ProtectedRoute from './Context/ProtectedRoute';
import AppProvider from './Context/AppProvider';
import ForYou from './feeds/ForYou';
import Profile from './components/Profile/Profile';
import UserPosts from './components/Profile/UserPosts';
import Bookmarks from './components/Bookmarks';

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
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/profile/posts" element={<UserPosts />} />
                  <Route path="/bookmarks" element={<Bookmarks />} />
                  <Route path="/about" />
                  <Route path="/fyp" element={<ForYou />} />
                  <Route path="/feed" element={<FeedsTest />} />
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