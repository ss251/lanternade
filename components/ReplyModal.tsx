import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Cast } from '@/types/neynar';
import CastCard from './CastCard';
import ReplyForm from './ReplyForm'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ReplyModalProps {
  cast: Cast;
  onClose: (e: React.MouseEvent<Element, MouseEvent>) => void;
}

const ReplyModal: React.FC<ReplyModalProps> = ({ cast, onClose }) => {
  const handleClose = () => {
    onClose(new MouseEvent('click') as unknown as React.MouseEvent<Element, MouseEvent>);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-[750px] max-h-[80vh]">
        <VisuallyHidden>
          <DialogHeader>
            <DialogTitle>Replies</DialogTitle>
          </DialogHeader>
        </VisuallyHidden>
        <div className="mt-4 max-h-[50vh] overflow-y-auto">
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
