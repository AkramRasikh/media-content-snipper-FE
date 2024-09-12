import { useEffect, useState } from 'react';
import './App.css';
import VideoPlayer from './VideoPlayer';
import axios from 'axios';
import { txtToJSON } from './utils/txt-to-json';
import VideoSnippingCheckList from './VideoSnippingCheckList';

function App() {
  const [decrepenacyState, setDecrepenacyState] = useState(null);
  const [lastAudioTimeStampState, setLastAudioTimeStampState] = useState();
  const [outputFileNameState, setOutputFileNameState] = useState('OUTPUT-FILE');
  const [inputFileNameState, setInputFileNameState] = useState('INPUT-FILE');
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
          inputFileName: inputFileNameState,
          outputFileName: outputFileNameState,
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

  function secondsToHms(seconds) {
    // Calculate hours, minutes, seconds, and milliseconds
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const millisecs = Math.floor((seconds % 1) * 1000); // Get the milliseconds

    // Pad the values with leading zeros if necessary
    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');
    const formattedMillisecs = millisecs.toString().padStart(3, '0');

    // Return the formatted time with milliseconds
    return `${formattedHrs}:${formattedMins}:${formattedSecs}.${formattedMillisecs}`;
  }

  const handleInputChange = (e) => {
    setOutputFileNameState(e.target.value);
  };
  const handleInputFileNameChange = (e) => {
    setInputFileNameState(e.target.value);
  };

  const handleVideoFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type === 'video/webm') {
      console.log('## ', { selectedFile });

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

  const commandToCopy = `ffmpeg -i ${inputFileNameState}.webm -ss ${getTrimFromStart()} -to ${getTrimFromEnd()} -vn -ar 44100 -ab 96k -ac 2 ${outputFileNameState}.mp3`;
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
      />
      <div>
        <input
          type='text'
          id='fileName'
          value={outputFileNameState}
          onChange={handleInputChange}
          placeholder='Enter file name'
        />
        <input
          type='text'
          id='inputFileName'
          value={inputFileNameState}
          onChange={handleInputFileNameChange}
          placeholder='Enter input file name'
        />
      </div>
      <div style={{ display: 'inline-flex', gap: '10px', margin: '10px' }}>
        <p>Webm ting</p>
        <input type='file' accept='.webm' onChange={handleVideoFileChange} />
      </div>
      <p style={{ display: 'inline-flex', gap: '10px' }}>
        {commandToCopy}
        <span>Start audio trim{decrepenacyState ? '✅' : '❌'}</span>
        <span>End audio trim: {lastAudioTimeStampState ? '✅' : '❌'}</span>
      </p>
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
          !inputFileNameState ||
            !outputFileNameState ||
            !decrepenacyState ||
            !lastAudioTimeStampState,
        )}
      >
        Trigger conversion
      </button>
    </div>
  );
}

export default App;
