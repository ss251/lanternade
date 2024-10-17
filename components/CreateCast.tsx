import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useNeynarContext } from "@neynar/react";
import { toast } from '@/hooks/use-toast';
import { Video, Smile, Send, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PlayerWithControls } from "@/components/PlayerWithControls";
import { Src } from "@livepeer/react";

const MAX_CHARACTERS = 320;

export function CreateCast() {
  const [castText, setCastText] = useState('');
  const [video, setVideo] = useState<File | null>(null);
  const [playbackId, setPlaybackId] = useState<string>("");
  const [videoPlaybackUrl, setVideoPlaybackUrl] = useState<string | null>(null);
  const [assetStatus, setAssetStatus] = useState<string>("idle");
  const [videoSrc, setVideoSrc] = useState<Src[] | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { user } = useNeynarContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_CHARACTERS) {
      setCastText(text);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setVideo(e.target.files[0]);
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
        setVideoPlaybackUrl(data.playbackUrl);

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

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setCastText((prevText) => prevText + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleRemoveVideo = () => {
    setVideo(null);
    setPlaybackId("");
    setAssetStatus("idle");
    setVideoSrc(null);
    setUploadProgress(0);
    setVideoPlaybackUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCast = async () => {
    if (!user?.fid) {
      toast({
        title: 'Error',
        description: 'User not authenticated',
      });
      return;
    }

    setIsLoading(true);

    const embeds = [];
    if (videoPlaybackUrl && playbackId) {
      embeds.push({
        url: videoPlaybackUrl,
      });
    }

    try {
      const response = await fetch('/api/farcaster/cast', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signer_uuid: user.signer_uuid,
          text: castText,
          embeds: embeds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create cast');
      }

      const result = await response.json();
      console.log('Farcaster post result:', result);
      toast({
        title: 'Cast created successfully',
        description: 'Your cast has been created',
        duration: 3000, // Will auto-dismiss after 3 seconds
      });

      // Reset form after successful cast
      setCastText('');
      setVideoPlaybackUrl(null);
      setPlaybackId('');
    } catch (error) {
      console.error('Error creating cast:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create cast',
        duration: 5000,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="What's on your mind?"
        value={castText}
        onChange={handleTextChange}
      />
      <div className="flex justify-between items-center">
        <div className="flex">
          <input
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            ref={fileInputRef}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Video className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="h-5 w-5" />
          </Button>
          <Button 
            onClick={handleCast} 
            disabled={isLoading || (!castText.trim() && !videoPlaybackUrl)}
            size="sm"
            className='ml-1'
          >
            {isLoading ? 'Casting...' : <Send className="h-5 w-5" />}
          </Button>
        </div>
        <div className="relative w-10 h-10 pb-4">
          <svg className="w-10 h-10">
            <circle
              className="text-gray-300"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
              r="18"
              cx="20"
              cy="20"
            />
            <circle
              className="text-blue-600"
              strokeWidth="4"
              strokeDasharray={36 * Math.PI}
              strokeDashoffset={36 * Math.PI - (castText.length / MAX_CHARACTERS) * 36 * Math.PI}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="18"
              cx="20"
              cy="20"
            />
          </svg>
          <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
            {castText.length}
          </span>
        </div>
      </div>
      {showEmojiPicker && (
        <div className="absolute z-10">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
      {video && (
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
