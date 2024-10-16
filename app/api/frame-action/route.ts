import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_API_URL = "https://api.neynar.com/v2/farcaster/frame/action";

export async function POST(request: NextRequest) {
  if (!NEYNAR_API_KEY) {
    console.error('NEYNAR_API_KEY is not set');
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const payload = await request.json();
    const { signer_uuid, cast_hash, action } = payload;

    const response = await fetch(NEYNAR_API_URL, {
      method: 'POST',
      headers: {
        'api_key': NEYNAR_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        signer_uuid,
        cast_hash,
        action
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error handling frame action:', error);
    return NextResponse.json({ 
      error: 'Failed to handle frame action', 
      details: (error as Error).message 
    }, { status: 500 });
  }
}