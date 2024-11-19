import React from 'react';
import { Clock } from 'lucide-react';

interface TimeRangeSelectorProps {
  startTime: number;
  endTime: number;
  duration: number;
  onStartTimeChange: (time: number) => void;
  onEndTimeChange: (time: number) => void;
}

export function TimeRangeSelector({
  startTime,
  endTime,
  duration,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangeSelectorProps) {
  const formatTime = (seconds: number) => {
    const pad = (num: number) => num.toString().padStart(2, '0');
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours > 0 ? `${hours}:` : ''}${pad(minutes)}:${pad(secs)}`;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="range"
            min="0"
            max={duration}
            value={startTime}
            onChange={(e) => onStartTimeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm font-mono text-gray-600">{formatTime(startTime)}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Clock className="w-5 h-5 text-gray-600" />
        <div className="flex-1 space-y-2">
          <label className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="range"
            min={startTime}
            max={duration}
            value={endTime}
            onChange={(e) => onEndTimeChange(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-sm font-mono text-gray-600">{formatTime(endTime)}</div>
        </div>
      </div>
    </div>
  );
}