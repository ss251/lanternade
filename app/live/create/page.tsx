'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Livestream } from '@/types/livepeer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

export default function CreateLivestream() {
  const [streamName, setStreamName] = useState('');
  const [streamData, setStreamData] = useState<Livestream | null>(null);
  const { toast } = useToast();

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
              <Label htmlFor="streamName">Stream Name</Label>
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
          </CardContent>
        </Card>
      )}
    </div>
  );
}
