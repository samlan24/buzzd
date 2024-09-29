// src/components/MediaPlayer.jsx
import React from 'react';

const MediaPlayer = ({ currentTrack }) => {
  return (
    <div className="media-player">
      {currentTrack && (
        <>
          <p>Now Playing: {currentTrack.name}</p>
          <audio controls autoPlay>
            <source src={currentTrack.preview_url} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </>
      )}
    </div>
  );
};

export default MediaPlayer;
