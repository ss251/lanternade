'use client'

import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Repeat, MessageCircle } from 'lucide-react';
import { Cast, Reaction, ReactionResponse } from '@/types/neynar';
import EmbedRenderer from './EmbedRenderer';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNeynarContext } from '@neynar/react';
import ReplyModal from './ReplyModal';
import { useRouter } from 'next/navigation';
import RepliesSection from './RepliesSection';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { fetchRecastedCast } from '@/lib/api';

interface CastCardProps {
  cast: Cast;
  showRecast?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ cast: initialCast, showRecast = true }) => {
  const [cast, setCast] = useState(initialCast);
  const { user } = useNeynarContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showReplies, setShowReplies] = React.useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);

  const recastEmbed = cast.embeds.find(embed => embed.cast_id);
  const recastHash = recastEmbed?.cast_id?.hash;

  const { data: recastedCast } = useQuery({
    queryKey: ['recastedCast', recastHash],
    queryFn: () => fetchRecastedCast(recastHash!),
    enabled: !!recastHash && showRecast,
  });

  const navigateToCastPage = (hash: string) => {
    router.push(`/cast/${hash}`);
  };

  const reactionMutation = useMutation<ReactionResponse, Error, { type: 'like' | 'recast', action: 'add' | 'remove' }>({
    mutationFn: async ({ type, action }) => {
      if (!user) throw new Error('User not authenticated');
      const endpoint = '/api/farcaster/reaction';
      const method = action === 'add' ? 'POST' : 'DELETE';
      
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signer_uuid: user.signer_uuid,
          reaction_type: type,
          target: cast.hash,
          target_author_fid: cast.author.fid,
        }),
      });

      if (!response.ok) throw new Error('Failed to update reaction');
      return response.json();
    },
    onSuccess: (data, variables) => {
      setCast(prevCast => {
        const newReactions = { ...prevCast.reactions };
        const reactionType = variables.type === 'like' ? 'likes' : 'recasts';
        
        if (variables.action === 'add') {
          const newReaction: Reaction = {
            fid: user?.fid ?? 0,
            fname: user?.username ?? '',
            display_name: user?.display_name ?? '',
            pfp_url: user?.pfp_url ?? '',
          };
          newReactions[reactionType] = [...newReactions[reactionType], newReaction];
          newReactions[`${reactionType}_count`] += 1;
        } else {
          newReactions[reactionType] = newReactions[reactionType].filter(r => r.fid !== user?.fid);
          newReactions[`${reactionType}_count`] -= 1;
        }

        return {
          ...prevCast,
          reactions: newReactions,
          viewer_context: {
            ...prevCast.viewer_context,
            [variables.type === 'like' ? 'liked' : 'recasted']: variables.action === 'add',
          },
        };
      });

      // Update the query cache
      queryClient.setQueryData(['cast', cast.hash], (oldData: Cast | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          reactions: cast.reactions,
          viewer_context: cast.viewer_context,
        };
      });
    },
  });

  const handleReaction = (e: React.MouseEvent, type: 'like' | 'recast') => {
    e.stopPropagation();
    if (!user) return;
    const isActive = type === 'like' ? cast.viewer_context?.liked : cast.viewer_context?.recasted;
    reactionMutation.mutate({ type, action: isActive ? 'remove' : 'add' });
  };

  const openReplyModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setIsReplyModalOpen(true);
  };

  const closeReplyModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(false);
    setIsReplyModalOpen(false);
  };

  const renderCastContent = (contentCast: Cast, isRecast: boolean = false, showRecast: boolean = true) => (
    <div className={`${isRecast && showRecast ? "dark:bg-secondary/50 bg-secondary/10 rounded-lg p-3 mt-3" : ""}`}>
      <div className="flex items-center mb-2">
        <Avatar className="mr-2">
          <div className="w-full h-full rounded-full overflow-hidden">
            <AvatarImage 
              src={contentCast.author.pfp_url} 
              alt={contentCast.author.display_name}
              className="w-full h-full object-cover"
            />
          </div>
          <AvatarFallback>
            {contentCast.author.display_name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <Link
            href={`https://warpcast.com/${contentCast.author.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            <p className="font-semibold text-sm">{contentCast.author.display_name}</p>
            <p className="text-muted-foreground text-xs">@{contentCast.author.username}</p>
          </Link>
        </div>
        <div className="ml-auto flex items-center">
          <p className="text-xs text-muted-foreground mr-2">
            {new Date(contentCast.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
          </p>
        </div>
      </div>
      <div 
        className="cursor-pointer"
        onClick={() => navigateToCastPage(contentCast.hash)}
      >
        <p className="text-sm mb-2">{contentCast.text}</p>
        {contentCast.embeds.length > 0 && (
          <div className="mb-2">
            <EmbedRenderer embeds={contentCast.embeds} frames={contentCast.frames} cast_hash={isRecast ? recastHash : cast.hash} cast={contentCast} />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        {recastedCast && showRecast ? (
          <>
            <div className="flex items-center text-sm text-muted-foreground mb-3">
              <Repeat className="mr-1" size={14} />
              {cast.author.display_name} recasted
            </div>
            {renderCastContent(cast)}
            {renderCastContent(recastedCast, true, showRecast)}
          </>
        ) : (
          renderCastContent(cast)
        )}
        <div className="flex justify-between text-sm text-muted-foreground mt-3">
          <Button variant="ghost" size="sm" onClick={(e) => handleReaction(e, 'like')} className="flex items-center">
            <Heart size={16} className={`${cast.viewer_context?.liked ? 'fill-red-500' : ''} text-red-500`} />
            <span className="ml-1">{cast.reactions.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => handleReaction(e, 'recast')} className="flex items-center">
            <Repeat size={16} className={`${cast.viewer_context?.recasted ? 'fill-green-500' : ''}`} />
            <span className="ml-1">{cast.reactions.recasts_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={openReplyModal} className="flex items-center">
            <MessageCircle size={16} />
            <span className="ml-1">{cast.replies.count}</span>
          </Button>
        </div>
        {showReplies && <RepliesSection parentHash={cast.hash} repliesCount={cast.replies.count}/>}
        {isReplyModalOpen && (
          <div className="reply-modal" onClick={(e) => e.stopPropagation()}>
            <ReplyModal
              cast={cast}
              onClose={closeReplyModal}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CastCard;
