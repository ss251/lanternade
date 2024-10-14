"use client"

import { VideoUploader } from "@/components/VideoUploader"
import { AICreatorStudio } from "@/components/AICreatorStudio"

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 gap-8">
        <VideoUploader />
        <AICreatorStudio />
      </div>
    </div>
  )
}
