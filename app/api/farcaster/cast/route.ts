import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const identifier = searchParams.get('identifier');
  const type = searchParams.get('type');

  if (!identifier || !type) {
    return NextResponse.json({ error: "Identifier and type are required" }, { status: 400 });
  }

  const url = new URL("https://api.neynar.com/v2/farcaster/cast");
  url.searchParams.append("identifier", identifier);
  url.searchParams.append("type", type);

  try {
    const response = await fetch(url, {
      headers: {
        "accept": "application/json",
        "api_key": process.env.NEYNAR_API_KEY || "",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching cast:", error);
    return NextResponse.json({ error: "Failed to fetch cast" }, { status: 500 });
  }
}