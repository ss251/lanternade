"use client";

import React, { useEffect, useRef, useCallback } from 'react';
import { useNeynarContext } from "@neynar/react";
import { Cast } from '@/types/neynar';
import CastCard from '@/components/CastCard';
import CastSkeleton from '@/components/CastSkeleton';
import { useFeed } from '@/contexts/FeedContext';

export default function Feed() {
  const { feedState, setFeedState } = useFeed();
  const { user } = useNeynarContext();

  useEffect(() => {
    if (user && feedState.items.length === 0) {
      fetchFeed();
    }
  }, [user, feedState.items.length]);

  const POSTS_PER_LOAD = 5;

  const fetchFeed = async (cursorParam?: string) => {
    if (feedState.loading || !user) return;
    setFeedState(prev => ({ ...prev, loading: true, error: null }));
  
    try {
      const url = `/api/farcaster/feed?fid=${user.fid}&limit=${POSTS_PER_LOAD}${cursorParam ? `&cursor=${cursorParam}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
    
      setFeedState(prev => ({
        items: cursorParam ? [...prev.items, ...data.casts] : data.casts,
        cursor: data.next?.cursor,
        loading: false,
        error: null
      }));
    } catch (err) {
      setFeedState(prev => ({
        ...prev,
        loading: false,
        error: 'Error fetching feed. Please try again.'
      }));
      console.error(err);
    }
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (feedState.loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && feedState.cursor) {
            fetchFeed(feedState.cursor);
        }
    });
    if (node) observer.current.observe(node);
  }, [feedState.loading, feedState.cursor]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="space-y-6 mt-20">
        {feedState.loading && !feedState.items.length ? (
          Array.from({ length: 3 }).map((_, index) => (
            <CastSkeleton key={index} />
          ))
        ) : (
          feedState.items.map((cast: Cast, index: number) => (
            <div 
              key={`${cast.hash}-${index}`} 
              ref={index === feedState.items.length - 1 ? lastCastElementRef : null}
            >
              <CastCard cast={cast} />
            </div>
          ))
        )}
        {feedState.error && <div className="text-red-500 text-center">{feedState.error}</div>}
        {feedState.loading && feedState.items.length > 0 && (
          <CastSkeleton />
        )}
      </div>
    </div>
  );
}
