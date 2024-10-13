'use client';

import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { useNeynarContext } from "@neynar/react";
import { getFeed } from '@/lib/api'
import CastCard from '@/components/CastCard';
import CastSkeleton from '@/components/CastSkeleton';
import { Cast } from '@/types/neynar';

const POSTS_PER_LOAD = 5;

export default function ClientFeed({ initialCursor }: { initialCursor?: string }) {
  const { user } = useNeynarContext();
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['feed', user?.fid],
    queryFn: ({ pageParam = initialCursor }) => 
      getFeed(user?.fid?.toString() ?? '', POSTS_PER_LOAD, pageParam as string | undefined),
    getNextPageParam: (lastPage) => lastPage.next?.cursor,
    enabled: !!user,
    initialPageParam: initialCursor,
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!user) {
    return <div>Please sign in to view the feed.</div>;
  }

  if (status === 'pending') return <CastSkeleton />;
  if (status === 'error') return <div>Error: {(error as Error).message}</div>;

  return (
    <>
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.casts.map((cast: Cast) => (
            <CastCard key={cast.hash} cast={cast} />
          ))}
        </React.Fragment>
      ))}
      <div ref={ref}>
        {isFetchingNextPage ? <CastSkeleton /> : null}
      </div>
    </>
  );
}
