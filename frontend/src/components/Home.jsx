// src/pages/Home.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    const encodedArtist = encodeURIComponent(query).replace(/%20/g, '+');
    navigate(`/music/${encodedArtist}`);
  };

  return (
    <div className="home-container">
      <h1>Find similar artists to your favorite artists</h1>
      <SearchForm
        placeholder="Enter artist name"
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Home;
