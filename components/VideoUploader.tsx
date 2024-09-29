"use client";

import { useState } from "react";
import { PlayerWithControls } from "@/components/PlayerWithControls";
import { Src } from "@livepeer/react";

export function VideoUploader() {
  const [video, setVideo] = useState<File | null>(null);
  const [playbackId, setPlaybackId] = useState<string>("");
  const [assetStatus, setAssetStatus] = useState<string>("idle");
  const [videoSrc, setVideoSrc] = useState<Src[] | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (video) {
      const res = await fetch("/api/request-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: video.name }),
      });
      const data = await res.json();

      await fetch(data.url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/octet-stream",
        },
        body: video,
      });

      checkAssetStatus(data.asset.id);
    }
  };

  const checkAssetStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/asset-status?id=${id}`);
      const data = await res.json();

      setAssetStatus(data.status.phase);

      if (data.status.phase === "ready") {
        clearInterval(interval);
        setPlaybackId(data.playbackId);

        const sourceRes = await fetch(
          `/api/get-playback-source?playbackId=${data.playbackId}`
        );
        const sourceData = await sourceRes.json();

        if (sourceData.src) {
          setVideoSrc(sourceData.src);
        } else {
          console.error("Failed to fetch playback source");
        }
      }
    }, 5000);
  };

  return (
    <div className="bg-card rounded-lg shadow-xl p-6">
      <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
        Upload Video
      </h2>
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-muted-foreground
                    file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0
                    file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground
                    hover:file:bg-primary/90"
      />
      <button
        disabled={!video}
        onClick={handleUpload}
        className={`mt-4 w-full py-2 px-4 rounded font-bold text-primary-foreground transition-colors ${
          !video
            ? "bg-muted cursor-not-allowed"
            : "bg-primary hover:bg-primary/90"
        }`}
      >
        Upload Video
      </button>

      {assetStatus !== "idle" && assetStatus !== "ready" && (
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">
            Asset Status: {assetStatus}
          </p>
        </div>
      )}

      {playbackId && (
        <div className="md:col-span-2 bg-card rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">
            Preview
          </h2>
          <div className="aspect-w-16 aspect-h-9">
            <PlayerWithControls src={videoSrc as Src[]} />
          </div>
        </div>
      )}
    </div>
  );
}
