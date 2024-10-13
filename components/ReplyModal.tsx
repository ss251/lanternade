import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Cast } from '@/types/neynar';
import CastCard from './CastCard';
import ReplyForm from './ReplyForm'

interface ReplyModalProps {
  cast: Cast;
  onClose: () => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ cast, onClose }) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Replies</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <CastCard cast={cast} />
        </div>
        <div className="mt-4">
          <ReplyForm parentCastHash={cast.hash} />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReplyModal;