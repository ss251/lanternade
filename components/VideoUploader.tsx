"use client";

import { useState, useRef } from "react";
import { PlayerWithControls } from "@/components/PlayerWithControls";
import { Src } from "@livepeer/react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, CheckCircle2, Video, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface VideoUploaderProps {
  onVideoSelect?: (file: File | null, ipfsGatewayUrl: string | null, playbackId: string | null) => void;
}

export function VideoUploader({ onVideoSelect }: VideoUploaderProps) {
  const [video, setVideo] = useState<File | null>(null);
  const [playbackId, setPlaybackId] = useState<string>("");
  const [assetStatus, setAssetStatus] = useState<string>("idle");
  const [videoSrc, setVideoSrc] = useState<Src[] | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
      onVideoSelect?.(e.target.files[0], null, null);
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = async (file: File) => {
    setAssetStatus("uploading");
    setUploadProgress(0);

    const res = await fetch("/api/request-upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: file.name }),
    });
    const data = await res.json();

    const xhr = new XMLHttpRequest();
    xhr.open("PUT", data.url, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 100;
        setUploadProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setAssetStatus("processing");
        checkAssetStatus(data.asset.id);
      } else {
        setAssetStatus("error");
      }
    };

    xhr.send(file);
  };

  const checkAssetStatus = async (id: string) => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/asset-status?id=${id}`);
      const data = await res.json();

      setAssetStatus(data.status.phase);

      if (data.status.phase === "ready") {
        clearInterval(interval);
        setPlaybackId(data.playbackId);
        
        onVideoSelect?.(video, data.playbackUrl, data.playbackId);

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

  const handleRemoveVideo = () => {
    setVideo(null);
    setPlaybackId("");
    setAssetStatus("idle");
    setVideoSrc(null);
    setUploadProgress(0);
    onVideoSelect?.(null, null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileChange}
        ref={fileInputRef}
        className="hidden"
      />
      {!video ? (
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="w-full"
        >
          <Video className="mr-2 h-4 w-4" /> Select Video
        </Button>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm truncate">{video.name}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemoveVideo}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {assetStatus !== "idle" && (
            <Alert
              variant={assetStatus === "error" ? "destructive" : "default"}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Status</AlertTitle>
              <AlertDescription>
                {assetStatus === "uploading" && (
                  <>
                    Uploading: {uploadProgress.toFixed(0)}%
                    <Progress value={uploadProgress} className="mt-2" />
                  </>
                )}
                {assetStatus === "processing" && "Processing video..."}
                {assetStatus === "ready" && (
                  <>
                    <CheckCircle2 className="h-4 w-4 inline mr-2" />
                    Video ready!
                  </>
                )}
                {assetStatus === "error" && "Error uploading video"}
              </AlertDescription>
            </Alert>
          )}

          {playbackId && (
            <div className="mt-2">
              <div className="aspect-video">
                <PlayerWithControls src={videoSrc as Src[]} />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
