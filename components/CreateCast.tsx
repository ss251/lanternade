import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { VideoUploader } from "@/components/VideoUploader";
import { useNeynarContext } from "@neynar/react";
import { toast } from '@/hooks/use-toast';

export function CreateCast() {
  const [castText, setCastText] = useState('');
  const [videoIpfsUrl, setVideoIpfsUrl] = useState<string | null>(null);
  const [videoPlaybackId, setVideoPlaybackId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useNeynarContext();

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCastText(e.target.value);
  };

  const handleVideoSelect = (file: File | null, ipfsUrl: string | null, playbackId: string | null) => {
    setVideoIpfsUrl(ipfsUrl);
    setVideoPlaybackId(playbackId);
  };

  const handleCast = async () => {
    if (!user?.fid) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
      });
      return;
    }

    setIsLoading(true);

    const embeds = [];
    if (videoIpfsUrl && videoPlaybackId) {
      embeds.push({
        url: videoIpfsUrl,
      });
    }

    try {
      const response = await fetch('/api/farcaster/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: user.signer_uuid,
          text: castText,
          embeds: embeds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create cast');
      }

      const result = await response.json();
      console.log('Farcaster post result:', result);
      toast({
        title: 'Cast created successfully',
        description: 'Your cast has been created',
      });

      // Reset form after successful cast
      setCastText('');
      setVideoIpfsUrl(null);
      setVideoPlaybackId(null);
    } catch (error) {
      console.error('Error creating cast:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create cast',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="What's on your mind?"
        value={castText}
        onChange={handleTextChange}
      />
      <VideoUploader onVideoSelect={handleVideoSelect} />
      <Button onClick={handleCast} disabled={isLoading || !castText.trim()}>
        {isLoading ? 'Casting...' : 'Cast'}
      </Button>
    </div>
  );
}
