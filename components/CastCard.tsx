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

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
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
        {cast.embeds.map((embed: Embed, index: number) => (
          <div key={index} className="mb-3">
            <EmbedRenderer embed={embed} recastedCast={recastedCast ? <CastCard cast={recastedCast} handleLike={handleLike} handleRecast={handleRecast} handleReply={handleReply} /> : undefined} />
          </div>
        ))}
        <div className="flex justify-between text-sm text-gray-500">
          <Button variant="ghost" size="sm" onClick={() => handleLike(cast.hash)} className="flex items-center">
            <Heart size={18} className='text-red-500 hover:fill-red-500' />
            <span className="ml-1">{cast.reactions.likes_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleRecast(cast.hash)} className="flex items-center">
            <Repeat size={18} className='text-green-500 hover:text-green-500' />
            <span className="ml-1">{cast.reactions.recasts_count}</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleReply(cast.hash)} className="flex items-center">
            <MessageCircle size={18} />
            <span className="ml-1">{cast.replies.count}</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CastCard;
