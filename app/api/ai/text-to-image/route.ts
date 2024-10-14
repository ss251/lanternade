import { NextRequest, NextResponse } from 'next/server';

const LIVEPEER_API_KEY = process.env.LIVEPEER_AI_API_KEY;
const API_URL = 'https://dream-gateway.livepeer.cloud/text-to-image';

export async function POST(request: NextRequest) {
  const { prompt, model_id, width = 1024, height = 1024, loras } = await request.json();

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIVEPEER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        model_id,
        width,
        height,
        loras: loras ? JSON.parse(loras) : undefined,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Livepeer API error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json({ imageUrl: result.images[0].url });
  } catch (error) {
    console.error('Error generating image:', error);
    return NextResponse.json({ error: 'Failed to generate image' }, { status: 500 });
  }
}
