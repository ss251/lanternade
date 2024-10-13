'use client'

import React, { useState, useEffect } from 'react';
import { Cast } from '@/types/neynar';
import CastCard from './CastCard';
import { Button } from './ui/button';
import RepliesSkeleton from './RepliesSkeleton';
import ReplyForm from './ReplyForm';

interface RepliesSectionProps {
  parentHash: string;
  repliesCount: number;
}

const RepliesSection: React.FC<RepliesSectionProps> = ({ parentHash, repliesCount }) => {
  const [replies, setReplies] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReplies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/farcaster/replies?hash=${parentHash}&reply_depth=${repliesCount}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setReplies(data.conversation.cast.direct_replies || []);
      } catch (err) {
        console.error('Error fetching replies:', err);
        setError('Failed to load replies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReplies();
  }, [parentHash, repliesCount]);

  const skeletonCount = Math.min(repliesCount, 5);

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        {[...Array(skeletonCount)].map((_, index) => (
          <RepliesSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReplyForm parentCastHash={parentHash} />
      {replies.length === 0 ? (
        <p className="text-center text-gray-500">No replies yet. Be the first to reply!</p>
      ) : (
        replies.map((reply) => (
          <CastCard key={reply.hash} cast={reply} />
        ))
      )}
    </div>
  );
};

export default RepliesSection;
