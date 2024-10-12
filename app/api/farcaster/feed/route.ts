import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fid = searchParams.get('fid');
  const cursor = searchParams.get('cursor');

  if (!fid) {
    return NextResponse.json({ error: "FID is required" }, { status: 400 });
  }

  const url = new URL("https://api.neynar.com/v2/farcaster/feed");
  url.searchParams.append("feed_type", "following");
  url.searchParams.append("fid", fid);
  url.searchParams.append("limit", "20");
  if (cursor) {
    url.searchParams.append("cursor", cursor);
  }

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching feed:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}