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
  Loader2Icon,
  Maximize,
  Minimize,
} from "lucide-react";
import { useTheme } from "next-themes";

export function PlayerWithControls({ src }: { src: Src[] }) {
  const { theme } = useTheme();
  const [isLoading, setIsLoading] = React.useState(true);

  const handleLoadStart = () => setIsLoading(true);
  const handleLoadedData = () => setIsLoading(false);

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
      <Player.Container className="relative aspect-video w-full overflow-hidden rounded-lg bg-black shadow-lg">
        <Player.Video
          title="Video"
          className={cn("h-full w-full object-contain")}
          onLoadStart={handleLoadStart}
          onLoadedData={handleLoadedData}
        />

        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <Loader2Icon className="h-12 w-12 animate-spin text-primary" />
          </div>
        )}

        <Player.Controls 
          className={cn(
            "absolute bottom-0 left-0 right-0 flex flex-col-reverse gap-2 p-3 transition-opacity duration-300",
            theme === 'dark'
              ? 'bg-gradient-to-t from-black via-black/80 to-transparent'
              : 'bg-gradient-to-t from-white/90 via-white/60 to-transparent'
          )}
        >
          <Player.Seek className="group relative flex w-full items-center">
            <Player.SeekBuffer className="absolute h-1 w-full rounded-full bg-white/30" />
            <Player.Track className="absolute h-1 w-full rounded-full bg-white/60">
              <Player.Range className="absolute h-full rounded-full bg-primary" />
            </Player.Track>
            <Player.Thumb className="block h-3 w-3 rounded-full bg-primary shadow-md transition-transform group-hover:scale-125" />
          </Player.Seek>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Player.PlayPauseTrigger className="rounded-full p-1.5 text-white hover:bg-white/10 hover:text-primary transition">
                <Player.PlayingIndicator asChild matcher={false}>
                  <PlayIcon className="h-6 w-6" />
                </Player.PlayingIndicator>
                <Player.PlayingIndicator asChild>
                  <PauseIcon className="h-6 w-6" />
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

              <Player.MuteTrigger className="rounded-full p-1.5 text-white hover:bg-white/10 hover:text-primary transition">
                <Player.VolumeIndicator asChild matcher={false}>
                  <VolumeXIcon className="h-6 w-6" />
                </Player.VolumeIndicator>
                <Player.VolumeIndicator asChild matcher={true}>
                  <Volume2Icon className="h-6 w-6" />
                </Player.VolumeIndicator>
              </Player.MuteTrigger>

              <Player.Volume className="group relative flex w-20 items-center">
                <Player.Track className="relative h-1 w-full rounded-full bg-white/60">
                  <Player.Range className="absolute h-full rounded-full bg-primary" />
                </Player.Track>
                <Player.Thumb className="block h-3 w-3 rounded-full bg-primary shadow-md transition-transform group-hover:scale-125" />
              </Player.Volume>

              <Player.Time className="text-sm tabular-nums text-white" />
            </div>

            <div className="flex items-center gap-3">
              <Settings className="rounded-full p-1.5 text-white hover:bg-white/10 hover:text-primary transition" />
              <Player.PictureInPictureTrigger className="rounded-full p-1.5 text-white hover:bg-white/10 hover:text-primary transition">
                <PictureInPictureIcon className="h-6 w-6" />
              </Player.PictureInPictureTrigger>
              <Player.FullscreenTrigger className="rounded-full p-1.5 text-white hover:bg-white/10 hover:text-primary transition">
                <Player.FullscreenIndicator asChild matcher={false}>
                  <Maximize className="h-6 w-6" />
                </Player.FullscreenIndicator>
                <Player.FullscreenIndicator asChild>
                  <Minimize className="h-6 w-6" />
                </Player.FullscreenIndicator>
              </Player.FullscreenTrigger>
            </div>
          </div>
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
          <SettingsIcon className="h-6 w-6" />
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
