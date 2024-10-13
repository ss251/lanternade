import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const hash = searchParams.get('hash');
  const replyDepth = searchParams.get('reply_depth') || '2';

  if (!hash) {
    return NextResponse.json({ error: "Cast hash is required" }, { status: 400 });
  }

  const url = new URL("https://api.neynar.com/v2/farcaster/cast/conversation");
  url.searchParams.append("identifier", hash);
  url.searchParams.append("type", "hash");
  url.searchParams.append("reply_depth", replyDepth);

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Neynar API error:", errorData);
      throw new Error(`Neynar API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    return NextResponse.json({ error: "Failed to fetch conversation" }, { status: 500 });
  }
}
