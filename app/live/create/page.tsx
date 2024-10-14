'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Livestream } from '@/types/livepeer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Share2, Twitter, Send, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function CreateLivestream() {
  const [streamName, setStreamName] = useState('');
  const [streamData, setStreamData] = useState<Livestream | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const savedStreamData = localStorage.getItem('streamData');
    if (savedStreamData) {
      setStreamData(JSON.parse(savedStreamData));
    }
  }, []);

  const handleCreateStream = async () => {
    try {
      const response = await fetch('/api/livestream/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: streamName }),
      });

      if (!response.ok) {
        throw new Error('Failed to create livestream');
      }

      const data = await response.json();
      setStreamData(data);
      localStorage.setItem('streamData', JSON.stringify(data));

      toast({
        title: 'Livestream created',
        description: 'Your livestream has been created successfully.',
      });
    } catch (error) {
      console.error('Error creating livestream:', error);
      toast({
        title: 'Error',
        description: 'Failed to create livestream. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleShare = (platform: string) => {
    if (streamData) {
      const streamUrl = `${window.location.origin}/live/view/${streamData.playbackId}`;
      const streamName = streamData.name || 'My Livestream';
      let shareUrl = '';

      switch (platform) {
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=Check out my livestream: ${streamName}&url=${encodeURIComponent(streamUrl)}`;
          break;
        case 'telegram':
          shareUrl = `https://t.me/share/url?url=${encodeURIComponent(streamUrl)}&text=Check out my livestream: ${streamName}`;
          break;
        case 'warpcast':
          shareUrl = `https://warpcast.com/~/compose?text=Check out my livestream: ${streamName}&embeds[]=${encodeURIComponent(streamUrl)}`;
          break;
        case 'copy':
          navigator.clipboard.writeText(streamUrl);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
          return;
        default:
          return;
      }

      if (shareUrl) {
        window.open(shareUrl, '_blank');
      }
    }
  };

  const navigateToStream = () => {
    if (streamData) {
      router.push(`/live/view/${streamData.playbackId}`);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8 mt-20">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Create Livestream</CardTitle>
          <CardDescription>Enter a name for your new livestream and click create.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Input
                id="streamName"
                placeholder="Enter stream name"
                value={streamName}
                onChange={(e) => setStreamName(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleCreateStream} className="w-full">
            Create Stream
          </Button>
        </CardFooter>
      </Card>

      {streamData && (
        <Card className="max-w-2xl mx-auto mt-8">
          <CardHeader>
            <CardTitle>Stream Information</CardTitle>
            <CardDescription>Details for your newly created livestream</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-semibold">Stream Key:</span>
                <span>{streamData.streamKey}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Playback ID:</span>
                <span>{streamData.playbackId}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Stream ID:</span>
                <span>{streamData.id}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Is Active:</span>
                <span>{streamData.isActive ? 'Yes' : 'No'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold">Created At:</span>
                <span>{new Date(streamData.createdAt).toLocaleString()}</span>
              </div>
            </div>
            <div className="mt-4 flex justify-center">
              <QRCodeSVG value={`${window.location.origin}/live/view/${streamData.playbackId}`} />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" /> Share Stream
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Share livestream</DialogTitle>
                  <DialogDescription>
                    Share your livestream on various platforms
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <Button onClick={() => handleShare('twitter')} variant="outline" className="w-full">
                    <Twitter className="mr-2 h-4 w-4" /> Twitter
                  </Button>
                  <Button onClick={() => handleShare('telegram')} variant="outline" className="w-full">
                    <Send className="mr-2 h-4 w-4" /> Telegram
                  </Button>
                  <Button onClick={() => handleShare('warpcast')} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" /> Warpcast
                  </Button>
                  <Button onClick={() => handleShare('copy')} variant="outline" className="w-full">
                    {isCopied ? (
                      <Check className="mr-2 h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="mr-2 h-4 w-4" />
                    )}
                    {isCopied ? 'Copied!' : 'Copy Link'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={navigateToStream}>Go to Stream</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
