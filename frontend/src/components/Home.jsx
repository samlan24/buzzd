import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import Navbar from '../components/Navbar';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [currentWord, setCurrentWord] = useState('artists');

  useEffect(() => {
    const words = ['artists', 'songs'];
    let wordIndex = 0;

    const intervalId = setInterval(() => {
      wordIndex = (wordIndex + 1) % words.length;
      setCurrentWord(words[wordIndex]);
    }, 5000); // Keep this as is for now

    return () => clearInterval(intervalId);
}, []);

  const handleSearch = (query) => {
    const encodedArtist = encodeURIComponent(query).replace(/%20/g, '+');
    navigate(`/music/${encodedArtist}`);
  };

  return (
    <div className="home-container">
      <h1>
        Find similar <span className="scrolling-word">{currentWord}</span>
      </h1>
      <SearchForm
        placeholder={`Enter ${currentWord} name`}
        onSearch={handleSearch}
      />
    </div>
  );
};

export default Home;
