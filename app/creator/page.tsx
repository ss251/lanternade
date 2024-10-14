"use client"

import { useState } from "react";
import { VideoUploader } from "@/components/VideoUploader"
import { AICreatorStudio } from "@/components/AICreatorStudio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Page() {
  const [activeTab, setActiveTab] = useState("ai-studio");

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <TooltipProvider>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="ai-studio"
                  className={`mb-1 px-4 transition-all ${
                    activeTab === "ai-studio" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  AI Studio
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create AI-powered content with various models</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger 
                  value="video-upload"
                  className={`mb-1 px-4 transition-all ${
                    activeTab === "video-upload" 
                      ? "bg-primary text-primary-foreground" 
                      : "hover:bg-muted"
                  }`}
                >
                  Video Upload
                </TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Upload and manage your video content</p>
              </TooltipContent>
            </Tooltip>
          </TabsList>
          <TabsContent value="ai-studio">
            <AICreatorStudio />
          </TabsContent>
          <TabsContent value="video-upload">
            <VideoUploader />
          </TabsContent>
        </Tabs>
      </TooltipProvider>
    </div>
  )
}
