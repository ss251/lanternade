import React from 'react';
import { Embed } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import ImageGallery from './ImageGallery';

interface EmbedRendererProps {
  embeds: Embed[];
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({ embeds }) => {
  const imageEmbeds = embeds.filter(embed => embed.metadata?.image);
  const videoEmbed = embeds.find(embed => embed.metadata?.video);

  const images = imageEmbeds.map(embed => ({
    url: embed.url || '',
    width: embed.metadata?.image?.width_px || 0,
    height: embed.metadata?.image?.height_px || 0,
  }));

  return (
    <>
      {images.length > 0 && <ImageGallery images={images} />}
      {videoEmbed && videoEmbed.metadata?.video && (
        <PlayerWithControls
          src={getSrc(videoEmbed.url) || []} 
        />
      )}
    </>
  );
};

export default EmbedRenderer;
