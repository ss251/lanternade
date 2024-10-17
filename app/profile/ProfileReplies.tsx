import React from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Cast } from '@/types/neynar';
import CastCard from '@/components/CastCard';
import { Button } from '@/components/ui/button';
import RepliesSkeleton from '@/components/RepliesSkeleton';

interface ProfileRepliesProps {
  fid: number;
}

export function ProfileReplies({ fid }: ProfileRepliesProps) {
  const fetchReplies = async ({ pageParam = '' }) => {
    const response = await fetch(`/api/farcaster/user-replies?fid=${fid}&cursor=${pageParam}`);
    if (!response.ok) {
      throw new Error('Failed to fetch replies');
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
    queryKey: ['userReplies', fid],
    queryFn: fetchReplies,
    getNextPageParam: (lastPage) => lastPage.next?.cursor,
    initialPageParam: '',
  });

  if (status === 'pending') return <RepliesSkeleton />;
  if (status === 'error') return <div>Error fetching replies</div>;

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
          {isFetchingNextPage ? <RepliesSkeleton /> : 'Load More'}
        </Button>
      )}
    </div>
  );
}
