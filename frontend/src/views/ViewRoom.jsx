import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import {useUser} from '../context/UserContext'
import axios from 'axios'
const VITE_API_BASE=import.meta.env.VITE_API_BASE
export default function ViewRoom() {
    const {roomId}=useParams();
    const {user}=useUser()
    const [roomInfo, setRoomInfo]=useState(null)
    useEffect(()=>{
        const fetchRoom= async ()=>{
            try {
                console.log(roomId)
                const response=await axios.get(`${VITE_API_BASE}/api/meeting/${roomId}`)
                setRoomInfo(response.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchRoom()
    },[])
  return (
    <div>
        <div className="">Join Meeting</div>
        
    </div>
  )
}
