"use client";

import React, { useEffect, useState } from 'react';
import { useNeynarContext } from "@neynar/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Heart, Repeat, MessageCircle } from 'lucide-react';
import ReactPlayer from 'react-player';
import { Cast, Embed } from '@/types/neynar';
import { Skeleton } from "@/components/ui/skeleton";

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
  
    const fetchFeed = async (cursorParam?: string) => {
      if (loading || !user) return;
      setLoading(true);
      setError(null);
  
      try {
        const url = `/api/farcaster/feed?fid=${user.fid}${cursorParam ? `&cursor=${cursorParam}` : ''}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch feed');
        const data = await response.json();
  
        const filteredCasts = data.casts.filter((cast: Cast) => 
          cast.embeds.some(embed => embed.metadata && (embed.metadata.image || embed.metadata.video))
        );
  
        setFeed(prevFeed => cursorParam ? [...prevFeed, ...filteredCasts] : filteredCasts);
        setCursor(data.next?.cursor);
      } catch (err) {
        setError('Error fetching feed. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
  
    const handleLoadMore = () => {
      if (cursor) {
        fetchFeed(cursor);
      }
    };
  
    const handleLike = async (hash: string) => {
      // Implement like functionality
      console.log('Like', hash);
    };
  
    const handleRecast = async (hash: string) => {
      // Implement recast functionality
      console.log('Recast', hash);
    };
  
    const handleReply = async (hash: string) => {
      // Implement reply functionality
      console.log('Reply', hash);
    };
  
    const renderEmbed = (embed: Embed) => {
      if (embed.metadata?.image) {
        return (
          <Image
            src={embed.url || ''}
            alt="Embedded image"
            width={embed.metadata.image.width_px || 500}
            height={embed.metadata.image.height_px || 300}
            layout="responsive"
            objectFit="contain"
          />
        );
      } else if (embed.metadata?.video) {
        return (
          <ReactPlayer
            url={embed.url}
            controls
            width="100%"
            height="auto"
          />
        );
      }
      return null;
    };
  
    const renderSkeleton = () => (
      <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex items-center mb-3">
            <Skeleton className="w-10 h-10 rounded-full mr-3" />
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-3 w-16" />
            </div>
          </div>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4 mb-3" />
          <Skeleton className="h-48 w-full mb-3" />
          <div className="flex justify-between">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    );

    return (
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-3xl font-bold mb-6 text-center">Feed</h1>
          <div className="space-y-6">
            {loading && !feed.length ? (
              // Show skeletons when initially loading
              Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>{renderSkeleton()}</div>
              ))
            ) : (
              // Existing feed rendering logic
              feed.map((cast) => (
                <Card key={cast.hash} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <Image
                        src={cast.author.pfp_url}
                        alt={cast.author.display_name}
                        width={40}
                        height={40}
                        className="rounded-full mr-3"
                      />
                      <div>
                        <p className="font-semibold text-sm">{cast.author.display_name}</p>
                        <p className="text-gray-500 text-xs">@{cast.author.username}</p>
                      </div>
                      <p className="ml-auto text-xs text-gray-400">
                        {new Date(cast.timestamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    <p className="text-sm mb-3">{cast.text}</p>
                    {cast.embeds.map((embed, index) => (
                      <div key={index} className="mb-3">
                        {renderEmbed(embed)}
                      </div>
                    ))}
                    <div className="flex justify-between text-sm text-gray-500">
                      <Button variant="ghost" size="sm" onClick={() => handleLike(cast.hash)} className="flex items-center hover:text-red-500">
                        <Heart size={18} className={cast.viewer_context.liked ? 'fill-red-500 text-red-500' : ''} />
                        <span className="ml-1">{cast.reactions.likes_count}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleRecast(cast.hash)} className="flex items-center hover:text-green-500">
                        <Repeat size={18} className={cast.viewer_context.recasted ? 'text-green-500' : ''} />
                        <span className="ml-1">{cast.reactions.recasts_count}</span>
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleReply(cast.hash)} className="flex items-center hover:text-blue-500">
                        <MessageCircle size={18} />
                        <span className="ml-1">{cast.replies.count}</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
            {error && <div className="text-red-500 text-center">{error}</div>}
            {cursor && (
              <Button onClick={handleLoadMore} disabled={loading} className="w-full text-foreground bg-primary text-white">
                {loading ? 'Loading...' : 'Load More'}
              </Button>
            )}
            {loading && feed.length > 0 && (
              // Show a single skeleton when loading more
              <div>{renderSkeleton()}</div>
            )}
          </div>
        </div>
      );
    }
