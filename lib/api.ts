import { Cast } from '@/types/neynar';

export async function getFeed(fid: string, limit: number, cursor?: string, signal?: AbortSignal): Promise<{ casts: Cast[], next?: { cursor: string } }> {
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL 
    : window.location.origin;
  
  const url = `${baseUrl}/api/farcaster/feed?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
  
  console.log('Fetching from URL:', url); // Debug log

  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Fetch aborted');
      throw error;
    }
    console.error('Error fetching feed:', error);
    throw new Error('Failed to fetch feed. Please check your network connection and try again.');
  }
}

export async function fetchRecastedCast(hash: string): Promise<Cast> {
  const baseUrl = typeof window === 'undefined' 
    ? process.env.NEXT_PUBLIC_API_URL 
    : window.location.origin;

  const url = `${baseUrl}/api/farcaster/cast?identifier=${hash}&type=hash`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch recasted cast');
    }
    const data = await response.json();
    return data.cast;
  } catch (error) {
    console.error('Error fetching recasted cast:', error);
    throw error;
  }
}
