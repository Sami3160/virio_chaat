import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

export default function ViewRoom() {
  const clientRef = useRef(null);
  const localAudioTrackRef = useRef(null);
  const localVideoTrackRef = useRef(null);
  const videoContainerRef = useRef(null);

  const { user } = useUser();
  const { roomId } = useParams();

  const [roomInfo, setRoomInfo] = useState(null);
  const [roomTokenInfo, setTokenInfo] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomPreInfo = await axios.get(
          `${VITE_API_BASE}/api/meeting/${roomId}`
        );
        setRoomInfo(roomPreInfo.data);
      } catch (error) {
        console.error("Failed to fetch room info:", error);
      }
    };

    fetchRoom();
  }, [roomId]);

  useEffect(() => {
    const joinRoom = async () => {
      if (!roomInfo || !user) return;

      const isHost = String(roomInfo?.hostId) === String(user?._id);

      try {
        const response = await axios.post(
          `${VITE_API_BASE}/api/meeting/${roomId}/join`,
          {
            uid: user?._id,
            role: isHost ? "host" : "student",
          }
        );
        setTokenInfo(response.data);
      } catch (error) {
        console.error("Failed to join room:", error);
      }
    };

    joinRoom();
  }, [roomInfo, user, roomId]);

  useEffect(() => {
    const initAgora = async () => {
      if (!roomTokenInfo) return;

      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      clientRef.current = client;

      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        
        if (mediaType === "video") {
          const remoteVideoContainer = document.createElement("div");
          remoteVideoContainer.id = `remote-${user.uid}`;
          remoteVideoContainer.style.width = "400px";
          remoteVideoContainer.style.height = "300px";
          remoteVideoContainer.className="w-full h-full"
          videoContainerRef.current.appendChild(remoteVideoContainer);
          user.videoTrack.play(remoteVideoContainer);
        }

        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });

      client.on("user-unpublished", (user) => {
        const remoteContainer = document.getElementById(`remote-${user.uid}`);
        if (remoteContainer) remoteContainer.remove();
      });

      try {
        await client.join(
          roomTokenInfo.appId,
          roomTokenInfo.channelName,
          roomTokenInfo.token,
          roomTokenInfo.uid
        );

        const localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
        const localVideoTrack = await AgoraRTC.createCameraVideoTrack();

        localAudioTrackRef.current = localAudioTrack;
        localVideoTrackRef.current = localVideoTrack;

        const localContainer = document.createElement("div");
        localContainer.id = `local-${roomTokenInfo.uid}`;
        // localContainer.style.width = "400px";
        // localContainer.style.height = "300px";
        localContainer.className="w-full h-full"
        videoContainerRef.current.appendChild(localContainer);

        localVideoTrack.play(localContainer);

        await client.publish([localAudioTrack, localVideoTrack]);
        console.log("Publishing local tracks to Agora...");
      } catch (error) {
        console.error("Failed to join and publish:", error);
      }
    };

    initAgora();

    return () => {
      const leaveChannel = async () => {
        if (localAudioTrackRef.current) {
          localAudioTrackRef.current.close();
          localAudioTrackRef.current = null;
        }
        if (localVideoTrackRef.current) {
          localVideoTrackRef.current.close();
          localVideoTrackRef.current = null;
        }
        if (clientRef.current) {
          await clientRef.current.leave();
          clientRef.current = null;
        }
        console.log("Left the Agora channel and cleaned up tracks.");
      };

      leaveChannel();
    };
  }, [roomTokenInfo]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Meeting Room</h1>
      <div
        ref={videoContainerRef}
        className="flex flex-wrap justify-center gap-4 w-full h-screen"
      ></div>
    </div>
  );
}
