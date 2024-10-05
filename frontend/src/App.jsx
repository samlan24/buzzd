// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './fontAwesome';
import Home from './components/Home';
import Music from './components/Music';
import Songs from './components/Songs'; // Import the new Songs component
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music/:artist" element={<Music />} />
        <Route path="/songs/:song" element={<Songs />} /> {/* New route for songs */}
      </Routes>
    </Router>
  );
};

export default App;