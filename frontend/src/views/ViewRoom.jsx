import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import axios from "axios";
import AgoraRTC from "agora-rtc-sdk-ng";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;
export default function ViewRoom() {
  const { user } = useUser();
  const { roomId } = useParams();
  const [roomInfo, setRoomInfo] = useState(null);
  const [roomTokenInfo, setTokenInfo] = useState(null);
  const [isHost, setIsHost] = useState(false);
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const roomPreInfo = await axios.get(
          `${VITE_API_BASE}/api/meeting/${roomId}`
        );
        setRoomInfo(roomPreInfo.data);
        if (!roomInfo) return;
        else if (String(roomInfo?.hostId) === String(user?._id)) {
          setIsHost(true);
        }

        console.log(roomId);
        const response = await axios.post(
          `${VITE_API_BASE}/api/meeting/${roomId}/join`,
          {
            uid: user?._id,
            role: isHost ? "host" : "student",
          }
        );

        setTokenInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
    


  }, []);
  useEffect(() => {
    const initAgora = async () => {
      const client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
      client.on("user-published", async (user, mediaType) => {
        await client.subscribe(user, mediaType);
    
        if (mediaType === "video") {
          const remoteVideoContainer = document.createElement("div");
          remoteVideoContainer.id = user.uid;
          remoteVideoContainer.style.width = "400px";
          remoteVideoContainer.style.height = "300px";
          document.body.append(remoteVideoContainer);
          user.videoTrack.play(remoteVideoContainer);
        }
    
        if (mediaType === "audio") {
          user.audioTrack.play();
        }
      });
      try {
        await client.join(
          roomTokenInfo.appId,
          roomTokenInfo.channelName,
          roomTokenInfo.token,
          roomTokenInfo.uid
        );
        const localAudioTrack= await AgoraRTC.createMicrophoneAudioTrack();
        const localVideoTrack= await AgoraRTC.createCameraVideoTrack();
        const videoContainer = document.createElement("div");
        videoContainer.id=roomTokenInfo.uid;
        videoContainer.style.width = "400px";
        videoContainer.style.height = "300px";
        document.body.append(videoContainer);
        localVideoTrack.play(videoContainer);
        await client.publish([localAudioTrack, localVideoTrack]);
        console.log("Publishing local tracks to Agora...");
        client.on("user-unpublished", (user) => {
          const remoteContainer = document.getElementById(user.uid);
          if (remoteContainer) remoteContainer.remove();
        });

       
      } catch (error) {
        console.log(error);
      }
    };

    if(roomTokenInfo){
      initAgora();
    }
  },[roomTokenInfo])
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-bold">Joining Meeting...</h1>
    </div>
  );
}
