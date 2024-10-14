import React from 'react';
import { Embed, Frame } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGallery from './ImageGallery';

interface EmbedRendererProps {
  embeds?: Embed[];
  frames?: Frame[];
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({ embeds = [], frames = [] }) => {
  const imageEmbeds = embeds.filter(embed => embed.metadata?.image);
  const videoEmbed = embeds.find(embed => embed.metadata?.video);
  const linkEmbed = embeds.find(embed => embed.metadata?.html);

  const images = imageEmbeds.map(embed => ({
    url: embed.url || '',
    width: embed.metadata?.image?.width_px || 0,
    height: embed.metadata?.image?.height_px || 0,
  }));

  const renderLinkPreview = (embed: Embed) => (
    <div onClick={(e) => e.stopPropagation()}>
    <a href={embed.url} target="_blank" rel="noopener noreferrer" className="block">
      <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <div className="flex items-center">
          {embed.metadata?.html?.ogImage && embed.metadata.html.ogImage[0] && (
            <div className="flex-shrink-0 w-1/3">
              <div className="relative w-full pt-[56.25%]">
                <Image
                  src={embed.metadata.html.ogImage[0].url}
                  alt={embed.metadata.html.ogTitle || 'Link preview'}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <div className="flex-grow p-4">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-1">
              <ExternalLink size={14} className="mr-1" />
              {embed.metadata?.html?.ogSiteName || new URL(embed.url).hostname}
            </div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
              {embed.metadata?.html?.ogTitle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {embed.metadata?.html?.ogDescription}
            </p>
          </div>
        </div>
      </div>
    </a>
    </div>
  );

  const renderFrame = (frame: Frame) => (
    <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
      <Image
        src={frame.image}
        alt={frame.title}
        width={500}
        height={frame.image_aspect_ratio === '1:1' ? 500 : 300}
        className="w-full h-auto"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{frame.title}</h3>
        <div className="flex flex-wrap gap-2">
          {frame.buttons.map((button) => (
            <Button
              key={button.index}
              onClick={() => window.open(button.target, '_blank')}
            >
              {button.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {images.length > 0 && <ImageGallery images={images} />}
      {videoEmbed && videoEmbed.url && (
        <PlayerWithControls src={getSrc(videoEmbed.url) || []} />
      )}
      {!frames && !linkEmbed?.cast_id && linkEmbed && renderLinkPreview(linkEmbed)}
      {frames.map((frame, index) => (
        <React.Fragment key={index}>
          {renderFrame(frame)}
        </React.Fragment>
      ))}
    </>
  );
};

export default EmbedRenderer;
