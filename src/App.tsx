import React, { useState, useRef } from 'react';
import ReactPlayer from 'react-player';
import { Youtube, AlertCircle, Copy, Trash2 } from 'lucide-react';
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
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  const handleUrlChange = (input: string) => {
    setUrl(input);
    setIsValidUrl(ReactPlayer.canPlay(input));
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

  // ... (rest of the previous handlers remain the same)

  return (
    <div className="flex h-screen">
      {/* Left Panel - Inputs */}
      <div className="w-2/5 p-6 bg-gray-50 overflow-y-auto">
        {/* ... (previous input section remains the same) */}
        <CommandOutput
          url={url}
          startTime={startTime}
          endTime={endTime}
          format={format}
          fileName={fileName}
          onCommandCopy={addToCommandHistory}
        />
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