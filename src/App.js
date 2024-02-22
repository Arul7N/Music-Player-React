import React, { useState, useEffect } from 'react';

const storeAudioFile = (file) => {
  const reader = new FileReader();
  reader.onload = function(event) {
    localStorage.setItem('audioFile', file.name);
  };
  reader.readAsDataURL(file);
};

const getStoredAudioFile = () => {
  return localStorage.getItem('audioFile');
};

const App = () => {
  const [playlist, setPlaylist] = useState([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(-1);

  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem('playlist'));
    const savedCurrentTrackIndex = parseInt(localStorage.getItem('currentTrackIndex'), 10);

    if (savedPlaylist && savedCurrentTrackIndex >= 0 && savedCurrentTrackIndex < savedPlaylist.length) {
      setPlaylist(savedPlaylist);
      setCurrentTrackIndex(savedCurrentTrackIndex);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('playlist', JSON.stringify(playlist));
    localStorage.setItem('currentTrackIndex', currentTrackIndex);
  }, [playlist, currentTrackIndex]);

  const handleFileChange = (event) => {
    const files = event.target.files;
    Array.from(files).forEach((file) => {
      storeAudioFile(file);
      setPlaylist((prevPlaylist) => [...prevPlaylist, URL.createObjectURL(file)]);
    });

    if (currentTrackIndex === -1) {
      setCurrentTrackIndex(0);
    }
  };

  const playTrack = (index) => {
    setCurrentTrackIndex(index);
  };

  const playNextTrack = () => {
    setCurrentTrackIndex(currentTrackIndex + 1);
  };

  const removeTrack = (index) => {
    const newPlaylist = [...playlist];
    newPlaylist.splice(index, 1);
    setPlaylist(newPlaylist);
    if (index === currentTrackIndex) {
      setCurrentTrackIndex(-1);
    } else if (index < currentTrackIndex) {
      setCurrentTrackIndex(currentTrackIndex - 1);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} multiple />
      <ul>
        
        {playlist.map((track, index) => (
          
          <li key={index}>
            <label onClick={() => playTrack(index)}>Song {track}</label>
            <button onClick={(e) => { e.stopPropagation(); removeTrack(index); }}>Remove</button>
          </li>
        
        ))}
      </ul>
      {currentTrackIndex !== -1 && (
        <div>
          <audio src={playlist[currentTrackIndex]} controls onEnded={playNextTrack} autoPlay />
        </div>
      )}
    </div>
  );
};

export default App;
