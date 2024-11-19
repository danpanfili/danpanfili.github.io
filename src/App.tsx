import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Youtube, AlertCircle, Copy, Trash2, FolderOpen } from 'lucide-react';
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
  const [downloadPath, setDownloadPath] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const fileInputRef = useRef(null);

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

  const addToCommandHistory = (command: string) => {
    setCommandHistory(prev => 
      prev.includes(command) 
        ? prev 
        : [command, ...prev].slice(0, 10)
    );
  };

  const handleCopyFromHistory = async (command: string) => {
    await navigator.clipboard.writeText(command);
  };

  const clearCommandHistory = () => {
    setCommandHistory([]);
  };

  const handleFolderSelect = (e) => {
    const folder = e.target.files[0];
    if (folder) {
      setDownloadPath(folder.webkitRelativePath.split('/')[0]);
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

              <div className="space-y-2">
                <label htmlFor="downloadPath" className="block text-sm font-medium text-gray-700">
                  Download Location
                </label>
                <div className="relative">
                  <div 
                    className="absolute inset-y-0 left-0 pl-3 flex items-center cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <FolderOpen className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      webkitdirectory=""
                      className="hidden"
                      onChange={handleFolderSelect}
                    />
                  </div>
                  <input
                    id="downloadPath"
                    type="text"
                    value={downloadPath}
                    onChange={(e) => setDownloadPath(e.target.value)}
                    placeholder="/path/to/download/folder"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Enter the full path where files should be downloaded
                </p>
              </div>

              <CommandOutput
                url={url}
                startTime={startTime}
                endTime={endTime}
                format={format}
                fileName={fileName}
                downloadPath={downloadPath}
                onCommandCopy={addToCommandHistory}
              />
            </div>
          )}
        </div>
      </div>

      {/* Right Panel - Top: Video, Bottom: Command History */}
      <div className="w-3/5 flex flex-col">
        {/* Top Right - Video Player */}
        <div className="h-2/3 bg-black flex items-center justify-center p-6">
          {isValidUrl ? (
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
          ) : (
            <div className="text-white text-center">
              Enter a YouTube URL to begin
            </div>
          )}
        </div>

        {/* Bottom Right - Command History */}
        <div className="h-1/3 bg-gray-100 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">Command History</h2>
            {commandHistory.length > 0 && (
              <button 
                onClick={clearCommandHistory}
                className="text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            )}
          </div>
          {commandHistory.length === 0 ? (
            <p className="text-gray-500 text-sm">No commands copied yet</p>
          ) : (
            <ul className="space-y-2">
              {commandHistory.map((command, index) => (
                <li 
                  key={index} 
                  className="bg-white p-2 rounded-md shadow-sm flex justify-between items-center"
                >
                  <pre className="text-xs overflow-x-auto flex-grow mr-2">{command}</pre>
                  <button 
                    onClick={() => handleCopyFromHistory(command)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;