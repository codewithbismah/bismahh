"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import axios from "axios";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface VideoPlayerProps {
  src: string;
  id: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src, id }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [viewCount, setViewCount] = useState<number>(0);
  const [usernames, setUsernames] = useState<string[]>([]);

  useEffect(() => {
    // Fetch view count and usernames when the video loads
    const fetchViewData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/v1/COUNT/viewscount/6736ddc4a9f4c19245e60123`,
          {
            withCredentials: true, // Include cookies for authentication
          }
        );
        setViewCount(response.data.viewCount);
        setUsernames(response.data.usernames); // Array of usernames
      } catch (error) {
        console.error("Error fetching view data:", error);
      }
    };

    fetchViewData();
  }, [id]);

  useEffect(() => {
    if (videoRef.current) {
      if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(videoRef.current);

        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoRef.current?.play().catch((error) => {
            console.error("Video playback failed:", error);
          });
        });

        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("HLS error:", data);
        });
      } else if (
        videoRef.current.canPlayType("application/vnd.apple.mpegurl")
      ) {
        videoRef.current.src = src;
        videoRef.current.play().catch((error) => {
          console.error("Video playback failed on Safari:", error);
        });
      } else {
        console.error("HLS is not supported in this browser");
      }
    }
  }, [src]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 shadow-lg rounded-lg">
      <AspectRatio ratio={16 / 9}>
        <video
          ref={videoRef}
          controls
          className="w-full h-full rounded-lg border-4 border-white"
        >
          Your browser does not support the video tag.
        </video>
      </AspectRatio>
      <div className="mt-2 text-center">
        <p>Views: {viewCount}</p>
        <p>Viewers Name:</p>
        <ul className="list-disc list-inside">
          {usernames.map((username, index) => (
            <li key={index}>{username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayer;
