'use client';

import { Cast } from '@/types/neynar';
import { useState } from 'react';

export default function CastActions({ cast }: { cast: Cast }) {
  const [likes, setLikes] = useState(cast.reactions.likes.length);
  const [recasts, setRecasts] = useState(cast.reactions.recasts.length);

  const handleLike = async () => {
    // Implement like functionality
    setLikes(likes + 1);
  };

  const handleRecast = async () => {
    // Implement recast functionality
    setRecasts(recasts + 1);
  };

  return (
    <div className="flex justify-between text-sm text-gray-500">
      <button onClick={handleLike}>Like ({likes})</button>
      <button onClick={handleRecast}>Recast ({recasts})</button>
      <button>Reply</button>
    </div>
  );
}
