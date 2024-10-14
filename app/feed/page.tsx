import React from 'react';
import { getFeed } from '@/lib/api';
import ClientFeed from '@/components/ClientFeed';
import CastSkeleton from '@/components/CastSkeleton';
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';

const POSTS_PER_LOAD = 5;

export default async function Feed({ searchParams }: { searchParams: { cursor?: string } }) {
  const { cursor } = searchParams;
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => getFeed('', POSTS_PER_LOAD, pageParam as string | undefined),
    initialPageParam: cursor,
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6 mt-20">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <React.Suspense fallback={<CastSkeleton count={POSTS_PER_LOAD} />}>
            <ClientFeed initialCursor={cursor} />
          </React.Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
