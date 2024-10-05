import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './SearchForm.css'; // Add styles for better presentation

const SearchForm = () => {
  const [query, setQuery] = useState('');
  const [artistSuggestions, setArtistSuggestions] = useState([]);
  const [songSuggestions, setSongSuggestions] = useState([]);
  const [inputPlaceholder, setInputPlaceholder] = useState('Enter name');
  const [searchType, setSearchType] = useState('artist'); // Default search type
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        try {
          if (searchType === 'artist') {
            const response = await axios.get(`http://127.0.0.1:5000/music/artist-suggestions?query=${query}`);
            setArtistSuggestions(response.data.suggestions);
            setSongSuggestions([]); // Clear song suggestions
          } else if (searchType === 'song') {
            const response = await axios.get(`http://127.0.0.1:5000/music/song-suggestions?query=${query}`);
            setSongSuggestions(response.data.suggestions);
            setArtistSuggestions([]); // Clear artist suggestions
          }
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setArtistSuggestions([]);
        setSongSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query, searchType]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      if (searchType === 'song') {
        // Navigate to the songs page with the searched song name
        navigate(`/songs/${encodeURIComponent(query).replace(/%20/g, '+')}`);
      } else {
        // Navigate to the music page with the searched artist name
        navigate(`/music/${encodeURIComponent(query).replace(/%20/g, '+')}`);
      }
      clearInputAndSuggestions(); // Clear input and suggestions after search
    }
  };

  const handleArtistSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setArtistSuggestions([]); // Clear artist suggestions after selection
    navigate(`/music/${encodeURIComponent(suggestion.name).replace(/%20/g, '+')}`); // Navigate to selected artist
    clearInputAndSuggestions(); // Clear input and suggestions after selection
  };

  const handleSongSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSongSuggestions([]); // Clear song suggestions after selection
    navigate(`/songs/${encodeURIComponent(suggestion.name).replace(/%20/g, '+')}`); // Navigate to selected song
    clearInputAndSuggestions(); // Clear input and suggestions after selection
  };

  // Function to clear the input and suggestions
  const clearInputAndSuggestions = () => {
    setQuery('');
    setArtistSuggestions([]);
    setSongSuggestions([]);
  };

  return (
    <div className="search-form-container">
      <div className="dropdown-container">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="search-dropdown"
        >
          <option value="artist">Artist</option>
          <option value="song">Song</option>
        </select>
      </div>

      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={inputPlaceholder}
          className="search-input"
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      {/* Display Artist Suggestions */}
      {artistSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {artistSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleArtistSuggestionClick(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}

      {/* Display Song Suggestions */}
      {songSuggestions.length > 0 && (
        <ul className="suggestions-list">
          {songSuggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSongSuggestionClick(suggestion)}>
              {suggestion.name} by {suggestion.artist} {/* Display song name and artist */}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchForm;