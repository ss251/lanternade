import { NextRequest, NextResponse } from 'next/server';

const LIVEPEER_API_KEY = process.env.LIVEPEER_AI_API_KEY;
const API_URL = 'https://dream-gateway.livepeer.cloud/audio-to-text';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const audio = formData.get('audio') as File;
  const model_id = formData.get('model_id') as string || 'openai/whisper-large-v3';

  // Create a new FormData object to send to the Livepeer API
  const apiFormData = new FormData();
  apiFormData.append('audio', audio);
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
    // Return the entire result, which includes both 'chunks' and 'text'
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error transcribing audio:', error);
    return NextResponse.json({ error: 'Failed to transcribe audio' }, { status: 500 });
  }
}
