'use client';

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlayerWithControls } from "@/components/PlayerWithControls";
import Image from 'next/image';
import { getSrc } from '@livepeer/react/external';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select"

export function AICreatorStudio() {
  const [activeTab, setActiveTab] = useState('text-to-image');
  const [generatedContent, setGeneratedContent] = useState<{
    textToImage: string | null;
    imageToImage: string | null;
    imageToVideo: string | null;
    audioToText: {
      text: string;
      chunks: {
        text: string;
        timestamp: [number, number];
      }[];
    } | null;
  }>({
    textToImage: null,
    imageToImage: null,
    imageToVideo: null,
    audioToText: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleTextToImage = async (prompt: string, model_id: string, width = 1024, height = 1024, loras?: string) => {
    setIsLoading(true);
    try {
      console.log('Sending request with:', { prompt, model_id, width, height, loras });
      const response = await fetch('/api/ai/text-to-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, model_id, width, height, loras }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      setGeneratedContent(prev => ({ ...prev, textToImage: data.imageUrl }));
    } catch (error) {
      console.error('Error generating image:', error);
    }
    setIsLoading(false);
  };

  const handleImageToImage = async (prompt: string, image: File, modelId: string, loras?: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('prompt', prompt);
      formData.append('image', image);
      formData.append('model_id', modelId);
      if (loras) formData.append('loras', loras);
      const response = await fetch('/api/ai/image-to-image', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transform image');
      }
      setGeneratedContent(prev => ({ ...prev, imageToImage: data.imageUrl }));
    } catch (error) {
      console.error('Error transforming image:', error);
    }
    setIsLoading(false);
  };

  const handleImageToVideo = async (image: File, modelId: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      formData.append('model_id', modelId);
      const response = await fetch('/api/ai/image-to-video', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }
      setGeneratedContent(prev => ({ ...prev, imageToVideo: data.videoUrl }));
    } catch (error) {
      console.error('Error generating video:', error);
    }
    setIsLoading(false);
  };

  const handleAudioToText = async (audio: File, modelId: string) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('audio', audio);
      formData.append('model_id', modelId);
      const response = await fetch('/api/ai/audio-to-text', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to transcribe audio');
      }
      setGeneratedContent(prev => ({ ...prev, audioToText: data }));
    } catch (error) {
      console.error('Error transcribing audio:', error);
    }
    setIsLoading(false);
  };

  const renderGeneratedContent = () => {
    const content = generatedContent[activeTab as keyof typeof generatedContent];
    if (!content) return null;

    return (
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Generated Content</h3>
        {activeTab === 'audioToText' ? (
          <div className="space-y-2">
            {typeof content === 'object' && content && 'chunks' in content && content.chunks.length > 0 ? (
              <>
                <div className="border p-2 rounded">
                  <p className="font-semibold">Full Transcription:</p>
                  <p>{content.text}</p>
                </div>
                <div className="border p-2 rounded">
                  <p className="font-semibold">Chunks:</p>
                  {content.chunks.map((chunk, index) => (
                    <div key={index} className="mt-2">
                      <p>{chunk.text}</p>
                      <p className="text-sm text-gray-500">
                        Timestamp: {chunk.timestamp[0]}s - {chunk.timestamp[1]}s
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p>No transcription available</p>
            )}
          </div>
        ) : activeTab === 'imageToVideo' ? (
          <PlayerWithControls src={typeof content === 'string' ? getSrc(content) || [] : []} />
        ) : (
          <Image src={content as string} alt="Generated content" width={300} height={300} />
        )}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>AI Creator Studio</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="textToImage">Text to Image</TabsTrigger>
            <TabsTrigger value="imageToImage">Image to Image</TabsTrigger>
            <TabsTrigger value="imageToVideo">Image to Video</TabsTrigger>
            <TabsTrigger value="audioToText">Audio to Text</TabsTrigger>
          </TabsList>
          <TabsContent value="textToImage">
            <TextToImageTab onGenerate={handleTextToImage} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="imageToImage">
            <ImageToImageTab onGenerate={handleImageToImage} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="imageToVideo">
            <ImageToVideoTab onGenerate={handleImageToVideo} isLoading={isLoading} />
          </TabsContent>
          <TabsContent value="audioToText">
            <AudioToTextTab onGenerate={handleAudioToText} isLoading={isLoading} />
          </TabsContent>
        </Tabs>

        {renderGeneratedContent()}
      </CardContent>
    </Card>
  );
}

function TextToImageTab({ onGenerate, isLoading }: { onGenerate: (prompt: string, modelId: string) => void, isLoading: boolean }) {
  const [prompt, setPrompt] = useState('');
  const [modelId, setModelId] = useState('SG161222/RealVisXL_V4.0_Lightning');

  const models = [
    // Warm Models
    { id: 'SG161222/RealVisXL_V4.0_Lightning', name: 'RealVisXL V4.0 Lightning', status: 'warm' },
    { id: 'ByteDance/SDXL-Lightning', name: 'SDXL-Lightning', status: 'warm' },
    
    // On-Demand Models
    { id: 'SG161222/Realistic_Vision_V6.0_B1_noVAE', name: 'Realistic Vision V6.0 B1', status: 'on-demand' },
    { id: 'stabilityai/stable-diffusion-xl-base-1.0', name: 'Stable Diffusion XL Base 1.0', status: 'on-demand' },
    { id: 'runwayml/stable-diffusion-v1-5', name: 'Stable Diffusion v1.5', status: 'on-demand' },
    { id: 'prompthero/openjourney-v4', name: 'Openjourney V4', status: 'on-demand' },
    { id: 'SG161222/RealVisXL_V4.0', name: 'RealVisXL V4.0', status: 'on-demand' },
    { id: 'stabilityai/sd-turbo', name: 'SD Turbo (Limited Commercial Use)', status: 'on-demand' },
    { id: 'stabilityai/sdxl-turbo', name: 'SDXL Turbo (Limited Commercial Use)', status: 'on-demand' },
    { id: 'stabilityai/stable-diffusion-3-medium-diffusers', name: 'Stable Diffusion 3 Medium (Limited Commercial Use)', status: 'on-demand' },
  ];

  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Enter your image description..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Select onValueChange={setModelId} value={modelId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Warm Models</SelectLabel>
            {models.filter(model => model.status === 'warm').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name} <span className="ml-2 text-green-500">(Warm)</span>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>On-Demand Models</SelectLabel>
            {models.filter(model => model.status === 'on-demand').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={() => onGenerate(prompt, modelId)} disabled={isLoading}>
        {isLoading ? 'Generating...' : 'Generate Image'}
      </Button>
    </div>
  );
}

function ImageToImageTab({ onGenerate, isLoading }: { onGenerate: (prompt: string, image: File, modelId: string, loras?: string) => void, isLoading: boolean }) {
  const [prompt, setPrompt] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [modelId, setModelId] = useState('timbrooks/instruct-pix2pix');
  const [loras, setLoras] = useState('');

  const models = [
    // Warm Model
    { id: 'timbrooks/instruct-pix2pix', name: 'Instruct Pix2Pix', status: 'warm' },
    
    // On-Demand Models
    { id: 'ByteDance/SDXL-Lightning', name: 'SDXL-Lightning', status: 'on-demand' },
    { id: 'SG161222/RealVisXL_V4.0', name: 'RealVisXL V4.0', status: 'on-demand' },
    { id: 'SG161222/RealVisXL_V4.0_Lightning', name: 'RealVisXL V4.0 Lightning', status: 'on-demand' },
    { id: 'stabilityai/sd-turbo', name: 'SD Turbo (Limited Commercial Use)', status: 'on-demand' },
    { id: 'stabilityai/sdxl-turbo', name: 'SDXL Turbo (Limited Commercial Use)', status: 'on-demand' },
  ];

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <Textarea
        placeholder="Enter your transformation prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Select onValueChange={setModelId} value={modelId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Warm Models</SelectLabel>
            {models.filter(model => model.status === 'warm').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name} <span className="ml-2 text-green-500">(Warm)</span>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>On-Demand Models</SelectLabel>
            {models.filter(model => model.status === 'on-demand').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Textarea
        placeholder="Enter LoRa configuration (optional, JSON format)"
        value={loras}
        onChange={(e) => setLoras(e.target.value)}
      />
      <Button onClick={() => image && onGenerate(prompt, image, modelId, loras)} disabled={isLoading || !image}>
        {isLoading ? 'Transforming...' : 'Transform Image'}
      </Button>
    </div>
  );
}

function ImageToVideoTab({ onGenerate, isLoading }: { onGenerate: (image: File, modelId: string) => void, isLoading: boolean }) {
  const [image, setImage] = useState<File | null>(null);
  const [modelId, setModelId] = useState('stabilityai/stable-video-diffusion-img2vid-xt-1-1');

  const models = [
    // Warm Model
    { id: 'stabilityai/stable-video-diffusion-img2vid-xt-1-1', name: 'Stable Video Diffusion Img2Vid XT 1.1', status: 'warm' },
    
    // On-Demand Model
    { id: 'stable-video-diffusion-img2vid-xt', name: 'Stable Video Diffusion Img2Vid XT', status: 'on-demand' },
  ];

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files?.[0] || null)}
      />
      <Select onValueChange={setModelId} value={modelId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Warm Models</SelectLabel>
            {models.filter(model => model.status === 'warm').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name} <span className="ml-2 text-green-500">(Warm)</span>
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectGroup>
            <SelectLabel>On-Demand Models</SelectLabel>
            {models.filter(model => model.status === 'on-demand').map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button onClick={() => image && onGenerate(image, modelId)} disabled={isLoading || !image}>
        {isLoading ? 'Generating...' : 'Generate Video'}
      </Button>
    </div>
  );
}

function AudioToTextTab({ onGenerate, isLoading }: { onGenerate: (audio: File, modelId: string) => void, isLoading: boolean }) {
  const [audio, setAudio] = useState<File | null>(null);
  const [modelId, setModelId] = useState('openai/whisper-large-v3');

  const models = [
    { id: 'openai/whisper-large-v3', name: 'Whisper Large V3', status: 'warm' },
  ];

  return (
    <div className="space-y-4">
      <Input
        type="file"
        accept="audio/*"
        onChange={(e) => setAudio(e.target.files?.[0] || null)}
      />
      <Select onValueChange={setModelId} value={modelId}>
        <SelectTrigger>
          <SelectValue placeholder="Select a model" />
        </SelectTrigger>
        <SelectContent>
          {models.map((model) => (
            <SelectItem key={model.id} value={model.id}>
              {model.name} {model.status === 'warm' && <span className="ml-2 text-green-500">(Warm)</span>}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={() => audio && onGenerate(audio, modelId)} disabled={isLoading || !audio}>
        {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
      </Button>
    </div>
  );
}