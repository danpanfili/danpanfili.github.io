import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Youtube, AlertCircle } from 'lucide-react';
import { TimeRangeSelector } from './components/TimeRangeSelector';
import { CommandOutput } from './components/CommandOutput';

function App() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [format, setFormat] = useState<'audio' | 'video'>('audio');
  const [isLooping, setIsLooping] = useState(false);
  const [fileName, setFileName] = useState('');
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  const handleUrlChange = (input: string) => {
    setUrl(input);
    setIsValidUrl(ReactPlayer.canPlay(input));
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
    setEndTime(duration);
  };

  const handleProgress = ({ playedSeconds }: { playedSeconds: number }) => {
    if (isLooping && playedSeconds >= endTime) {
      playerRef.current?.seekTo(startTime, 'seconds');
    }
  };

  const handleTimeUpdate = (type: 'start' | 'end', time: number) => {
    if (type === 'start') {
      setStartTime(time);
      playerRef.current?.seekTo(time, 'seconds');
    } else {
      setEndTime(time);
      if (playerRef.current?.getCurrentTime() > time) {
        playerRef.current?.seekTo(time, 'seconds');
      }
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Inputs */}
      <div className="w-2/5 p-6 bg-gray-50 overflow-y-auto">
        <header className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">YouTube Timestamp Tool</h1>
          <p className="text-gray-600 text-sm">Generate yt-dlp commands for specific time ranges</p>
        </header>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              YouTube URL
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Youtube className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {url && !isValidUrl && (
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle className="w-5 h-5" />
                <span className="text-sm">Please enter a valid YouTube URL</span>
              </div>
            )}
          </div>

          {isValidUrl && (
            <div className="space-y-4">
              <TimeRangeSelector
                startTime={startTime}
                endTime={endTime}
                duration={duration}
                onStartTimeChange={(time) => handleTimeUpdate('start', time)}
                onEndTimeChange={(time) => handleTimeUpdate('end', time)}
              />

              <div className="flex items-center gap-4">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={isLooping}
                    onChange={(e) => setIsLooping(e.target.checked)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Loop selected range</span>
                </label>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Output Format
                </label>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={format === 'audio'}
                      onChange={() => setFormat('audio')}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Audio (MP3)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      checked={format === 'video'}
                      onChange={() => setFormat('video')}
                      className="form-radio text-indigo-600"
                    />
                    <span className="ml-2">Video (MP4)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
                  Output File Name
                </label>
                <input
                  id="fileName"
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name (optional)"
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <CommandOutput
                url={url}
                startTime={startTime}
                endTime={endTime}
                format={format}
                fileName={fileName}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Video */}
      <div className="w-3/5 bg-black flex items-center justify-center p-6">
        {isValidUrl ? (
          <div className="w-full max-h-full">
            <ReactPlayer
              ref={playerRef}
              url={url}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onDuration={handleDuration}
              onProgress={handleProgress}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>
        ) : (
          <div className="text-white text-center">
            Enter a YouTube URL to begin
          </div>
        )}
      </div>
    </div>
  );
}

export default App;