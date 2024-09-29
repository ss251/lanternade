"use client"

// app/page.tsx

import { useState } from 'react';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { Src } from '@livepeer/react';

export default function Home() {
  const [video, setVideo] = useState<File | null>(null);
  // const [assetId, setAssetId] = useState<string>('');
  const [playbackId, setPlaybackId] = useState<string>('');
  const [assetStatus, setAssetStatus] = useState<string>('idle');
  const [videoSrc, setVideoSrc] = useState<Src[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (video) {
      // Request upload URL
      const res = await fetch('/api/request-upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: video.name }),
      });
      const data = await res.json();

      // setAssetId(asset.id);

      // Upload the file using the upload URL
      await fetch(data.url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        body: video,
      });

      // Poll for asset status
      checkAssetStatus(data.asset.id);
    }
  };

  const checkAssetStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/asset-status?id=${id}`);
      const data = await res.json();
  
      setAssetStatus(data.status.phase);
  
      if (data.status.phase === 'ready') {
        clearInterval(interval);
        setPlaybackId(data.playbackId);
        
        // Fetch the playback source from our new API route
        const sourceRes = await fetch(`/api/get-playback-source?playbackId=${data.playbackId}`);
        const sourceData = await sourceRes.json();
        
        if (sourceData.src) {
          setVideoSrc(sourceData.src);
        } else {
          console.error('Failed to fetch playback source');
        }
      }
    }, 5000);
  };

  return (
    <main className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold mb-6 text-center">Lanternade</h1>
        <p className="text-gray-300 mb-6 text-center">
          Decentralized Web3 Social Platform
        </p>
        <div className="space-y-4">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300
                       file:py-2 file:px-4 file:rounded-full file:border-0
                       file:text-sm file:font-semibold file:bg-blue-500 file:text-white
                       hover:file:bg-blue-600"
          />
          <button
            disabled={!video}
            onClick={handleUpload}
            className={`w-full py-2 px-4 rounded font-bold text-white transition-colors ${
              !video
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Upload Video
          </button>

          {assetStatus !== 'idle' && assetStatus !== 'ready' && (
            <div className="mt-4">
              <p className="text-sm text-gray-300">Asset Status: {assetStatus}</p>
            </div>
          )}

          {playbackId && (
            <div className="mt-8 w-full">
              <h2 className="text-2xl font-bold mb-4">Uploaded Video</h2>
              <div className="aspect-w-16 aspect-h-9">
              <PlayerWithControls src={videoSrc as Src[]} />
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}