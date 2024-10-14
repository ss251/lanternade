'use client'

import React, { useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Repeat, MessageCircle } from 'lucide-react';
import { Cast } from '@/types/neynar';
import EmbedRenderer from './EmbedRenderer';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNeynarContext } from '@neynar/react';
import ReplyModal from './ReplyModal';
import { useRouter } from 'next/navigation';
import RepliesSection from './RepliesSection';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface CastCardProps {
  cast: Cast;
  showRecast?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ cast, showRecast = true }) => {
  const { user } = useNeynarContext();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [showReplies, setShowReplies] = React.useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = React.useState(false);

  const navigateToCastPage = (e: React.MouseEvent) => {
    // Only navigate if the click didn't originate from the reply modal
    if (!(e.target as HTMLElement).closest('.reply-modal')) {
      router.push(`/cast/${cast.hash}`);
    }
  };

  const reactionMutation = useMutation({
    mutationFn: async ({ type, action }: { type: 'like' | 'recast', action: 'add' | 'remove' }) => {
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
      return { type, action };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cast', cast.hash], (oldData: Cast | undefined) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          reactions: {
            ...oldData.reactions,
            [data.type === 'like' ? 'likes' : 'recasts']: 
              data.action === 'add' 
                ? [...oldData.reactions[data.type === 'like' ? 'likes' : 'recasts'], { fid: user?.fid }]
                : oldData.reactions[data.type === 'like' ? 'likes' : 'recasts'].filter(r => r.fid !== user?.fid),
          },
          viewer_context: {
            ...oldData.viewer_context,
            [data.type === 'like' ? 'liked' : 'recasted']: data.action === 'add',
          },
        };
      });
    },
  });

  const handleReaction = (e: React.MouseEvent, type: 'like' | 'recast') => {
    e.stopPropagation(); // Prevent the event from bubbling up
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

  const [recastedCast, setRecastedCast] = React.useState<Cast | null>(null);

  useEffect(() => {
    const fetchRecastedCast = async () => {
      const recastEmbed = cast.embeds.find(embed => embed.cast_id);
      if (recastEmbed && recastEmbed.cast_id) {
        try {
          const response = await fetch(`/api/farcaster/cast?identifier=${recastEmbed.cast_id.hash}&type=hash`);
          if (!response.ok) throw new Error('Failed to fetch recasted cast');
          const data = await response.json();
          setRecastedCast(data.cast);
        } catch (err) {
          console.error('Error fetching recasted cast:', err);
        }
      }
    };

    fetchRecastedCast();
  }, [cast]);

  const renderCastContent = (contentCast: Cast, isRecast: boolean = false, showRecast: boolean = true) => (
    <div className={`${isRecast && showRecast ? "dark:bg-secondary/50 bg-secondary/10 rounded-lg p-3 mt-3" : ""}`}>
      <div className="flex items-center mb-2">
        {/* <Image
          src={contentCast.author.pfp_url}
          alt={contentCast.author.display_name}
          width={32}
          height={32}
          className="rounded-full mr-2"
          style={{objectFit: 'cover'}}
        /> */}
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
      <p className="text-sm mb-2">{contentCast.text}</p>
      {contentCast.embeds.length > 0 && (
        <div className="mb-2">
          <EmbedRenderer embeds={contentCast.embeds} />
        </div>
      )}
    </div>
  );

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={navigateToCastPage}>
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
            <span className="ml-1">{cast.reactions.likes.length}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={(e) => handleReaction(e, 'recast')} className="flex items-center">
            <Repeat size={16} className={`${cast.viewer_context?.recasted ? 'fill-green-500' : ''}`} />
            <span className="ml-1">{cast.reactions.recasts.length}</span>
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
