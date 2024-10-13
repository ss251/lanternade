import React from 'react';
import CastCard from '@/components/CastCard';
import RepliesSection from '@/components/RepliesSection';
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

async function getCast(hash: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/farcaster/cast?identifier=${hash}&type=hash`, { cache: 'no-store' });
    if (!response.ok) {
      throw new Error('Failed to fetch cast');
    }
    return response.json();
}

export default async function CastPage({ params }: { params: { hash: string } }) {
  const { cast } = await getCast(params.hash);

  if (!cast) {
    return <div>Cast not found</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4 mt-16">
      <div className="bg-background rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <CastCard cast={cast} />
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-300px)] p-6">
          <RepliesSection parentHash={cast.hash} repliesCount={cast.replies.count} />
        </ScrollArea>
      </div>
    </div>
  );
}
