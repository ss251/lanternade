import { NextRequest, NextResponse } from 'next/server';
import { Livepeer } from 'livepeer';

const livepeer = new Livepeer({
  apiKey: process.env.LIVEPEER_API_KEY as string,
});

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    const stream = await livepeer.stream.create({
      name,
      profiles: [
        {
          name: '720p',
          bitrate: 2000000,
          fps: 30,
          width: 1280,
          height: 720,
        },
        {
          name: '480p',
          bitrate: 1000000,
          fps: 30,
          width: 854,
          height: 480,
        },
        {
          name: '360p',
          bitrate: 500000,
          fps: 30,
          width: 640,
          height: 360,
        },
      ],
    });

    return NextResponse.json({
      id: stream.stream?.id,
      streamKey: stream.stream?.streamKey,
      playbackId: stream.stream?.playbackId,
      name: stream.stream?.name,
      isActive: stream.stream?.isActive,
      createdAt: stream.stream?.createdAt,
    });
  } catch (error) {
    console.error('Error creating livestream:', error);
    return NextResponse.json({ error: 'Failed to create livestream' }, { status: 500 });
  }
}
