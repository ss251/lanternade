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
    
    // Extract IPFS hash from the source URL
    const ipfsHash = data.storage?.ipfs?.cid || null;

    return NextResponse.json({ ...data, ipfsHash });
  } catch (error) {
    console.error('Error in asset-status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
