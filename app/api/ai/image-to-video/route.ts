import { NextRequest, NextResponse } from 'next/server';

const LIVEPEER_API_KEY = process.env.LIVEPEER_AI_API_KEY;
const API_URL = 'https://dream-gateway.livepeer.cloud/image-to-video';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const image = formData.get('image') as File;
  const model_id = formData.get('model_id') as string;

  const apiFormData = new FormData();
  apiFormData.append('image', image);
  apiFormData.append('model_id', model_id);

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LIVEPEER_API_KEY}`,
      },
      body: apiFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Livepeer API error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return NextResponse.json({ videoUrl: result.images[0].url });
  } catch (error) {
    console.error('Error generating video:', error);
    return NextResponse.json({ error: 'Failed to generate video' }, { status: 500 });
  }
}
