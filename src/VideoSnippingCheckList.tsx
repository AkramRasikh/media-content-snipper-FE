const VideoSnippingCheckList = ({
  hasTxtFile,
  hasWebmFile,
  hasTrimFromStart,
  hasTrimFromEnd,
  hasWebmBeenSentToServer,
}) => {
  return (
    <div>
      <ol>
        <li>Upload .webm file {hasTxtFile ? '✅' : '❌'}</li>
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
