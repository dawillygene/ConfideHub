import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import ConfessMain from './components/Confession/ConfessMain';
import Resources from './components/Resources/ResourcesHome';


function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" />
          <Route path="/confessions" element={<ConfessMain />}  />
          <Route path="/categories"  />
          <Route path="/resources" element={<Resources />}  />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;