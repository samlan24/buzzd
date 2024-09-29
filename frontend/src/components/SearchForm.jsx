import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchForm.css'; // Add styles for better presentation

const SearchForm = ({ placeholder, onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [inputPlaceholder, setInputPlaceholder] = useState('Enter artist name'); // Directly set placeholder

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.trim()) {
        try {
          const response = await axios.get(`http://127.0.0.1:5000/music/artist-suggestions?query=${query}`);
          setSuggestions(response.data.suggestions);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query, 'artist');
      clearInputAndSuggestions(); // Clear input and suggestions after search
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.name);
    setSuggestions([]); // Clear suggestions after selection
    onSearch(suggestion.name, 'artist');
    clearInputAndSuggestions(); // Clear input and suggestions after selection
  };

  // Function to clear the input and suggestions
  const clearInputAndSuggestions = () => {
    setQuery('');
    setSuggestions([]);
  };

  return (
    <div className="search-form-container">
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
      {suggestions.length > 0 && (
        <ul className="suggestions-list">
          {suggestions.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchForm;