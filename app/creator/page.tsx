"use client"

import { VideoUploader } from "@/components/VideoUploader"
import { AICreatorStudio } from "@/components/AICreatorStudio"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <TooltipProvider>
        <Tabs defaultValue="ai-studio" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="ai-studio">AI Studio</TabsTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p>Create AI-powered content with various models</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <TabsTrigger value="video-upload">Video Upload</TabsTrigger>
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
