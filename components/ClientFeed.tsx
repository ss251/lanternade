'use client';

import React from 'react';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useNeynarContext } from "@neynar/react";
import { getFeed } from '@/lib/api'
import CastCard from '@/components/CastCard';
import CastSkeleton from '@/components/CastSkeleton';
import { Cast } from '@/types/neynar';
import { useDebounce } from '@/hooks/useDebounce';
import { useOnline } from '@/hooks/useOnline';

const POSTS_PER_LOAD = 5;
const DEBOUNCE_DELAY = 200; // ms

export default function ClientFeed({ initialCursor }: { initialCursor?: string }) {
  const { user } = useNeynarContext();
  const { ref, inView } = useInView();
  const debouncedInView = useDebounce(inView, DEBOUNCE_DELAY);
  const queryClient = useQueryClient();
  const isOnline = useOnline();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['feed', user?.fid],
    queryFn: async ({ pageParam = initialCursor, signal }) => {
      const result = await getFeed(user?.fid?.toString() ?? '', POSTS_PER_LOAD, pageParam as string | undefined, signal);
      return result;
    },
    getNextPageParam: (lastPage) => lastPage.next?.cursor,
    enabled: !!user && isOnline,
    initialPageParam: initialCursor,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    gcTime: 1000 * 60 * 60, // 1 hour
  });

  React.useEffect(() => {
    if (debouncedInView && hasNextPage && !isFetchingNextPage && isOnline) {
      fetchNextPage();
    }
  }, [debouncedInView, fetchNextPage, hasNextPage, isFetchingNextPage, isOnline]);

  React.useEffect(() => {
    return () => {
      queryClient.cancelQueries({ queryKey: ['feed', user?.fid] });
    };
  }, [queryClient, user?.fid]);

  if (status === 'pending') return <CastSkeleton count={POSTS_PER_LOAD} />;
  if (status === 'error') return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      {data?.pages.flatMap((page, i) => 
        page.casts.map((cast: Cast) => (
          <CastCard key={`${cast.hash}-${i}`} cast={cast} />
        ))
      )}
      <div ref={ref}>
        {isFetchingNextPage && <CastSkeleton count={1} />}
      </div>
    </>
  );
}
