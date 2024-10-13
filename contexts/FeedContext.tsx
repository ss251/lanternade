"use client";

import { Cast } from '@/types/neynar';
import React, { createContext, useContext, useState, useEffect } from 'react';

interface FeedState {
  items: Cast[];
  cursor: string | null;
  loading: boolean;
  error: string | null;
}

const FeedContext = createContext<{
  feedState: FeedState;
  setFeedState: React.Dispatch<React.SetStateAction<FeedState>>;
} | undefined>(undefined);

export const FeedProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedState, setFeedState] = useState<FeedState>(() => {
    const saved = localStorage.getItem('feedState');
    return saved ? JSON.parse(saved) : {
      items: [],
      cursor: null,
      loading: false,
      error: null
    };
  });

  useEffect(() => {
    localStorage.setItem('feedState', JSON.stringify(feedState));
  }, [feedState]);

  return (
    <FeedContext.Provider value={{ feedState, setFeedState }}>
      {children}
    </FeedContext.Provider>
  );
};

export const useFeed = () => {
  const context = useContext(FeedContext);
  if (context === undefined) {
    throw new Error('useFeed must be used within a FeedProvider');
  }
  return context;
};
