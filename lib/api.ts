import { Cast } from '@/types/neynar';

export async function getFeed(fid: string, limit: number, cursor?: string): Promise<{ casts: Cast[], next?: { cursor: string } }> {
  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/farcaster/feed?fid=${fid}&limit=${limit}${cursor ? `&cursor=${cursor}` : ''}`;
  
  console.log('Fetching from URL:', url); // Debug log

  try {
    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API request failed: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching feed:', error);
    throw new Error('Failed to fetch feed. Please check your network connection and try again.');
  }
}
