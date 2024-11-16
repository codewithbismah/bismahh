// // // pages/index.tsx
// pages/index.tsx
"use client";

import React from "react";
import VideoPlayer from "../components/page";
import { AspectRatio } from "@/components/ui/aspect-ratio";

const Home: React.FC = () => {
  const videoSrc =
    "http://localhost:4050/uploads/courses/1c04127d-96f5-4c8a-a169-af4a035dae2d/index.m3u8"; // replace with actual URL
  const videoId = "live-stream-video"; // Add a unique id

  return (
    <div className="p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-semibold text-center mb-4">
        Live Streaming Video Player
      </h1>

      <div className="bg-gray-800 rounded-lg p-4">
        <AspectRatio ratio={16 / 9}>
          <VideoPlayer id={videoId} src={videoSrc} />
        </AspectRatio>
      </div>
    </div>
  );
};

export default Home;
