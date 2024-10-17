import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name } = await request.json();

    const response = await fetch('https://livepeer.studio/api/asset/request-upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        storage: {
          ipfs: true,
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to request upload URL');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in request-upload:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
