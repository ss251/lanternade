import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CastSkeleton: React.FC = () => (
  <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
    <CardContent className="p-4">
      <div className="flex items-center mb-3">
        <Skeleton className="w-10 h-10 rounded-full mr-3" />
        <div>
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-3" />
      <Skeleton className="h-48 w-full mb-3" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
    </CardContent>
  </Card>
);

export default CastSkeleton;
