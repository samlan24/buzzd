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
            const response = await axios.get(`http://localhost:5000/music/song-details?query=${encodeURIComponent(songName)}`);
            setSearchedSong(response.data.song);
        } catch (error) {
            console.error('Error fetching song details:', error);
        }
    };

    const fetchSimilarSongs = async (songName) => {
        try {
            const response = await axios.get(`http://localhost:5000/music/similar-songs?song=${encodeURIComponent(songName)}`);
            setRecommendedSongs(response.data.similar_songs);
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
        setSearchedSong(clickedSong);
        await fetchSimilarSongs(clickedSong.name);
    };

    return (
        <div className="music-container">
            {searchedSong && (
                <div className="searched-song">
                    <div className="song-details">
                        <img src={searchedSong.album_cover} alt={`${searchedSong.name} cover`} className="song-cover" />
                        <div className="song-info">
                            <h2>{searchedSong.name}</h2>
                            <p>Artist: {searchedSong.artist}</p>
                            {searchedSong.preview_url && (
                                <button onClick={() => handlePlayPause(searchedSong)}>
                                    <FontAwesomeIcon icon={playingTrack === searchedSong ? faPause : faPlay} className="play-icon" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <h3 className="recommended-title">Recommended Songs</h3>
            <div className="recommended-songs">
                {recommendedSongs.map((song, index) => (
                    <div className="recommended-song" key={index}>
                        <img src={song.album_cover} alt={`${song.name} cover`} className="recommended-cover" />
                        <div className="recommended-info">
                            <span className="song-name" onClick={() => handleRecommendedSongClick(song)}>
                                {song.name}
                            </span> by {song.artist}
                            {song.preview_url && (
                                <button onClick={() => handlePlayPause(song)}>
                                    <FontAwesomeIcon icon={playingTrack === song ? faPause : faPlay} className="play-icon" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Audio element for playing previews */}
            <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
        </div>
    );
};

export default Songs;