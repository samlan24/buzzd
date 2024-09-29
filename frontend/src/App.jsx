import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './fontAwesome';
import Home from './components/Home';
import Music from './components/Music';
import Navbar from './components/Navbar';



const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/music/:artist" element={<Music />} />
      </Routes>
    </Router>
  );
};

export default App;