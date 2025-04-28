import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useUser } from "../context/UserContext";
import axios from "axios";
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
        else if(roomInfo?.hostId==user?._id){
            setIsHost(true)
        }

        console.log(roomId);
        const response = await axios.get(
          `${VITE_API_BASE}/api/meeting/${roomId}/join`,
          {
            uid: user?._id,
            role: isHost?"host":"student",
          }
        );

        setTokenInfo(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoom();
  }, []);
  return (
    <div>
      <div className="">Join Meeting</div>
    </div>
  );
}
