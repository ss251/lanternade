"use client";

import React from "react";
import * as Player from "@livepeer/react/player";
import { Src } from "@livepeer/react";
import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import {
  VolumeXIcon,
  PauseIcon,
  PictureInPictureIcon,
  PlayIcon,
  SettingsIcon,
  Volume2Icon,
  EllipsisIcon,
  Maximize,
  Minimize,
} from "lucide-react";
import { useTheme } from "next-themes";

export function PlayerWithControls({ src }: { src: Src[] }) {
  const { theme } = useTheme();

  if (!src || src.length === 0) {
    return (
      <PlayerLoading
        title="Invalid source"
        description="We could not fetch valid playback information for the provided source. Please check and try again."
      />
    );
  }

  return (
    <Player.Root src={src} autoPlay>
      <Player.Container className="h-full w-full overflow-hidden bg-background outline-none transition">
        <Player.Video
          title="Video"
          className={cn("h-full w-full transition")}
        />

        <Player.LoadingIndicator className="w-full relative h-full bg-background/50 backdrop-blur">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <EllipsisIcon className="w-8 h-8 animate-spin text-primary" />
          </div>
          <PlayerLoading />
        </Player.LoadingIndicator>

        <Player.ErrorIndicator
          matcher="all"
          className="absolute inset-0 flex flex-col items-center justify-center bg-background/40 backdrop-blur-lg"
        >
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-1">
              <div className="text-lg sm:text-2xl font-bold text-foreground">
                Error Occurred
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Failed to load the video. Please try again later.
              </div>
            </div>
            <EllipsisIcon className="w-6 h-6 md:w-8 md:h-8 mx-auto animate-spin text-primary" />
          </div>
        </Player.ErrorIndicator>

        <Player.Controls 
          className={`gap-1 px-3 py-2 flex-col-reverse flex ${
            theme === 'dark'
              ? 'bg-gradient-to-b from-background/5 via-background/30 to-background/60'
              : 'bg-gradient-to-b from-background/0 via-background/5 to-background/10'
          }`}
        >
          <div className="flex justify-between gap-4">
            <div className="flex flex-1 items-center gap-3">
              <Player.PlayPauseTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0 text-foreground hover:text-primary">
                <Player.PlayingIndicator asChild matcher={false}>
                  <PlayIcon className="w-full h-full" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild matcher={true}>
                  <PauseIcon className="w-full h-full" />
                </Player.PlayingIndicator>
              </Player.PlayPauseTrigger>

              <Player.LiveIndicator className="gap-2 flex items-center">
                <div className="bg-destructive h-1.5 w-1.5 rounded-full" />
                <span className="text-sm select-none text-foreground">
                  LIVE
                </span>
              </Player.LiveIndicator>
              <Player.LiveIndicator
                matcher={false}
                className="flex gap-2 items-center"
              >
                <Player.Time className="text-sm tabular-nums select-none" />
              </Player.LiveIndicator>

              <Player.MuteTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0 text-foreground hover:text-primary">
                <Player.VolumeIndicator asChild matcher={true}>
                  <VolumeXIcon className="w-full h-full" />
                </Player.VolumeIndicator>
                <Player.VolumeIndicator asChild matcher={false}>
                  <Volume2Icon className="w-full h-full" />
                </Player.VolumeIndicator>
              </Player.MuteTrigger>

              <Player.Volume className="relative mr-1 flex-1 group flex cursor-pointer items-center select-none touch-none max-w-[120px] h-5">
                <Player.Track className="bg-muted relative grow rounded-full transition h-[2px] group-hover:h-[3px]">
                  <Player.Range className="absolute bg-primary rounded-full h-full" />
                </Player.Track>
                <Player.Thumb className="block transition group-hover:scale-110 w-3 h-3 bg-primary rounded-full" />
              </Player.Volume>
            </div>
            <div className="flex justify-end items-center gap-2.5">
              <Settings className="w-6 h-6 transition flex-shrink-0 text-foreground hover:text-primary" />
              <Player.PictureInPictureTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0 text-foreground hover:text-primary">
                <PictureInPictureIcon className="w-full h-full" />
              </Player.PictureInPictureTrigger>
              <Player.FullscreenTrigger className="w-6 h-6 hover:scale-110 transition flex-shrink-0 text-foreground hover:text-primary">
                <Player.FullscreenIndicator asChild matcher={false}>
                  <Maximize className="w-full h-full" />
                </Player.FullscreenIndicator>
                <Player.FullscreenIndicator asChild matcher={true}>
                  <Minimize className="w-full h-full" />
                </Player.FullscreenIndicator>
              </Player.FullscreenTrigger>
            </div>
          </div>
          <Player.Seek className="relative group flex cursor-pointer items-center select-none touch-none w-full h-5">
            <Player.Track className="bg-muted relative grow rounded-full transition h-[2px] group-hover:h-[3px]">
              <Player.SeekBuffer className="absolute bg-muted-foreground transition duration-1000 rounded-full h-full" />
              <Player.Range className="absolute bg-primary rounded-full h-full" />
            </Player.Track>
            <Player.Thumb className="block group-hover:scale-110 w-3 h-3 bg-primary transition rounded-full" />
          </Player.Seek>
        </Player.Controls>
      </Player.Container>
    </Player.Root>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={className} aria-label="Playback settings">
          <SettingsIcon />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="w-60 rounded-md bg-popover border border-border p-3 shadow-md outline-none"
          side="top"
          alignOffset={-70}
          align="end"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Settings content goes here */}
          <Popover.Arrow className="fill-popover" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function PlayerLoading({
  title,
  description,
}: {
  title?: React.ReactNode;
  description?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      {title && <h2 className="text-xl font-bold">{title}</h2>}
      {description && <p className="text-sm text-gray-300">{description}</p>}
    </div>
  );
}
