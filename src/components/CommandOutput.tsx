import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface CommandOutputProps {
  url: string;
  startTime: number;
  endTime: number;
  format: 'audio' | 'video';
  fileName?: string;
}

export function CommandOutput({ url, startTime, endTime, format, fileName }: CommandOutputProps) {
  const [copied, setCopied] = useState(false);

  const getCommand = () => {
    const timeRange = `--download-sections "*${startTime}-${endTime}"`;
    const filenameOption = fileName ? `-o "${fileName}.%(ext)s"` : '';
    
    if (format === 'audio') {
      return `yt-dlp -x --audio-format mp3 ${timeRange} ${filenameOption} ${url}`;
    }
    return `yt-dlp -f "bv*+ba/b" ${timeRange} ${filenameOption} ${url}`;
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(getCommand());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Generated Command</label>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-500" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-4 bg-gray-800 text-gray-100 rounded-lg overflow-x-auto text-sm font-mono">
        {getCommand()}
      </pre>
    </div>
  );
}