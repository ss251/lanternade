"use client"

import { VideoUploader } from "@/components/VideoUploader"

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <VideoUploader />
        <div className="bg-card rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4 text-card-foreground">AI Tools</h2>
          <p className="text-muted-foreground">AI-powered tools for content creation coming soon!</p>
        </div>
      </div>
    </div>
  )
}