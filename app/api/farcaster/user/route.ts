import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request: NextRequest) {
  console.log('API: Received request for user');
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get('fid');
  const viewerFid = searchParams.get('viewer_fid');

  if (!fid) {
    console.log('API: FID is missing');
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  console.log('API: Fetching user with FID:', fid, 'Viewer FID:', viewerFid);
  const url = new URL("https://api.neynar.com/v2/farcaster/user/bulk");
  url.searchParams.append("fids", fid);
  if (viewerFid) {
    url.searchParams.append("viewer_fid", viewerFid);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      console.error('API: Neynar API request failed:', response.status, response.statusText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API: User data fetched successfully');
    return NextResponse.json(data.users[0]);
  } catch (error) {
    console.error("API: Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
