const UploadingComponents = ({
  handleInputChange,
  handleFileChange,
  handleVideoFileChange,
  contentName,
}) => {
  return (
    <>
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
            disabled={!contentName}
          />
        </div>
      </div>
    </>
  );
};
export default UploadingComponents;
