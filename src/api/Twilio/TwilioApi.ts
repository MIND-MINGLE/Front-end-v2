import axios from "axios";
import { headers } from "../Url";

interface VideoCallProps{
    userId: string;
    roomNum: string;
}

const videocallURL = "https://localhost:7252/api/Twilio/CallRoomToken?"

  async function VideoCall({ userId, roomNum }: VideoCallProps) {
    const response = await axios.get(videocallURL+`identity=${userId}&room=${roomNum}`,{headers: headers})
    console.log(response.data.result)
    return response
}

export{VideoCall}