import React, { useState, useEffect } from 'react';
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
  const [localStartTime, setLocalStartTime] = useState(formatTimeForInput(startTime));
  const [localEndTime, setLocalEndTime] = useState(formatTimeForInput(endTime));
  const [overlap, setOverlap] = useState(false);

  useEffect(() => {
    setLocalStartTime(formatTimeForInput(startTime));
  }, [startTime]);

  useEffect(() => {
    setLocalEndTime(formatTimeForInput(endTime));
  }, [endTime]);

  useEffect(() => {
    // Check for overlap when startTime and endTime are close
    setOverlap(Math.abs(startTime - endTime) < duration * 0.02); // Adjust threshold as needed
  }, [startTime, endTime, duration]);

  function formatTimeForInput(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    const ms = Math.round((seconds % 1) * 100);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${ms
      .toString()
      .padStart(2, '0')}`;
  }

  function parseTimeInput(timeStr: string): number {
    const match = timeStr.match(/^(\d{2}):(\d{2}):(\d{2})\.(\d{2})$/);
    if (!match) return -1;

    const [_, hours, minutes, seconds, centiseconds] = match;
    return (
      parseInt(hours) * 3600 +
      parseInt(minutes) * 60 +
      parseInt(seconds) +
      parseInt(centiseconds) / 100
    );
  }

  function handleTimeInput(type: 'start' | 'end', value: string) {
    const timeValue = parseTimeInput(value);
    if (timeValue >= 0 && timeValue <= duration) {
      if (type === 'start' && timeValue <= endTime) {
        onStartTimeChange(timeValue);
      } else if (type === 'end' && timeValue >= startTime) {
        onEndTimeChange(timeValue);
      }
    }
  }

  const progressStyle = {
    background: `linear-gradient(to right, 
      #e5e7eb 0%, 
      #e5e7eb ${(startTime / duration) * 100}%, 
      #6366f1 ${(startTime / duration) * 100}%, 
      #6366f1 ${(endTime / duration) * 100}%, 
      #e5e7eb ${(endTime / duration) * 100}%, 
      #e5e7eb 100%)`,
  };

  const thumbStyle = (type: 'start' | 'end') => {
    if (type === 'end') {
      return overlap
        ? { transform: 'translateY(10px)', border: '2px solid #6366f1', background: 'transparent' }
        : { border: '2px solid #6366f1', background: 'transparent' };
    } else if (type === 'start') {
      return overlap ? { transform: 'translateY(-10px)' } : {};
    }
    return {};
  };

  return (
    <div className="space-y-6">
      <div className="relative pt-6">
        <div className="absolute w-full h-2 rounded-lg" style={progressStyle} />
        <input
          type="range"
          min="0"
          max={duration}
          step="0.01"
          value={startTime}
          onChange={(e) => onStartTimeChange(Number(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          style={thumbStyle('start')}
        />
        <input
          type="range"
          min="0"
          max={duration}
          step="0.01"
          value={endTime}
          onChange={(e) => onEndTimeChange(Number(e.target.value))}
          className="absolute w-full h-2 bg-transparent appearance-none pointer-events-none"
          style={thumbStyle('end')}
        />
      </div>

      <div className="flex gap-6">
        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4" />
            Start Time
          </label>
          <input
            type="text"
            pattern="\d{2}:\d{2}:\d{2}\.\d{2}"
            value={localStartTime}
            onChange={(e) => setLocalStartTime(e.target.value)}
            onBlur={(e) => handleTimeInput('start', e.target.value)}
            placeholder="00:00:00.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          />
        </div>

        <div className="flex-1 space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Clock className="w-4 h-4" />
            End Time
          </label>
          <input
            type="text"
            pattern="\d{2}:\d{2}:\d{2}\.\d{2}"
            value={localEndTime}
            onChange={(e) => setLocalEndTime(e.target.value)}
            onBlur={(e) => handleTimeInput('end', e.target.value)}
            placeholder="00:00:00.00"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}
