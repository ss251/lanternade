import { NextRequest, NextResponse } from 'next/server';

const LIVEPEER_API_KEY = process.env.LIVEPEER_AI_API_KEY;
const API_URL = 'https://dream-gateway.livepeer.cloud/image-to-image';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const prompt = formData.get('prompt') as string;
  const image = formData.get('image') as File;
  const model_id = formData.get('model_id') as string;
  const loras = formData.get('loras') as string | null;

  const apiFormData = new FormData();
  apiFormData.append('prompt', prompt);
  apiFormData.append('image', image);
  apiFormData.append('model_id', model_id);
  if (loras) apiFormData.append('loras', loras);

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
    return NextResponse.json({ imageUrl: result.images[0].url });
  } catch (error) {
    console.error('Error transforming image:', error);
    return NextResponse.json({ error: 'Failed to transform image' }, { status: 500 });
  }
}
