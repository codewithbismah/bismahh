"use client";

import React, { useEffect, useRef } from "react";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const RoomPage = () => {
  const roomId = getUrlParams().get("roomID");
  const roomContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const myMeeting = async () => {
      const appID = 331038675;
      const serverSecret = "fcc1061597932197bb6b410054573b76";

      const resolvedRoomId = roomId || "defaultRoomId";
      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        resolvedRoomId,
        Date.now().toString(),
        "bismah"
      );
      const zp = ZegoUIKitPrebuilt.create(kitToken);

      // Start the call
      zp.joinRoom({
        container: roomContainerRef.current,
        scenario: {
          mode: ZegoUIKitPrebuilt.VideoConference,
        },
        sharedLinks: [
          {
            url:
              window.location.protocol +
              "//" +
              window.location.host +
              window.location.pathname +
              "?roomID=" +
              resolvedRoomId,
          },
        ],
      });
    };

    myMeeting();
  }, [roomId]);

  return (
    <div className="room-page">
      <div ref={roomContainerRef} style={{ width: "100%", height: "100vh" }} />
    </div>
  );
};

export default RoomPage;
