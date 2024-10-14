'use client';

import React, { useEffect, useState } from 'react';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { Src } from "@livepeer/react";

export default function ViewLivestream({ params }: { params: { playbackId: string } }) {
  const { playbackId } = params;
  const [src, setSrc] = useState<Src[]>([]);

  useEffect(() => {
    async function fetchPlaybackSource() {
      try {
        const response = await fetch(`/api/get-playback-source?playbackId=${playbackId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch playback source');
        }
        const data = await response.json();
        setSrc(data.src);
      } catch (error) {
        console.error('Error fetching playback source:', error);
      }
    }

    fetchPlaybackSource();
  }, [playbackId]);

  return (
    <div className="max-w-3xl mx-auto mt-24 p-6 rounded-lg dark:bg-secondary bg-white shadow-md">
      <h1 className="text-2xl font-bold mb-4">View Livestream</h1>
      {src.length > 0 ? (
        <PlayerWithControls src={src} />
      ) : (
        <p>Loading stream...</p>
      )}
    </div>
  );
}
