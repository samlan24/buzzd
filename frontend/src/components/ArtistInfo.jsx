import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause } from '@fortawesome/free-solid-svg-icons';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';

const ArtistInfo = ({ artistInfo }) => {
  const [playingTrack, setPlayingTrack] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = 0.2;
    }
  }, []);

  const handlePlayPause = (track) => {
    // If the track is already playing, pause it
    if (playingTrack === track) {
      audioRef.current.pause();
      setPlayingTrack(null);
    } else {
      // If another track is playing, stop it
      if (playingTrack) {
        audioRef.current.pause();
      }
      // Play the new track
      setPlayingTrack(track);
      audioRef.current.src = track.preview_url;
      audioRef.current.play();
    }
  };

  return (
    <div className="sidebar">
      {artistInfo && (
        <div>
          <h2>{artistInfo.name}</h2>
          {artistInfo.image_url && <img src={artistInfo.image_url} alt={`${artistInfo.name}`} style={{ width: '100%', height: 'auto' }} />}
          <p><strong>Bio:</strong> {artistInfo.bio}</p>
          <h3>Top Tracks</h3>
          <ul>
            {artistInfo.top_tracks.map((track, index) => (
              <li key={index}>
                {track.name}
                {track.preview_url && (
                  <button onClick={() => handlePlayPause(track)}>
                    <FontAwesomeIcon icon={playingTrack === track ? faPause : faPlay} style={{ color: '#f13238' }} />
                  </button>
                )}
              </li>
            ))}
          </ul>
          {artistInfo.social_media && (
            <p><a href={artistInfo.social_media} target="_blank" rel="noopener noreferrer"><FontAwesomeIcon icon={faSpotify} style={{ color: 'green' }} /></a></p>
          )}
          {/* Audio element for playing previews */}
          <audio ref={audioRef} onEnded={() => setPlayingTrack(null)} />
        </div>
      )}
    </div>
  );
};

export default ArtistInfo;
