import React from 'react';
import { Embed } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import ImageGallery from './ImageGallery';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';

interface EmbedRendererProps {
  embeds: Embed[];
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({ embeds }) => {
  const imageEmbeds = embeds.filter(embed => embed.metadata?.image);
  const videoEmbed = embeds.find(embed => embed.metadata?.video);
  const linkEmbed = embeds.find(embed => embed.metadata?.html);

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
      {!linkEmbed?.cast_id && linkEmbed && linkEmbed.metadata?.html && (
        <div onClick={(e) => e.stopPropagation()}>
        <a href={linkEmbed.url} target="_blank" rel="noopener noreferrer" className="block">
          <div className="border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <div className="flex items-center">
              {linkEmbed.metadata.html.ogImage && linkEmbed.metadata.html.ogImage[0] && (
                <div className="flex-shrink-0 w-1/3">
                  <div className="relative w-full pt-[56.25%]">
                    <Image
                      src={linkEmbed.metadata.html.ogImage[0].url}
                      alt={linkEmbed.metadata.html.ogTitle || 'Link preview'}
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
                  {linkEmbed.metadata.html.ogSiteName || new URL(linkEmbed.url || '').hostname}
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 mb-1">
                  {linkEmbed.metadata.html.ogTitle}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {linkEmbed.metadata.html.ogDescription}
                </p>
              </div>
            </div>
          </div>
        </a>
        </div>
      )}
    </>
  );
};

export default EmbedRenderer;
