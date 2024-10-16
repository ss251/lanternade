import React, { useState } from 'react';
import { Cast, Embed, Frame } from '@/types/neynar';
import { PlayerWithControls } from '@/components/PlayerWithControls';
import { getSrc } from '@livepeer/react/external';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageGallery from './ImageGallery';
import { useNeynarContext } from "@neynar/react";

interface EmbedRendererProps {
  embeds?: Embed[];
  frames?: Frame[];
  cast_hash?: string;
  cast?: Cast;
}

const EmbedRenderer: React.FC<EmbedRendererProps> = ({ embeds = [], frames = [], cast, cast_hash }) => {
  const [currentFrame, setCurrentFrame] = useState<Frame | null>(frames[0] || null);
  const { user } = useNeynarContext();
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
    </div>
  );

  const handleFrameAction = async (button: { index: number; title: string; action_type: string; target: string }) => {
    if (!currentFrame || !cast || !user) return;
  
    setIsLoading(true);

    if (button.action_type === 'link') {
      window.open(button.target, '_blank');
      setIsLoading(false);
      return;
    }
  
    try {
      const response = await fetch('/api/frame-action', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: user.signer_uuid, // Make sure this is available from your user context
          cast_hash: cast_hash,
          action: {
            button: {
              index: button.index,
              title: button.title,
              action_type: button.action_type,
              target: button.target
            },
            frames_url: currentFrame.frames_url,
            post_url: currentFrame.post_url || button.target,
            input: {
              text: inputValue
            },
            state: currentFrame.state
          }
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
  
      if (button.action_type === 'link' || button.action_type === 'post_redirect') {
        window.open(data.url || button.target, '_blank');
        setIsLoading(false);
        return;
      } else if (button.action_type === 'post') {
        // Update the current frame with the new data
        setCurrentFrame({
          version: data.version,
          title: data.title || currentFrame.title,
          image: data.image,
          image_aspect_ratio: data.image_aspect_ratio,
          buttons: data.buttons,
          input: data.input,
          state: data.state,
          frames_url: data.frames_url,
          post_url: data.post_url || button.target
        });
      }
  
      setInputValue(''); // Clear input after action
    } catch (error) {
      console.error('Error handling frame action:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
        {frame.input && frame.input.text && (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={frame.input.text}
            className="w-full p-2 mb-2 border border-gray-300 dark:border-gray-600 rounded"
          />
        )}
        <div className="flex flex-wrap gap-2">
          {frame.buttons.map((button) => (
            <Button
              key={button.index}
              onClick={() => handleFrameAction(button)}
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
      {isLoading && <LoadingOverlay />}
      {images.length > 0 && <ImageGallery images={images} />}
      {videoEmbed && videoEmbed.url && (
        <PlayerWithControls src={getSrc(videoEmbed.url) || []} />
      )}
      {linkEmbed && frames.length === 0 && renderLinkPreview(linkEmbed)}
      {currentFrame && renderFrame(currentFrame)}
    </>
  );
};

export default EmbedRenderer;
