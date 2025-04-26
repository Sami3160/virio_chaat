const { RtcTokenBuilder, RtcRole } = require("agora-access-token");
const Room = require("../models/Room.model");
const joinRoom = async(req, res) => {
  const { roomId } = req.params;
  const { uid, role } = req.body; // role = 'host' or 'student'
  try {
    const exists=await Room.findOne({roomId})
    if(!exists){
      return res.status(404).json({message:'Room not found'})
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

    res.json({ token, appId, channelName: roomId, uid });
  } catch (error) {
    res.status(500).json({message:'Internal server error'})
  }
};

const createRoom = async (req, res) => {
  const { hostId, topic, time, limit } = req.body;
  try {
    const resposnse = await Room.create({ hostId, topic, time, limit });
    res.status(201).json(resposnse);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { joinRoom };
