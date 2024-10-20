import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function POST(request: NextRequest) {
  const { signer_uuid, target_fid } = await request.json();

  if (!signer_uuid || !target_fid) {
    return NextResponse.json({ error: "Signer UUID and target FID are required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.neynar.com/v2/farcaster/user/follow", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
      body: JSON.stringify({
        signer_uuid,
        target_fids: [target_fid],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error following user:", error);
    return NextResponse.json({ error: "Failed to follow user" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { signer_uuid, target_fid } = await request.json();

  if (!signer_uuid || !target_fid) {
    return NextResponse.json({ error: "Signer UUID and target FID are required" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.neynar.com/v2/farcaster/user/follow", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
      body: JSON.stringify({
        signer_uuid,
        target_fids: [target_fid],
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error unfollowing user:", error);
    return NextResponse.json({ error: "Failed to unfollow user" }, { status: 500 });
  }
}
