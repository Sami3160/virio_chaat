const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const Room = require("../models/Room.model");
const User = require("../models/Users.model");
const joinRoom = async (req, res) => {
  const { roomId } = req.params;
  const { uid, role } = req.body; // role = 'host' or 'student'
  try {
    console.log({roomId, uid, role})
    const exists = await Room.findOne({_id: roomId });
    if (!exists) {
      return res.status(404).json({ message: "Room not found" });
    }
    const appId = process.env.AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;
    const expireTimeSeconds = 3600; // token valid for 1 hour

    const agoraRole = role === "host" ? RtcRole.PUBLISHER : RtcRole.SUBSCRIBER;
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const privilegeExpiredTs = currentTimestamp + expireTimeSeconds;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      roomId,
      uid,
      agoraRole,
      privilegeExpiredTs
    );

    res.status(200).json({ token, appId, channelName: roomId, uid });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
  }
};

const createRoom = async (req, res) => {
  const {
    hostId,
    meetingType,
    invitedStudents,
    enableInvites,
    title,
    password,
    dateTime,
    limit,
  } = req.body;
  try {
    console.log({
      meetingType,
      invitedStudents,
      enableInvites,
      title,
      password,
      dateTime,
      limit,
    });
    const resposnse = await Room.create({
      hostId,
      enableInvites,
      invitedStudents,
      meetingType,
      password,
      dateTime,
      topic: title,
      limit,
    });
    const updateUser = await User.findByIdAndUpdate(
      hostId,
      { $push: { rooms: resposnse._id } },
      { new: true }
    );
    res.status(201).json(resposnse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getRooms = async (req, res) => {
  const { roomId } = req.params;
  console.log(roomId);
  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.status(200).json(room);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};
const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate("hostId", "name");
    if (!rooms) {
      return res.status(404).json({ message: "No rooms found" });
    }
    console.log(rooms)
    res.status(200).json(rooms);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal Server Error" });
  }
};
module.exports = { joinRoom, createRoom, getRooms, getAllRooms };
