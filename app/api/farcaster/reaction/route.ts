import { NextRequest, NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

export async function POST(request: NextRequest) {
  const { signer_uuid, reaction_type, target, target_author_fid } = await request.json();

  if (!signer_uuid || !reaction_type || !target || !target_author_fid) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const url = "https://api.neynar.com/v2/farcaster/reaction";

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
      body: JSON.stringify({
        signer_uuid,
        reaction_type,
        target,
        target_author_fid,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error posting reaction:", error);
    return NextResponse.json({ error: "Failed to post reaction" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { signer_uuid, reaction_type, target, target_author_fid } = await request.json();

  if (!signer_uuid || !reaction_type || !target || !target_author_fid) {
    return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
  }

  const url = "https://api.neynar.com/v2/farcaster/reaction";

  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json",
        "api_key": NEYNAR_API_KEY || "",
      },
      body: JSON.stringify({
        signer_uuid,
        reaction_type,
        target,
        target_author_fid,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error deleting reaction:", error);
    return NextResponse.json({ error: "Failed to delete reaction" }, { status: 500 });
  }
}