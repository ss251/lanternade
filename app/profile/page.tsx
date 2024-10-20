'use client';

import { ProfileContent } from "./ProfileContent";
import { useNeynarContext } from "@neynar/react";
import { INeynarAuthenticatedUser } from "@neynar/react/dist/types/common";
import { useEffect, useState } from "react";
import CastSkeleton from '@/components/CastSkeleton';
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
  const { user, isAuthenticated } = useNeynarContext();
  const [isPageLoading, setIsPageLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      setIsPageLoading(false);
    }
  }, [isAuthenticated]);

  if (isPageLoading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20 space-y-8">
        <div className="flex items-start space-x-4">
          <Skeleton className="w-24 h-24 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <CastSkeleton count={5} />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <div className="container mx-auto px-4 py-8 mt-20">Please log in to view your profile.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <ProfileContent user={user as INeynarAuthenticatedUser} />
    </div>
  );
}
