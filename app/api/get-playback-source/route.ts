import { NextResponse } from 'next/server';
import { getSrc } from "@livepeer/react/external";
import { livepeer } from '@/utils/livepeer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const playbackId = searchParams.get('playbackId');

  if (!playbackId) {
    return NextResponse.json({ error: 'Playback ID is required' }, { status: 400 });
  }

  try {
    const response = await livepeer.playback.get(playbackId);
    const src = getSrc(response.playbackInfo);
    console.log('Playback source:', src);
    return NextResponse.json({ src });
  } catch (error) {
    console.error('Error fetching playback source:', error);
    return NextResponse.json({ error: 'Failed to fetch playback source' }, { status: 500 });
  }
}