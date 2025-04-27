import React, { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import axios from "axios";
import { useNavigate } from "react-router";
const VITE_API_BASE = import.meta.env.VITE_API_BASE;

export default function JoinMeetings() {
  const [rooms, setRooms] = useState([]);
  const navigate=useNavigate()
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE}/api/meeting/all-rooms`
        );
        setRooms(response.data);
        console.log(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRooms();
  }, []);
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-10 text-center text-gray-800">
          Available Meetings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {rooms?.map((room, index) => (
            <div
              key={index}
              className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md hover:shadow-xl transition duration-300 flex flex-col justify-between"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{room?.topic}</h3>
                <p className="text-sm text-gray-600">
                  <strong>Active:</strong> {room?.isActive ? 'Yes' : 'No'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Limit:</strong> {room?.limit}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Created at:</strong> {room?.createdAt?.split('T')[0]}
                </p>
              </div>
              <button
                onClick={() => navigate(`/view-room/${room?._id}`)}
                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-xl transition"
              >
                Join Meeting
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}
