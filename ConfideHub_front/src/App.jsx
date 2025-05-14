import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ConfessMain from './components/Confession/ConfessMain';
import Resources from './components/Resources/ResourcesHome';
import Feeds from './feeds/feeds';
import AuthPage from './pages/Auth/AuthPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" />
              <Route path="/feed" element={<Feeds />}/>
              <Route path="/confessions" element={<ConfessMain />}  />
              <Route path="/categories"  />
              <Route path="/resources" element={<Resources />}  />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}

export default App;