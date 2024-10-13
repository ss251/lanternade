'use client'

import React, { useEffect, useState } from 'react';
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

interface CastCardProps {
  cast: Cast;
  showRecast?: boolean;
}

const CastCard: React.FC<CastCardProps> = ({ cast, showRecast = true }) => {
  const [recastedCast, setRecastedCast] = useState<Cast | null>(null);
  const [isLiked, setIsLiked] = useState(cast.viewer_context?.liked || false);
  const [isRecasted, setIsRecasted] = useState(cast.viewer_context?.recasted || false);
  const [likesCount, setLikesCount] = useState(cast.reactions.likes.length);
  const [recastsCount, setRecastsCount] = useState(cast.reactions.recasts.length);
  const { user } = useNeynarContext();
  const [showReplies, setShowReplies] = useState(false);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);

  const router = useRouter();

  const navigateToCastPage = () => {
    router.push(`/cast/${cast.hash}`);
  };

  const handleReaction = async (type: 'like' | 'recast') => {
    if (!user) return;

    const endpoint = '/api/farcaster/reaction';
    const method = isLiked ? 'DELETE' : 'POST';
    
    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: user.signer_uuid,
          reaction_type: type,
          target: cast.hash,
          target_author_fid: cast.author.fid,
        }),
      });

      if (!response.ok) throw new Error('Failed to update reaction');

      if (type === 'like') {
        setIsLiked(!isLiked);
        setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      } else {
        setIsRecasted(!isRecasted);
        setRecastsCount(prev => isRecasted ? prev - 1 : prev + 1);
      }
    } catch (error) {
      console.error(`Error updating ${type}:`, error);
    }
  };

  const handleLikeClick = () => handleReaction('like');
  const handleRecastClick = () => handleReaction('recast');

  const openReplyModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowReplies(true);
    setIsReplyModalOpen(true);
  };

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
            <Button variant="ghost" size="sm" onClick={handleLikeClick} className="flex items-center">
              <Heart size={16} className={`${isLiked ? 'fill-red-500' : ''} text-red-500`} />
              <span className="ml-1">{likesCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleRecastClick} className="flex items-center">
              <Repeat size={16} className={`${isRecasted ? 'fill-green-500' : ''}`} />
              <span className="ml-1">{recastsCount}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={openReplyModal} className="flex items-center">
              <MessageCircle size={16} />
              <span className="ml-1">{cast.replies.count}</span>
            </Button>
          </div>
          {showReplies && <RepliesSection parentHash={cast.hash} repliesCount={cast.replies.count}/>}
          {isReplyModalOpen && (
            <ReplyModal
              cast={cast}
              onClose={() => {
                setShowReplies(false);
                setIsReplyModalOpen(false);
              }}
            />
          )}
        </CardContent>
      </Card>
  );
};

export default CastCard;