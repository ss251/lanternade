import React from 'react';
import ClientFeed from '@/components/ClientFeed';

export default function Feed({ searchParams }: { searchParams: { cursor?: string } }) {
  const { cursor } = searchParams;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6 mt-20">
        <ClientFeed initialCursor={cursor} />
      </div>
    </div>
  );
}
