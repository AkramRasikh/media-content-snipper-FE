const VideoSnippingCheckList = ({
  hasTxtFile,
  webmFileState,
  hasWebmFile,
  hasTrimFromStart,
  hasTrimFromEnd,
  hasWebmBeenSentToServer,
  hasContentBeenNamed,
}) => {
  return (
    <div style={{ textAlign: 'left' }}>
      <ol>
        <li>Upload .webm file {webmFileState ? '✅' : '❌'}</li>
        <li>
          Upload has content been named {hasContentBeenNamed ? '✅' : '❌'}
        </li>
        <li>Upload .txt file {hasWebmFile ? '✅' : '❌'}</li>
        <li>
          Trim from start - align video with subs{' '}
          {hasTrimFromStart ? '✅' : '❌'}
        </li>
        <li>
          Trim from end - unnecessary bloat {hasTrimFromEnd ? '✅' : '❌'}
        </li>
        <li>Send webm to server {hasWebmBeenSentToServer ? '✅' : '❌'}</li>
      </ol>
    </div>
  );
};

export default VideoSnippingCheckList;
