'use client';

import React, { useState } from 'react';
import { useNeynarContext } from "@neynar/react";
import { ProfileBio } from './ProfileBio';
import { ProfileCasts } from './ProfileCasts';
import { ProfileReplies } from './ProfileReplies';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { INeynarAuthenticatedUser } from '@neynar/react/dist/types/common';
import CastSkeleton from '@/components/CastSkeleton';
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface ProfileContentProps {
  user: INeynarAuthenticatedUser;
}

export function ProfileContent({ user: profileUser }: ProfileContentProps) {
  const { user: currentUser } = useNeynarContext();
  const [user, setUser] = useState<INeynarAuthenticatedUser>(profileUser);
  const [isFollowing, setIsFollowing] = React.useState(profileUser.viewer_context?.following || false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleFollowToggle = async () => {
    if (!currentUser) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/farcaster/follow', {
        method: isFollowing ? 'DELETE' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: currentUser.signer_uuid,
          target_fid: profileUser.fid,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update follow status');
      }

      const updatedUserResponse = await fetch(`/api/farcaster/user?fid=${user.fid}&viewer_fid=${currentUser.fid}`, { cache: 'no-store' });
      if (!updatedUserResponse.ok) {
        throw new Error('Failed to fetch updated user data');
      }
      const updatedUser = await updatedUserResponse.json();
      setUser(updatedUser);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
      <div className="flex justify-between items-start">
        <ProfileBio user={profileUser} />
        {currentUser && currentUser.fid !== profileUser.fid && (
          <Button
            onClick={handleFollowToggle}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}
      </div>
      <Tabs defaultValue="casts">
        <TabsList>
          <TabsTrigger value="casts">Casts</TabsTrigger>
          <TabsTrigger value="replies">Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="casts">
          <ProfileCasts fid={profileUser.fid} />
        </TabsContent>
        <TabsContent value="replies">
          <ProfileReplies fid={profileUser.fid} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
