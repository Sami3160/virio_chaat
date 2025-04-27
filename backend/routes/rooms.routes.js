const router = require("express").Router();
const { joinRoom, createRoom, getRooms,getAllRooms } = require("../controller/rooms.controller");

router.post("/create-meeting", createRoom);
router.post("/:roomId/join", joinRoom);
router.get("/all-rooms", getAllRooms);
router.get("/:roomId", getRooms);
router.post("/:roomId/chat", (req, res) => {});
router.get("/:roomId/messages", (req, res) => {});
router.post("/:roomId/raise-hands", (req, res) => {});
router.post("/:roomId/mute-students", (req, res) => {});
router.post("/:roomId/approve-students", (req, res) => {});
router.delete("/:roomId/leave", (req, res) => {});
router.delete("/:roomId", (req, res) => {});

module.exports = router;
