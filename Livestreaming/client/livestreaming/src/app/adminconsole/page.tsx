"use client"; // Ensure this file is treated as client-side only

import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

// Function to get URL parameters
function getUrlParams(url: string = window.location.href): URLSearchParams {
  const urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const RoomPage: React.FC = () => {
  const roomContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appID = 331038675; // Ideally, move this to environment variables
    const serverSecret = "fcc1061597932197bb6b410054573b76"; // Store in env variable in production

    const roomId = getUrlParams().get("roomID");
    const resolvedRoomId = roomId || "defaultRoomId";

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      resolvedRoomId,
      Date.now().toString(),
      "bismah" // Example username
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);

    zp.joinRoom({
      container: roomContainerRef.current!,
      sharedLinks: [
        {
          name: "Personal link",
          url: `${window.location.protocol}//${window.location.host}${window.location.pathname}?roomID=${resolvedRoomId}`,
        },
      ],
      scenario: {
        mode: ZegoUIKitPrebuilt.VideoConference,
      },
    });
  }, []); // Empty dependency array ensures this runs only once after the component mounts

  return (
    <div className="room-page">
      <div ref={roomContainerRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default RoomPage;
