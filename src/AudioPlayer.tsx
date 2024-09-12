import { useState, useRef } from 'react';
import { MiniTransScript } from './SideTranscript';

const AudioPlayer = ({ url, subtitles, decrepenacyState }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const goToTimeStamp = (jumpAudioTo) => {
    if (audioRef.current) {
      audioRef.current.currentTime = jumpAudioTo; // Skip forward 10 seconds
    }
  };

  const handleForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10; // Skip forward 10 seconds
    }
  };

  const handleRewind = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10; // Skip backward 10 seconds
    }
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  return (
    <div>
      <div>
        <audio
          ref={audioRef}
          src={url}
          onTimeUpdate={handleTimeUpdate}
          controls
          style={{ width: '75%' }}
        />
        <div>
          <button onClick={handleRewind}>Rewind</button>
          <button onClick={handlePlayPause}>
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={handleForward}>Forward</button>
        </div>
        <div>
          <span>Current Time: {currentTime.toFixed(2)}s</span>
        </div>
      </div>
      <MiniTransScript
        subtitles={subtitles}
        goToTimeStamp={goToTimeStamp}
        currentTimeState={currentTime}
        decrepenacyState={decrepenacyState}
        isUsingCutAudio
      />
    </div>
  );
};

export default AudioPlayer;
