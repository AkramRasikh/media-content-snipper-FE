import { useState } from 'react';
import './App.css';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';
import { txtToJSON } from './utils/txt-to-json';
import VideoSnippingCheckList from './VideoSnippingCheckList';
import { secondsToHms } from './utils/secondsToHMSS';

function App() {
  const [decrepenacyState, setDecrepenacyState] = useState(null);
  const [lastAudioTimeStampState, setLastAudioTimeStampState] = useState();
  const [contentName, setContentName] = useState('');
  const [currentTimeState, setCurrentTimeState] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [fileURL, setFileURL] = useState('');
  const [file, setFile] = useState(null);

  const [transcriptDataState, setTranscriptDataState] = useState('');
  const [error, setError] = useState(null);
  const [webmFileState, setWebmFileState] = useState(null);
  const [webmFileUrlState, setWebmFileUrlState] = useState(null);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleWebMToServer = async () => {
    if (!webmFileState) {
      alert('Please select a file first.');
      return;
    }

    const formData = new FormData();
    formData.append('file', webmFileState);

    try {
      const response = await axios.post(
        'http://localhost:4000/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      setUploadMessage(`File uploaded successfully: ${response.data.filePath}`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadMessage('Failed to upload file');
    }
  };

  const handleTxtToJson = (fileData) => {
    const res = txtToJSON(fileData);
    setTranscriptDataState(res);
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
      console.log('## ', { first: event.target.files[0], thisFile });
    }
  };

  const handleConvert = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        'http://localhost:3000/*',
        // 'http://localhost:3000/video-to-audio',
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
      setWebmFileState(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setWebmFileUrlState(url);
    } else {
      alert('Please select a valid WebM file.');
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
      <h1>Low frustration</h1>
      <VideoSnippingCheckList
        hasTxtFile={transcriptDataState}
        hasWebmFile={webmFileUrlState}
        hasTrimFromStart={decrepenacyState}
        hasTrimFromEnd={lastAudioTimeStampState}
        hasContentBeenNamed={contentName}
      />
      <div>
        <input
          type='text'
          id='fileName'
          value={contentName}
          onChange={handleInputChange}
          placeholder='Enter content name (e.g diners-01-02-03) (first season, second episode, third scene)'
          style={{
            width: '75%',
          }}
        />
      </div>
      <div
        style={{
          display: 'inline-flex',
          gap: '10px',
          padding: '10px',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            gap: '10px',
            border: '1px solid grey',
            padding: '5px',
          }}
        >
          <label htmlFor='txtUpload'>.txt file upload</label>
          <input
            id='txtUpload'
            type='file'
            accept='*/*'
            onChange={handleFileChange}
            placeholder='Siu'
          />
        </div>
        <div
          style={{
            display: 'inline-flex',
            gap: '10px',
            border: '1px solid grey',
            padding: '5px',
          }}
        >
          <label htmlFor='webmUpload'>Webm upload</label>
          <input
            id='webmUpload'
            type='file'
            accept='.webm'
            onChange={handleVideoFileChange}
          />
        </div>
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
        />
      ) : null}
      {webmFileState && (
        <button onClick={handleWebMToServer}>webm to server</button>
      )}
      <button
        onClick={handleConvert}
        disabled={Boolean(
          !contentName || !decrepenacyState || !lastAudioTimeStampState,
        )}
      >
        Trigger conversion
      </button>
    </div>
  );
}

export default App;
