import axios from "axios";
import { headers } from "../Url"; // Giả định headers được định nghĩa trong file Url

interface VideoCallProps {
  userId: string;
  roomNum: string;
}

const videocallURL = "https://mindmingle.azurewebsites.net/api/Twilio/CallRoomToken";

async function VideoCall({ userId, roomNum }: VideoCallProps) {
  try {
    const response = await axios.post(
      videocallURL,
      {
        identity: userId,
        room: roomNum,
      },
      {
        headers: {
          ...headers, // Kết hợp headers từ Url.ts nếu có
          Accept: "*/*",
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Token from API:", response.data.result);
    return response.data.result; // Trả về token trực tiếp
  } catch (error) {
    console.error("Error fetching Twilio token:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi hàm
  }
}

export { VideoCall };