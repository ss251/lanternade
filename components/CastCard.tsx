import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Heart, Repeat, MessageCircle } from 'lucide-react';
import { Cast, Embed } from '@/types/neynar';
import EmbedRenderer from './EmbedRenderer';

interface CastCardProps {
  cast: Cast;
  handleLike: (hash: string) => void;
  handleRecast: (hash: string) => void;
  handleReply: (hash: string) => void;
}

const CastCard: React.FC<CastCardProps> = ({ cast, handleLike, handleRecast, handleReply }) => {
  const [recastedCast, setRecastedCast] = useState<Cast | null>(null);

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

  const renderCastContent = (contentCast: Cast, isRecast: boolean = false) => (
    <div className={`${isRecast ? "dark:bg-secondary/50 bg-secondary/10 rounded-lg p-3 mt-3" : ""}`}>
      <div className="flex items-center mb-2">
        <Image
          src={contentCast.author.pfp_url}
          alt={contentCast.author.display_name}
          width={32}
          height={32}
          className="rounded-full mr-2"
        />
        <div>
          <p className="font-semibold text-sm">{contentCast.author.display_name}</p>
          <p className="text-muted-foreground text-xs">@{contentCast.author.username}</p>
        </div>
        <p className="ml-auto text-xs text-muted-foreground">
          {new Date(contentCast.timestamp).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })}
        </p>
      </div>
      <p className="text-sm mb-2">{contentCast.text}</p>
      {contentCast.embeds.map((embed: Embed, index: number) => (
        <div key={index} className="mb-2">
          <EmbedRenderer embed={embed} />
        </div>
      ))}
    </div>
  );

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardContent className="p-4">
        {recastedCast && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <Repeat className="mr-1" size={14} />
            {cast.author.display_name} recasted
          </div>
        )}
        {renderCastContent(recastedCast || cast)}
        {recastedCast && renderCastContent(cast, true)}
        <div className="flex justify-between text-sm text-muted-foreground mt-3">
          <Button variant="ghost" size="sm" onClick={() => handleLike(cast.hash)} className="flex items-center">
            <Heart size={16} className={`${cast.viewer_context.liked ? 'fill-red-500' : ''} text-red-500`} />
            <span className="ml-1">{cast.reactions.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleRecast(cast.hash)} className="flex items-center">
            <Repeat size={16} className={`${cast.viewer_context.recasted ? 'fill-green-500' : ''} text-green-500`} />
            <span className="ml-1">{cast.reactions.recasts_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleReply(cast.hash)} className="flex items-center">
            <MessageCircle size={16} />
            <span className="ml-1">{cast.replies.count}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CastCard;
