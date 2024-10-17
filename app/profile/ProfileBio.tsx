import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { INeynarAuthenticatedUser } from '@neynar/react/dist/types/common';

interface ProfileBioProps {
  user: INeynarAuthenticatedUser;
}

export function ProfileBio({ user }: ProfileBioProps) {
  return (
    <div className="flex items-start space-x-4">
      <Avatar className="w-24 h-24">
        <AvatarImage src={user.pfp_url} alt={user.display_name} />
        <AvatarFallback>{user.display_name?.slice(0, 2)}</AvatarFallback>
      </Avatar>
      <div>
        <h1 className="text-2xl font-bold">{user.display_name}</h1>
        <p className="text-gray-600">@{user.username}</p>
        <p className="mt-2">{user.profile.bio.text}</p>
        <div className="mt-2 flex space-x-4">
          <span>{user.follower_count} followers</span>
          <span>{user.following_count} following</span>
        </div>
      </div>
    </div>
  );
}
