'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function BroadcastPage() {

  return (
    <div className="container mx-auto py-10 mt-20 px-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Broadcast</CardTitle>
        </CardHeader>
        <Separator className="my-4" />
        <CardContent>
          <p className="text-lg mb-4">To start broadcasting, follow these steps:</p>
          <ScrollArea className="h-[400px] pr-4">
            <ol className="space-y-4">
              <li className="flex items-start">
                <span className="font-bold mr-2">1.</span>
                <span>
                  First, <Link href="/live/create" className="text-primary hover:underline">create a new livestream</Link> to get your stream key and playback ID.
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">2.</span>
                <span>Open OBS Studio on your computer.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">3.</span>
                <span>Go to Settings &gt; Stream.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">4.</span>
                <span>Set the service to &quot;Livepeer Studio&quot;.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">5.</span>
                <span>Set the server to &quot;Global (RMTP)&quot;.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">6.</span>
                <span>Enter your stream key in the &quot;Stream Key&quot; field.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">7.</span>
                <span>Click &quot;OK&quot; to save the settings.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">8.</span>
                <span>Set up your scenes and sources in OBS as desired.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">9.</span>
                <span>When ready, click &quot;Start Streaming&quot; in OBS.</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">10.</span>
                <span>
                  Navigate to your livestream at{' '}
                  <Link href="#" className="text-primary hover:underline">
                    lanternade.vercel.app/view/[your playback ID]
                  </Link>
                  .
                </span>
              </li>
            </ol>
          </ScrollArea>
        </CardContent>
        <Separator className="my-4" />
        <CardFooter className="flex justify-end">
          <Button asChild>
            <Link href="/live/create">Create New Livestream</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
