import React from 'react';
import Image from "next/image";
import { Embed } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import CastSkeleton from './CastSkeleton';

interface EmbedRendererProps {
  embed: Embed;
  recastedCast?: React.ReactNode;
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({ embed, recastedCast }) => {
   if (embed.metadata?.image) {
    return (
      <Image
        src={embed.url || ''}
        alt="Embedded image"
        width={embed.metadata.image.width_px || 500}
        height={embed.metadata.image.height_px || 300}
        layout="responsive"
        objectFit="contain"
      />
    );
  } else if (embed.metadata?.video) {
    return (
      <PlayerWithControls
        src={getSrc(embed.url) || []} 
      />
    );
  } else if(embed.cast_id) {
    return recastedCast || <CastSkeleton />;
  }
  return null;
};

export default EmbedRenderer;
