'use client';

import { ProfileContent } from "../ProfileContent";
import { useNeynarContext } from "@neynar/react";
import { INeynarAuthenticatedUser } from "@neynar/react/dist/types/common";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ProfilePage() {
  const { user: currentUser } = useNeynarContext();
  const [profileUser, setProfileUser] = useState<INeynarAuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const fid = params.fid as string;

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/farcaster/user?fid=${fid}&viewer_fid=${currentUser?.fid}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }
        const userData = await response.json();
        setProfileUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (fid && currentUser) {
      fetchUser();
    }
  }, [fid, currentUser]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profileUser) {
    return <div>User not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <ProfileContent user={profileUser} />
    </div>
  );
}
