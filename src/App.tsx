import { useState } from 'react';
import './App.css';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';
import { txtToJSON } from './utils/txt-to-json';
import VideoSnippingCheckList from './VideoSnippingCheckList';
import { secondsToHms } from './utils/secondsToHMSS';
import AudioPlayer from './AudioPlayer';
import UploadingComponents from './UploadingComponents';

function App() {
  const [decrepenacyState, setDecrepenacyState] = useState(null);
  const [lastAudioTimeStampState, setLastAudioTimeStampState] = useState();
  const [contentName, setContentName] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [audioSnippetURLState, setAudioSnippetURLState] = useState('');
  const [sceneStartState, setSceneStartState] = useState(null);
  const [sceneEndstate, setSceneEndState] = useState(null);

  const [transcriptDataState, setTranscriptDataState] = useState([]);
  const [error, setError] = useState(null);
  const [webmFileState, setWebmFileState] = useState(null);
  const [webmFileUrlState, setWebmFileUrlState] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');
  const [hasVideoBeenUploaded, setHasVideoBeenUploaded] = useState(false);

  const handleWebMToServer = async () => {
    if (!webmFileState) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', webmFileState);
    formData.append('contentName', contentName);

    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:4000/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.status === 200) {
        setUploadMessage(
          `File uploaded successfully: ${response.data.filePath}`,
        );
        setHasVideoBeenUploaded(true);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTxtToJson = (fileData) => {
    const res = txtToJSON(fileData);
    setTranscriptDataState(res as any);
  };

  const handleFileChange = (event) => {
    const thisFile = event.target.files[0];
    if (thisFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        // Get the content of the file
        handleTxtToJson(e.target.result);
      };

      reader.onerror = (error) => {
        console.error('## Error reading file:', error);
      };

      // Read the file as text
      reader.readAsText(thisFile);
    }
  };

  const handleConvertWebmToMP3 = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:4000/video-to-audio',
        {
          contentName,
          trimStart: decrepenacyState,
          trimEnd: lastAudioTimeStampState,
        },
      );
      setFileURL(response.data.file);
    } catch (error) {
      console.error('Error converting video to audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setContentName(e.target.value);
  };

  const handleVideoFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'video/webm') {
      const customFileName = contentName + '.webm'; // Replace this with your desired filename
      const fileWithCustomName = new File([selectedFile], customFileName, {
        type: selectedFile.type,
      });
      setWebmFileState(fileWithCustomName);
      const url = URL.createObjectURL(fileWithCustomName);
      setWebmFileUrlState(url);
    } else {
      alert('Please select a valid WebM file.');
    }
  };

  const handleCreateSnippetFromVideo = async () => {
    if (!sceneStartState || !sceneEndstate) {
      return;
    }

    const firstTrim = transcriptDataState.find(
      (transcriptLine) => transcriptLine.id === sceneStartState,
    );

    const endTimeElIndex = transcriptDataState.findIndex(
      (transcriptLine) => transcriptLine.id === sceneEndstate,
    );

    const isLastIndex = endTimeElIndex === transcriptDataState.length - 1;

    if (isLastIndex) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post('http://localhost:4000/audio-snippet', {
        contentName,
        trimStart: firstTrim.time,
        trimEnd: transcriptDataState[endTimeElIndex + 1].time,
      });
      setAudioSnippetURLState(response.data.file);
    } catch (error) {
      console.error('Error converting video to audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTrimFromStart = () => {
    if (decrepenacyState) {
      return secondsToHms(decrepenacyState);
    }

    return 'TRIM-STARTS-HERE';
  };

  const getTrimFromEnd = () => {
    if (lastAudioTimeStampState) {
      return secondsToHms(lastAudioTimeStampState);
    }
    return 'TRIM-END-HERE';
  };

  const contentNamePlaceholder = contentName || 'CONTENT-NAME';

  const commandToCopy = `ffmpeg -i ${contentNamePlaceholder}.webm -ss ${getTrimFromStart()} -to ${getTrimFromEnd()} -vn -ar 44100 -ab 96k -ac 2 ${contentNamePlaceholder}.mp3`;
  return (
    <div
      className='App'
      style={{
        padding: '15px',
      }}
    >
      {isLoading ? (
        <div
          style={{ position: 'absolute', top: '50%', display: 'inline-flex' }}
        >
          <p
            style={{
              textAlign: 'center',
              fontWeight: 700,
              color: 'red',
              fontSize: 30,
            }}
          >
            ...LOADING!!
          </p>
        </div>
      ) : null}
      <h1>Screen recording to compressed MP3</h1>
      <VideoSnippingCheckList
        hasTxtFile={transcriptDataState}
        webmFileState={webmFileState}
        hasWebmFile={webmFileUrlState}
        hasTrimFromStart={decrepenacyState}
        hasTrimFromEnd={lastAudioTimeStampState}
        hasContentBeenNamed={contentName}
        hasWebmBeenSentToServer={hasVideoBeenUploaded}
      />
      {fileURL ? (
        <AudioPlayer
          url={'http://localhost:4000' + fileURL}
          subtitles={transcriptDataState}
          decrepenacyState={decrepenacyState}
        />
      ) : null}
      <UploadingComponents
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleVideoFileChange={handleVideoFileChange}
        contentName={contentName}
      />
      <div>
        <button disabled={hasVideoBeenUploaded} onClick={handleWebMToServer}>
          webm to server
        </button>
      </div>
      <div>
        <p style={{ display: 'inline-flex', gap: '10px' }}>{commandToCopy}</p>
      </div>
      {webmFileUrlState ? (
        <VideoPlayer
          decrepenacyState={decrepenacyState}
          setDecrepenacyState={setDecrepenacyState}
          lastAudioTimeStampState={lastAudioTimeStampState}
          setLastAudioTimeStampState={setLastAudioTimeStampState}
          currentTimeState={currentTimeState}
          setCurrentTimeState={setCurrentTimeState}
          transcriptDataState={transcriptDataState}
          webmFileUrlState={webmFileUrlState}
          timeIsAligned={fileURL}
          setSceneEndState={setSceneEndState}
          sceneStartState={sceneStartState}
          setSceneStartState={setSceneStartState}
          sceneEndstate={sceneEndstate}
        />
      ) : null}
      <div>
        <button
          disabled={!Boolean(sceneStartState && sceneEndstate)}
          onClick={handleCreateSnippetFromVideo}
        >
          Create snippet from {sceneStartState} ➡️ {sceneEndstate}
        </button>
      </div>
      <button
        onClick={handleConvertWebmToMP3}
        disabled={Boolean(
          fileURL ||
            !contentName ||
            !decrepenacyState ||
            !lastAudioTimeStampState ||
            !hasVideoBeenUploaded,
        )}
      >
        Trigger conversion
      </button>
    </div>
  );
}

export default App;
