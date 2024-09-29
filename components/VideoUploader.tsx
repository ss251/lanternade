"use client";

import { useState } from "react";
import { PlayerWithControls } from "@/components/PlayerWithControls";
import { Src } from "@livepeer/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Upload } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function VideoUploader() {
  const [video, setVideo] = useState<File | null>(null);
  const [playbackId, setPlaybackId] = useState<string>("");
  const [assetStatus, setAssetStatus] = useState<string>("idle");
  const [videoSrc, setVideoSrc] = useState<Src[] | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (video) {
      setAssetStatus("uploading");
      setUploadProgress(0);

      const res = await fetch("/api/request-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: video.name }),
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

      xhr.send(video);
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Video</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="cursor-pointer"
          />
          <Button
            onClick={handleUpload}
            disabled={!video || assetStatus !== "idle"}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" /> Upload Video
          </Button>

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
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Preview</h3>
              <div className="aspect-video">
                <PlayerWithControls src={videoSrc as Src[]} />
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
