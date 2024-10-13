import React, { useState, useEffect } from 'react';
import { Cast } from '@/types/neynar';
import CastCard from './CastCard';
import { Button } from './ui/button';
import CommentSkeleton from './CommentSkeleton';

interface CommentSectionProps {
  parentHash: string;
  repliesCount: number;
}

const CommentSection: React.FC<CommentSectionProps> = ({ parentHash, repliesCount }) => {
  const [comments, setComments] = useState<Cast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/farcaster/comments?hash=${parentHash}&reply_depth=${repliesCount}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setComments(data.conversation.cast.direct_replies || []);
      } catch (err) {
        console.error('Error fetching comments:', err);
        setError('Failed to load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [parentHash, repliesCount]);

  const skeletonCount = Math.min(repliesCount, 5);

  if (loading) {
    return (
      <div className="mt-4 space-y-4">
        {[...Array(skeletonCount)].map((_, index) => (
          <CommentSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4 text-center">
        <p className="text-red-500 mb-2">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="mt-4 text-center">
        <p className="text-muted-foreground mb-2">No comments yet.</p>
        <Button variant="outline">Add a comment</Button>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-4">
      {comments.map((comment) => (
        <CastCard
          key={comment.hash}
          cast={comment}
        />
      ))}
    </div>
  );
};

export default CommentSection;
