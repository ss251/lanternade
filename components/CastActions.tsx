'use client';

import React from 'react';
import { Button } from "@/components/ui/button";
import { Heart, Repeat, MessageCircle } from 'lucide-react';
import { Cast } from '@/types/neynar';

interface CastActionsProps {
  cast: Cast;
  handleLike: (e: React.MouseEvent) => void;
  handleRecast: (e: React.MouseEvent) => void;
  handleReply: (e: React.MouseEvent) => void;
}

const CastActions: React.FC<CastActionsProps> = ({ cast, handleLike, handleRecast, handleReply }) => {
  return (
    <div className="flex justify-between text-sm text-muted-foreground mt-3">
      <Button variant="ghost" size="sm" onClick={handleLike} className="flex items-center">
        <Heart size={16} className={`${cast.viewer_context?.liked ? 'fill-red-500' : ''} text-red-500`} />
        <span className="ml-1">{cast.reactions.likes.length}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleRecast} className="flex items-center">
        <Repeat size={16} className={`${cast.viewer_context?.recasted ? 'fill-green-500' : ''}`} />
        <span className="ml-1">{cast.reactions.recasts.length}</span>
      </Button>
      <Button variant="ghost" size="sm" onClick={handleReply} className="flex items-center">
        <MessageCircle size={16} />
        <span className="ml-1">{cast.replies.count}</span>
      </Button>
    </div>
  );
};

export default CastActions;
