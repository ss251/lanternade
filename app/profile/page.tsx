'use client';

import { ProfileContent } from "./ProfileContent";
import { useNeynarContext } from "@neynar/react";
import { INeynarAuthenticatedUser } from "@neynar/react/dist/types/common";

export default function ProfilePage() {
  const { user } = useNeynarContext();

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <ProfileContent user={user as INeynarAuthenticatedUser} />
    </div>
  );
}
