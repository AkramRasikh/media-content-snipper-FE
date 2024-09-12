export const MiniTransScript = ({
  subtitles,
  goToTimeStamp,
  currentTimeState,
  decrepenacyState,
  isUsingCutAudio,
}) => {
  const realDiffAudio = isUsingCutAudio ? 0 : decrepenacyState;
  return (
    <div style={{ height: '500px', overflowY: 'scroll' }}>
      <ul>
        {subtitles?.map((subtitle, index) => {
          const lastSubtitle = index === subtitles.length - 1;
          const thisSubtitleTimeWithDecprepancy =
            decrepenacyState && subtitle.time + realDiffAudio;

          const checkAgainstNextOne = () => {
            if (lastSubtitle) return true;
            const nextElTime = subtitles[index + 1].time + realDiffAudio;
            return nextElTime > currentTimeState;
          };
          const isThisPlaying =
            currentTimeState &&
            decrepenacyState &&
            thisSubtitleTimeWithDecprepancy &&
            currentTimeState > thisSubtitleTimeWithDecprepancy &&
            checkAgainstNextOne();

          return (
            <li key={index}>
              <div
                style={{
                  background: isThisPlaying ? 'yellow' : undefined,
                  display: 'flex',
                  marginTop: '10px',
                }}
              >
                <span>{subtitle.targetLang}</span>
                <div>
                  <button
                    style={{ color: 'green' }}
                    onClick={() => goToTimeStamp(subtitle.time + realDiffAudio)}
                  >
                    {(subtitle.time + realDiffAudio).toFixed(2)}
                  </button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const SideTranscript = ({
  subtitles,
  goToTimeStamp,
  setLastAudioTimeStampState,
  decrepenacyState,
  currentTimeState,
  handleDescrepancy,
  timeIsAligned,
}) => {
  return (
    <div style={{ height: '500px', overflowY: 'scroll' }}>
      <ul>
        {subtitles?.map((subtitle, index) => {
          const firstSubtitle = index === 0;
          const lastSubtitle = index === subtitles.length - 1;
          const thisSubtitleTimeWithDecprepancy =
            decrepenacyState && subtitle.time + decrepenacyState;

          const checkAgainstNextOne = () => {
            if (lastSubtitle) return true;
            const nextElTime = subtitles[index + 1].time + decrepenacyState;
            return nextElTime > currentTimeState;
          };
          const isThisPlaying =
            currentTimeState &&
            decrepenacyState &&
            thisSubtitleTimeWithDecprepancy &&
            currentTimeState > thisSubtitleTimeWithDecprepancy &&
            checkAgainstNextOne();

          return (
            <li key={index}>
              <div
                style={{
                  background: isThisPlaying ? 'yellow' : undefined,
                  display: 'flex',
                  marginTop: '10px',
                }}
              >
                <span>{subtitle.targetLang}</span>
                <div>
                  {!timeIsAligned && (
                    <button onClick={() => goToTimeStamp(subtitle.time)}>
                      Go to {subtitle.time}
                    </button>
                  )}
                  {!timeIsAligned && firstSubtitle && (
                    <button onClick={() => handleDescrepancy(subtitle.time)}>
                      descprenacy
                    </button>
                  )}
                  {!timeIsAligned && lastSubtitle && (
                    <button
                      onClick={() =>
                        setLastAudioTimeStampState(currentTimeState)
                      }
                    >
                      last sub
                    </button>
                  )}
                  {decrepenacyState ? (
                    <button
                      style={{ color: 'green' }}
                      onClick={() =>
                        goToTimeStamp(subtitle.time + decrepenacyState)
                      }
                    >
                      {(subtitle.time + decrepenacyState).toFixed(2)}
                    </button>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideTranscript;
