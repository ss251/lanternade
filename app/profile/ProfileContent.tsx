'use client';

import React from 'react';
import { useNeynarContext } from "@neynar/react";
import { ProfileBio } from './ProfileBio';
import { ProfileCasts } from './ProfileCasts';
import { ProfileReplies } from './ProfileReplies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INeynarAuthenticatedUser } from '@neynar/react/dist/types/common';
import CastSkeleton from '@/components/CastSkeleton';
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileContent() {
  const { user } = useNeynarContext();

  if (!user) {
    return (
      <div className="space-y-8">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
            <div className="flex space-x-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
        <CastSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <ProfileBio user={user as INeynarAuthenticatedUser} />
      <Tabs defaultValue="casts">
        <TabsList>
          <TabsTrigger value="casts">Casts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="casts">
          <ProfileCasts fid={user.fid} />
        </TabsContent>
        <TabsContent value="replies">
          <ProfileReplies fid={user.fid} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
