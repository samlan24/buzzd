import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchForm from './SearchForm';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  const handleSearch = (query) => {
    const encodedArtist = encodeURIComponent(query).replace(/%20/g, '+');
    navigate(`/music/${encodedArtist}`);
  };

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li className="navbar-item">
          <Link to="/">Home</Link>
        </li>
        <li className="navbar-item">
          <SearchForm placeholder="Search for artists..." onSearch={handleSearch} />
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
