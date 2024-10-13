import React from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useNeynarContext } from '@neynar/react';

interface ReplyFormProps {
  parentCastHash: string;
}

const ReplyForm: React.FC<ReplyFormProps> = ({ parentCastHash }) => {
  console.log(parentCastHash);
  const { user } = useNeynarContext();
  console.log(user);
  return (
    <div>
      <Textarea placeholder="Write your reply..." className="mb-2" />
      <Button>Post Reply</Button>
    </div>
  );
};

export default ReplyForm;