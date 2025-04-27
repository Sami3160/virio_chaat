import React, { useState } from "react";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router";
const VITE_BASE_URL = import.meta.env.VITE_API_BASE;

export default function CreateMeetings() {
  const [meetingType, setMeetingType] = useState("instant");
  const [invitedStudents, setInvitedStudents] = useState([]);
  const [enableInvites, setEnableInvites] = useState(false);
  const [roomID, setRoomID] = useState("");
  const [password, setPassword] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [limit, setLimit] = useState(10);
  const { user } = useUser();
  const navigate = useNavigate();

  console.log(user)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if(!user){
        alert("Please login to continue");
        return;
      }
      if (
        enableInvites &&
        (invitedStudents.length === 0 ||
          invitedStudents.length > limit ||
          limit == 0)
      ) {
        alert("Invited students cannot be greater then limit");
        return;
      }
      if (limit == 0) {
        alert("Limit cannot be zero");
        return;
      }

      const response = await axios.post(
        VITE_BASE_URL + "/api/meeting/create-meeting",
        {
          hostId: user._id,
          meetingType,
          invitedStudents,
          enableInvites,
          title: roomID,
          password,
          dateTime,
          limit,
        }
      );
      alert("Room created!");
      navigate(`/view-room/${response?.data?._id}`);
    } catch (error) {
      console.log(error);
      alert(error?.response?.data.message || error?.message);
    }
  };
  return (
    <div className="">
      <div className="flex p-20  justify-center items-center h-full bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Create a Meeting
          </h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Meeting Type
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                onChange={(e) => setMeetingType(e.target.value)}
                value={meetingType}
              >
                <option value="instant">Instant Meeting</option>
                <option value="scheduled">Scheduled Meeting</option>
              </select>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="meetingTitle"
              >
                Meeting Title
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="meetingTitle"
                value={roomID}
                onChange={(e) => setRoomID(e.target.value)}
                type="text"
                placeholder="Enter Meeting Title"
                required
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password (Optional)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
              />
            </div>
            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="limit"
              >
                Limit (Optional)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="limit"
                type="number"
                value={limit}
                onChange={(e) => setLimit(e.target.value)}
                placeholder="Enter Password"
              />
            </div>
            {meetingType === "scheduled" && (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    onChange={(e) => setDateTime(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    onChange={(e) => setDateTime(e.target.value)}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  />
                </div>
              </>
            )}
            <div className="">
              <label htmlFor="">Allow only students to join</label>
              <input
                type="checkbox"
                className="ml-2"
                onChange={(e) => setEnableInvites(e.target.checked)}
              />
            </div>

            {enableInvites && (
              <div className="mb-4">
                <div className="">
                  <TextField addStudent={setInvitedStudents} />
                </div>
                <div className="flex gap-1">
                  {invitedStudents.map((student, index) => (
                    <div
                      key={index}
                      className="mb-2 bg-accent rounded-2xl px-2 py-0.5"
                    >
                      {student}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="flex items-center justify-center">
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Create Meeting
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Share Room ID with students so they can join.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const TextField = ({ addStudent }) => {
  const [value, setValue] = useState("");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const handleAddStudent = () => {
    if (value.trim() !== "" && emailRegex.test(value)) {
      addStudent((e) => [...e, value]);
      setValue("");
    }
  };

  return (
    <div className="flex items-start justify-start m-1">
      <div className="rounded-lg bg-gray-200 p-2">
        <div className="flex cursor-pointer">
          <div
            onClick={handleAddStudent}
            className="flex w-10 items-center justify-center rounded-tl-lg rounded-bl-lg border-r border-gray-200 bg-white "
          >
            <img
              width="50"
              height="50"
              src="https://img.icons8.com/ios/50/add--v1.png"
              alt="add--v1"
            />
          </div>
          <input
            type="email"
            onChange={(e) => {
              setValue(e.target.value);
            }}
            className="w-full  bg-white pl-2 text-base font-semibold outline-0"
            placeholder="Enter email of student"
            id=""
          />
        </div>
      </div>
    </div>
  );
};
