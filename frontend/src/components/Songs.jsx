// src/components/Songs.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Songs.css'; // Ensure this imports your CSS styles
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';

const Songs = () => {
  const { song } = useParams(); // Get the song name from URL params
  const [searchedSong, setSearchedSong] = useState(null);
  const [recommendedSongs, setRecommendedSongs] = useState([]);
  const [playingTrack, setPlayingTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (song) {
      fetchSongDetails(song);
      fetchSimilarSongs(song);
    }
  }, [song]);

  const fetchSongDetails = async (songName) => {
    try {
      // Fetch details of the searched song
      const response = await axios.get(`http://localhost:5000/music/song-details?query=${encodeURIComponent(songName)}`);
      setSearchedSong(response.data.song); // Set searched song details
    } catch (error) {
      console.error('Error fetching song details:', error);
    }
  };

  const fetchSimilarSongs = async (songName) => {
    try {
      // Fetch similar songs based on the searched song's name
      const response = await axios.get(`http://localhost:5000/music/similar-songs?song=${encodeURIComponent(songName)}`);
      setRecommendedSongs(response.data.similar_songs); // Set recommended songs
    } catch (error) {
      console.error('Error fetching similar songs:', error);
    }
  };

  const handlePlayPause = (track) => {
    if (playingTrack === track) {
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      if (playingTrack) {
        audioRef.current.pause();
      }
      setPlayingTrack(track);
      audioRef.current.src = track.preview_url; // Assuming each track has a preview_url property
      audioRef.current.play();
    }
  };

  const handleRecommendedSongClick = async (clickedSong) => {
    // Update searched song details with clicked song's info
    setSearchedSong(clickedSong);

    // Fetch new recommendations based on the clicked song
    await fetchSimilarSongs(clickedSong.name); // Fetch similar songs using the clicked song's name
  };

  return (
    <div className="songs-container">
      {/* Display searched song details */}
      {searchedSong && (
        <div className="searched-song-details">
          <h2>{searchedSong.name}</h2>
          <p>Artist: {searchedSong.artist}</p>
          <img src={searchedSong.album_cover} alt={`${searchedSong.name} cover`} style={{ width: '150px', height: 'auto' }} />
          {searchedSong.preview_url && ( // Check if preview_url exists for the searched song
            <button onClick={() => handlePlayPause(searchedSong)}>
              <FontAwesomeIcon icon={playingTrack === searchedSong ? faPause : faPlay} style={{ color: '#f13238' }} />
            </button>
          )}
        </div>
      )}

      {/* Display recommended songs */}
      <h3>Recommended Songs</h3>
      <ul className="recommended-songs-list">
        {recommendedSongs.map((song, index) => (
          <li key={index}>
            <img src={song.album_cover} alt={`${song.name} cover`} style={{ width: '50px', height: 'auto' }} /> {/* Displaying recommended song's album cover */}
            <span
              className="song-name"
              onClick={() => handleRecommendedSongClick(song)}
            >
              {song.name}
            </span> by {song.artist}
            {song.preview_url && ( // Check if preview_url exists
              <button onClick={() => handlePlayPause(song)}>
                <FontAwesomeIcon icon={playingTrack === song ? faPause : faPlay} style={{ color: '#f13238' }} />
              </button>
            )}
          </li>
        ))}
      </ul>

      {/* Audio element for playing previews */}
      <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
    </div>
  );
};

export default Songs;