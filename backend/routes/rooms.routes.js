const router=require('express').Router();
const {joinRoom} =require('../controller/rooms.controller')

router.get('/:roomId', (req, res)=>{})
router.post('/:roomId/join', joinRoom)
router.post('/:roomId/chat', (req, res)=>{})
router.get('/:roomId/messages', (req, res)=>{})
router.post('/:roomId/raise-hands', (req, res)=>{})
router.post('/:roomId/mute-students', (req, res)=>{})
router.post('/:roomId/approve-students', (req, res)=>{})
router.delete('/:roomId/leave', (req, res)=>{})
router.delete('/:roomId', (req, res)=>{})

module.exports=router