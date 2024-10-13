import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Cast } from '@/types/neynar';
import CastCard from './CastCard';
import ReplyForm from './ReplyForm'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ReplyModalProps {
  cast: Cast;
  onClose: () => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ cast, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-[750px] max-h-[90vh]">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Replies</DialogTitle>
        </DialogHeader>
        </VisuallyHidden>
        <div className="mt-4">
          <CastCard cast={cast} showRecast={false}/>
        </div>
        <div className="mt-4">
          <ReplyForm parentCastHash={cast.hash} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;