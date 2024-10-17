import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Cast } from '@/types/neynar';
import CastCard from '@/components/CastCard';
import { Button } from '@/components/ui/button';
import CastSkeleton from '@/components/CastSkeleton';

interface ProfileCastsProps {
  fid: number;
}

export function ProfileCasts({ fid }: ProfileCastsProps) {
  const fetchCasts = async ({ pageParam = '' }) => {
    const response = await fetch(`/api/farcaster/user-casts?fid=${fid}&cursor=${pageParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch casts');
    }
    return response.json();
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['userCasts', fid],
    queryFn: fetchCasts,
    getNextPageParam: (lastPage) => lastPage.next?.cursor,
    initialPageParam: '',
  });

  if (status === 'pending') return <CastSkeleton count={5} />;
  if (status === 'error') return <div>Error fetching casts</div>;

  return (
    <div className="space-y-4">
      {data?.pages.map((page, i) => (
        <React.Fragment key={i}>
          {page.casts.map((cast: Cast) => (
            <CastCard key={cast.hash} cast={cast} />
          ))}
        </React.Fragment>
      ))}
      {hasNextPage && (
        <Button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? <CastSkeleton count={1} /> : 'Load More'}
        </Button>
      )}
    </div>
  );
}
