import { useEffect, useRef, useState } from 'react';

// import subtitles from './output.json';
import SideTranscript from './SideTranscript';

const VideoPlayer = ({
  decrepenacyState,
  setDecrepenacyState,
  lastAudioTimeStampState,
  setLastAudioTimeStampState,
  currentTimeState,
  setCurrentTimeState,
  transcriptDataState,
  webmFileUrlState,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const videoRef = useRef(null); // Create a ref for the video element

  useEffect(() => {
    const handleTimeUpdate = () => {
      if (videoRef.current) {
        setCurrentTimeState(videoRef.current.currentTime.toFixed(2));
      }
    };

    const videoElement = videoRef.current;

    // Attach the event listener
    videoElement.addEventListener('timeupdate', handleTimeUpdate);

    // Clean up the event listener on component unmount
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, []); // Empty dependency array to only run once

  const rewind = () => {
    if (videoRef.current) {
      videoRef.current.currentTime -= 1; // Rewind by 1 seconds
    }
  };

  const handlePlayPauseClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const pause = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const forward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 1; // Forward by 1 seconds
    }
  };

  const goToTimeStamp = (timeStamp) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timeStamp;
    }
  };

  const handleDescrepancy = (supposedStartTimeOfThisSubtitle) => {
    if (videoRef.current) {
      const timeOnClick = videoRef?.current?.currentTime;
      pause();
      setDecrepenacyState(timeOnClick - supposedStartTimeOfThisSubtitle);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <div>
        <video
          ref={videoRef}
          width='600'
          controls
          onPlay={handlePlay}
          onPause={handlePause}
        >
          <source src={webmFileUrlState} type='video/webm' />
          {/* <source src='input.webm' type='video/webm' /> */}
          Your browser does not support the video tag.
        </video>
        <div>
          <div style={{ gap: 10, display: 'inline-flex' }}>
            <button onClick={rewind}>⏪</button>
            <button onClick={handlePlayPauseClick}>
              {isPlaying ? '⏸' : '▶️'}
            </button>
            <button onClick={forward}>⏩</button>
          </div>
          <div style={{ textAlign: 'left' }}>
            <p>Time: {currentTimeState}</p>
            <div style={{ display: 'inline-flex', gap: 10 }}>
              {decrepenacyState && (
                <p>Time to time from start: {decrepenacyState.toFixed(2)}</p>
              )}
              {decrepenacyState ? (
                <div
                  style={{
                    margin: 'auto',
                    display: 'inline-flex',
                    gap: '10px',
                  }}
                >
                  <button
                    onClick={() => setDecrepenacyState(decrepenacyState - 0.1)}
                  >
                    -0.1
                  </button>
                  <button
                    onClick={() => setDecrepenacyState(decrepenacyState + 0.1)}
                  >
                    +0.1
                  </button>
                </div>
              ) : null}
            </div>

            <p>
              End cut off point:{' '}
              {lastAudioTimeStampState ? lastAudioTimeStampState : 'n/a'}
            </p>
          </div>
        </div>
      </div>
      {transcriptDataState && (
        <SideTranscript
          subtitles={transcriptDataState}
          goToTimeStamp={goToTimeStamp}
          setLastAudioTimeStampState={setLastAudioTimeStampState}
          decrepenacyState={decrepenacyState}
          currentTimeState={currentTimeState}
          handleDescrepancy={handleDescrepancy}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
