"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useNeynarContext } from "@neynar/react";
import { Cast } from '@/types/neynar';
import CastCard from '@/components/CastCard';
import CastSkeleton from '@/components/CastSkeleton';

export default function Feed() {
  const [feed, setFeed] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursor, setCursor] = useState<string | null>(null);

  const { user } = useNeynarContext();

  useEffect(() => {
    if (user) {
      fetchFeed();
    }
  }, [user]);

  const POSTS_PER_LOAD = 5;

  const fetchFeed = async (cursorParam?: string) => {
    if (loading || !user) return;
    setLoading(true);
    setError(null);
  
    try {
      const url = `/api/farcaster/feed?fid=${user.fid}&limit=${POSTS_PER_LOAD}${cursorParam ? `&cursor=${cursorParam}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch feed');
      const data = await response.json();
    
      setFeed(prevFeed => cursorParam ? [...prevFeed, ...data.casts] : data.casts);
      setCursor(data.next?.cursor);
    } catch (err) {
      setError('Error fetching feed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (hash: string) => {
    console.log('Like', hash);
  };

  const handleRecast = async (hash: string) => {
    console.log('Recast', hash);
  };

  const handleReply = async (hash: string) => {
    console.log('Reply', hash);
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastCastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && cursor) {
            fetchFeed(cursor);
        }
    });
    if (node) observer.current.observe(node);
  }, [loading, cursor]);

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>
      <div className="space-y-6">
        {loading && !feed.length ? (
          Array.from({ length: 3 }).map((_, index) => (
            <CastSkeleton key={index} />
          ))
        ) : (
          feed.map((cast, index) => (
            <div 
              key={`${cast.hash}-${index}`} 
              ref={index === feed.length - 1 ? lastCastElementRef : null}
            >
              <CastCard
                cast={cast}
                handleLike={handleLike}
                handleRecast={handleRecast}
                handleReply={handleReply}
              />
            </div>
          ))
        )}
        {error && <div className="text-red-500 text-center">{error}</div>}
        {loading && feed.length > 0 && (
          <CastSkeleton />
        )}
      </div>
    </div>
  );
}
