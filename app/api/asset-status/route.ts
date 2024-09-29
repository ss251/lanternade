import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Asset ID is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://livepeer.studio/api/asset/${id}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.LIVEPEER_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch asset status');
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in asset-status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}