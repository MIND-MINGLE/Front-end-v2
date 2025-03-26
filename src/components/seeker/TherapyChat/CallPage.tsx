import MicOffIcon from "@mui/icons-material/MicOff";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TwilioVideo from "twilio-video";
import { VideoCall } from "../../../api/Twilio/TwilioApi";

interface CallPageProps {
  format: "call" | "video"|null; // "call" cho NoVideo (audio), "video" cho WithVideo
  onFormatChange: (newFormat: "call" | "video") => void; // Callback để thay đổi format
}

const CallPage = ({ format, onFormatChange }: CallPageProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [room, setRoom] = useState<TwilioVideo.Room | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(format === "video");
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [audioConnected, setAudioConnected] = useState(false);
  const [remoteAudioDetected, setRemoteAudioDetected] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [localTrack, setLocalTrack] = useState<TwilioVideo.LocalVideoTrack | null>(null);
  const [callEnded, setCallEnded] = useState(false);
  const [roomNum, setRoomNum] = useState<string>("");
  const [remoteParticipants, setRemoteParticipants] = useState<
    Array<{
      identity: string;
      videoTrack: TwilioVideo.RemoteVideoTrack | null;
      videoRef: React.RefObject<HTMLVideoElement>;
    }>
  >([]); // Danh sách các participant từ xa
  const maxRetries = 3;
  const retryDelay = 5000;
  const ROOM_TIMEOUT = 60 * 60 * 1000; // 1 giờ (tính bằng milliseconds)

  // Hàm tạo roomNum mới
  const generateRoomNum = () => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `room-${timestamp}-${randomString}`;
  };

  // Kiểm tra và thiết lập roomNum
  useEffect(() => {
    const storedRoomData = sessionStorage.getItem("roomData");
    let newRoomNum = "";
    let lastAccessTime = 0;

    if (storedRoomData) {
      const { roomNum: storedRoomNum, lastAccessTime: storedLastAccessTime } = JSON.parse(storedRoomData);
      newRoomNum = storedRoomNum;
      lastAccessTime = storedLastAccessTime;

      const currentTime = Date.now();
      const timeDiff = currentTime - lastAccessTime;

      if (timeDiff > ROOM_TIMEOUT) {
        console.log("Phòng đã hết hạn, tạo roomNum mới...");
        newRoomNum = generateRoomNum();
      }
    } else {
      console.log("Không tìm thấy roomData, tạo roomNum mới...");
      newRoomNum = generateRoomNum();
    }

    sessionStorage.setItem(
      "roomData",
      JSON.stringify({
        roomNum: newRoomNum,
        lastAccessTime: Date.now(),
      })
    );

    setRoomNum(newRoomNum);
    console.log("RoomNum được sử dụng:", newRoomNum);
  }, []);

  // Kiểm tra quyền micro khi component mount
  useEffect(() => {
    const checkMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionGranted(true);
        console.log("Micro hoạt động bình thường.");
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        setError("Không thể truy cập micro: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
      }
    };

    checkMic();
  }, []);

  // Thiết lập kết nối Twilio
  useEffect(() => {
    const connectTwilio = async () => {
      if (room || isConnected || isConnecting || retryCount >= maxRetries || !micPermissionGranted || callEnded || !roomNum) {
        console.log("Không thể kết nối:", { room, isConnected, isConnecting, retryCount, micPermissionGranted, callEnded, roomNum });
        return;
      }

      setIsConnecting(true);
      try {
        const userData = sessionStorage.getItem("account");
        if (!userData) {
          throw new Error("Không tìm thấy account trong sessionStorage!");
        }
        const user = JSON.parse(userData);
        const userId = user.UserId;

        const token = await VideoCall({
          userId: userId,
          roomNum: roomNum,
        });
        console.log("Twilio token:", token);

        const roomInstance = await TwilioVideo.connect(token, {
          name: roomNum,
          audio: true,
          video: format === "video",
        }).catch((err) => {
          console.error("Lỗi khi kết nối với Twilio:", err);
          if (err.message.includes("WebSocket")) {
            throw new Error("Lỗi WebSocket: Không thể kết nối với server Twilio. Vui lòng kiểm tra mạng.");
          }
          throw err;
        });

        console.log("Phòng Twilio đã kết nối:", roomInstance);
        setRoom(roomInstance);
        setIsConnected(true);
        setError(null);
        setRetryCount(0);

        const localAudioTrack = roomInstance.localParticipant.audioTracks.size > 0;
        if (localAudioTrack) {
          setAudioConnected(true);
          console.log("Track audio cục bộ đã được publish.");
        } else {
          setError("Không thể publish track audio cục bộ.");
        }

        if (format === "video") {
          const track = await TwilioVideo.createLocalVideoTrack();
          console.log("Local video track created:", track);
          await roomInstance.localParticipant.publishTrack(track);
          console.log("Luồng video đã được publish.");
          setLocalTrack(track);
          setIsVideoOn(true);
        }

        // Thêm các participant hiện có trong phòng (nếu có)
        const existingParticipants = Array.from(roomInstance.participants.values());
        existingParticipants.forEach((participant: TwilioVideo.Participant) => {
          const videoTrack = Array.from(participant.videoTracks.values())[0]?.track || null;
          if (videoTrack) {
            setRemoteParticipants((prev) => [
              ...prev,
              {
                identity: participant.identity,
                videoTrack: videoTrack as TwilioVideo.RemoteVideoTrack,
                videoRef: React.createRef<HTMLVideoElement>(),
              },
            ]);
          }
        });

        roomInstance.on("participantConnected", (participant: TwilioVideo.Participant) => {
          console.log(`${participant.identity} đã tham gia phòng`);
          setRemoteParticipants((prev) => [
            ...prev,
            {
              identity: participant.identity,
              videoTrack: null,
              videoRef: React.createRef<HTMLVideoElement>(),
            },
          ]);

          participant.on("trackSubscribed", (track: TwilioVideo.RemoteTrack) => {
            if (track.kind === "audio" && remoteAudioRef.current) {
              (track as TwilioVideo.RemoteAudioTrack).attach(remoteAudioRef.current);
              setRemoteAudioDetected(true);
              console.log("Track audio từ xa đã được subscribe.");
            }
            if (track.kind === "video") {
              setRemoteParticipants((prev) =>
                prev.map((p) =>
                  p.identity === participant.identity
                    ? { ...p, videoTrack: track as TwilioVideo.RemoteVideoTrack }
                    : p
                )
              );
              console.log(`Track video từ xa của ${participant.identity} đã được subscribe.`);
            }
          });

          participant.on("trackUnsubscribed", (track: TwilioVideo.RemoteTrack) => {
            if (track.kind === "audio") {
              setRemoteAudioDetected(false);
              console.log("Track audio từ xa đã bị unsubscribed.");
            }
            if (track.kind === "video") {
              setRemoteParticipants((prev) =>
                prev.map((p) =>
                  p.identity === participant.identity ? { ...p, videoTrack: null } : p
                )
              );
              console.log(`Track video từ xa của ${participant.identity} đã bị unsubscribed.`);
            }
          });
        });

        roomInstance.on("participantDisconnected", (participant: TwilioVideo.Participant) => {
          console.log(`${participant.identity} đã rời phòng`);
          setRemoteParticipants((prev) => prev.filter((p) => p.identity !== participant.identity));
          setRemoteAudioDetected(false);
          if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
        });

        roomInstance.on("disconnected", () => {
          console.log("Phòng Twilio đã ngắt kết nối.");
          cleanup();
          setIsConnected(false);
          setIsConnecting(false);
          setAudioConnected(false);
          setRemoteAudioDetected(false);
          setRetryCount((prev) => prev + 1);
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định";
        console.error("Lỗi trong connectTwilio:", errorMessage);
        setError(`Không thể kết nối: ${errorMessage}`);
        setIsConnected(false);
        setRetryCount((prev) => prev + 1);
      } finally {
        setIsConnecting(false);
      }
    };

    connectTwilio();

    return () => {
      if (room) {
        console.log("Ngắt kết nối phòng Twilio khi component unmount.");
        room.disconnect();
      }
    };
  }, [micPermissionGranted, format, callEnded, roomNum]);

  // Retry logic
  useEffect(() => {
    if (callEnded || retryCount >= maxRetries || isConnected || isConnecting) {
      console.log("Không thực hiện retry:", { callEnded, retryCount, isConnected, isConnecting });
      return;
    }

    console.log(`Thử lại lần ${retryCount + 1}/${maxRetries}...`);
    const timer = setTimeout(() => {
      setError(null);
      setIsConnecting(true);
      const connectTwilio = async () => {
        try {
          const userData = sessionStorage.getItem("account");
          if (!userData) {
            throw new Error("Không tìm thấy account trong sessionStorage!");
          }
          const user = JSON.parse(userData);
          const userId = user.UserId;

          const token = await VideoCall({
            userId: userId,
            roomNum: roomNum,
          });

          const roomInstance = await TwilioVideo.connect(token, {
            name: roomNum,
            audio: true,
            video: format === "video",
          });

          setRoom(roomInstance);
          setIsConnected(true);
          setError(null);
          setRetryCount(0);
          setCallEnded(false);
        } catch (err) {
          const errorMessage = err instanceof Error ? err.message : "Lỗi không xác định";
          if (errorMessage.includes("WebSocket")) {
            setError("Lỗi WebSocket: Không thể kết nối với server Twilio. Đang thử lại...");
          } else {
            setError(`Thử lại lần ${retryCount + 1} thất bại: ${errorMessage}`);
          }
          setRetryCount((prev) => prev + 1);
        } finally {
          setIsConnecting(false);
        }
      };
      connectTwilio();
    }, retryDelay);

    return () => clearTimeout(timer);
  }, [retryCount, isConnected, isConnecting, format, callEnded, roomNum]);

  // Gắn track video cho các participant từ xa
  useEffect(() => {
    remoteParticipants.forEach((participant) => {
      if (participant.videoTrack && participant.videoRef.current) {
        participant.videoTrack.attach(participant.videoRef.current);
        participant.videoRef.current.play().catch(err => {
          console.error(`Lỗi khi phát video của ${participant.identity}:`, err);
          setError(`Không thể phát video của ${participant.identity}: ${err.message}`);
        });
      }
    });

    if (format === "video" && localTrack && localVideoRef.current) {
      localTrack.attach(localVideoRef.current);
      console.log("Luồng video cục bộ đã được gắn vào localVideoRef.");
      localVideoRef.current.play().catch(err => {
        console.error("Lỗi khi phát video cục bộ:", err);
        setError("Không thể phát video cục bộ: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
      });
    }
  }, [format, localTrack, remoteParticipants]);

  // Yêu cầu quyền camera
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermissionGranted(true);
      console.log("Quyền truy cập camera đã được cấp.");
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setError("Không thể truy cập camera: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
    }
  };

  // Xử lý chuyển đổi giữa audio và video
  const toggleFormat = async () => {
    if (!room || !cameraPermissionGranted) {
      console.log("Không thể chuyển chế độ: Phòng chưa kết nối hoặc chưa cấp quyền camera.");
      return;
    }

    if (format === "call") {
      console.log("Chuyển sang chế độ video...");
      try {
        const localTrack = await TwilioVideo.createLocalVideoTrack();
        console.log("Local video track created:", localTrack);
        await room.localParticipant.publishTrack(localTrack);
        console.log("Luồng video đã được publish.");
        setLocalTrack(localTrack);
        setIsVideoOn(true);
        onFormatChange("video");
      } catch (err) {
        console.error("Lỗi khi chuyển sang chế độ video:", err);
        setError("Không thể bật video: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
      }
    } else {
      console.log("Chuyển sang chế độ audio...");
      if (localTrack) {
        localTrack.disable();
        localTrack.stop();
        room.localParticipant.unpublishTrack(localTrack);
      }
      setRemoteParticipants((prev) =>
        prev.map((p) => {
          if (p.videoRef.current) p.videoRef.current.srcObject = null;
          return { ...p, videoTrack: null };
        })
      );
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
      setLocalTrack(null);
      setIsVideoOn(false);
      onFormatChange("call");
    }
  };

  const toggleMic = () => {
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        if (isMicOn) publication.track.disable();
        else publication.track.enable();
      });
      setIsMicOn(!isMicOn);
    }
  };

  const disconnectCall = () => {
    console.log("Kết thúc cuộc gọi...");
    if (room) {
      room.localParticipant.audioTracks.forEach((publication) => {
        console.log("Dừng track audio cục bộ:", publication.track);
        publication.track.disable();
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      room.localParticipant.videoTracks.forEach((publication) => {
        console.log("Dừng track video cục bộ:", publication.track);
        publication.track.disable();
        publication.track.stop();
        room.localParticipant.unpublishTrack(publication.track);
      });

      console.log("Ngắt kết nối phòng Twilio...");
      room.disconnect();
    }

    cleanup();
    setCallEnded(true);
    onFormatChange("call");

    const storedRoomData = sessionStorage.getItem("roomData");
    if (storedRoomData) {
      const roomData = JSON.parse(storedRoomData);
      sessionStorage.setItem(
        "roomData",
        JSON.stringify({
          ...roomData,
          lastAccessTime: Date.now(),
        })
      );
    }
  };

  const cleanup = () => {
    console.log("Dọn dẹp trạng thái...");
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setRemoteParticipants([]);
    setRoom(null);
    setIsConnected(false);
    setIsConnecting(false);
    setIsVideoOn(false);
    setAudioConnected(false);
    setRemoteAudioDetected(false);
    setLocalTrack(null);
    setRetryCount(0);
    setError(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#dff6ff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "60%",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          background: "black",
        }}
      >
        {format === "video" ? (
          <>
            {/* Video cục bộ */}
            <Box
              sx={{
                width: "40%",
                height: "100%",
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              {!isConnected && (
                <Box
                  component="img"
                  sx={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    objectFit: "cover",
                    filter: "brightness(0.85)",
                    zIndex: 1,
                  }}
                  alt="Video Call Background"
                  src="/cat.png"
                />
              )}
              <video
                ref={localVideoRef}
                autoPlay
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "relative",
                  zIndex: 2,
                  background: "black",
                }}
              />
            </Box>

            {/* Video của tất cả participant từ xa */}
            {remoteParticipants.map((participant) => (
              <Box
                key={participant.identity}
                sx={{
                  width: "40%",
                  height: "100%",
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  background: "black",
                }}
              >
                <video
                  ref={participant.videoRef}
                  autoPlay
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "relative",
                    zIndex: 2,
                    background: "black",
                  }}
                />
                <Typography
                  sx={{
                    position: "absolute",
                    bottom: 10,
                    left: 10,
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    fontSize: "14px",
                  }}
                >
                  {participant.identity}
                </Typography>
              </Box>
            ))}
          </>
        ) : (
          <Box
            component="img"
            sx={{
              width: 127,
              height: 129,
              borderRadius: "50%",
            }}
            alt="Call Avatar"
            src="/callava.png"
          />
        )}
      </Box>

      <audio ref={remoteAudioRef} autoPlay style={{ display: "none" }} />

      <Box display="flex" justifyContent="center" alignItems="center" gap={3} mt={3} mb={2}>
        <IconButton
          onClick={toggleMic}
          disabled={!isConnected}
          sx={{
            backgroundColor: isMicOn ? "#00000030" : "#ff4040",
            borderRadius: "50%",
            width: 48,
            height: 48,
            "&:hover": { backgroundColor: isMicOn ? "#00000050" : "#ff6060" },
          }}
        >
          <MicOffIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
        <IconButton
          onClick={disconnectCall}
          disabled={!isConnected}
          sx={{
            backgroundColor: "#ff4040",
            borderRadius: "50%",
            width: 48,
            height: 48,
            "&:hover": { backgroundColor: "#ff6060" },
          }}
        >
          <PhoneIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
        <IconButton
          onClick={toggleFormat}
          disabled={!isConnected || (format === "video" ? false : !cameraPermissionGranted)}
          sx={{
            backgroundColor: format === "video" ? "green" : "#00000030",
            borderRadius: "50%",
            width: 48,
            height: 48,
            "&:hover": { backgroundColor: format === "video" ? "#00cc00" : "#00000050" },
          }}
        >
          <VideocamIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      </Box>

      {!cameraPermissionGranted && format === "call" && (
        <Box mt={2}>
          <IconButton onClick={requestCameraPermission} sx={{ backgroundColor: "green", color: "white" }}>
            <VideocamIcon />
            <Typography ml={1}>Cấp quyền camera</Typography>
          </IconButton>
        </Box>
      )}

      <Box display="flex" flexDirection="column" alignItems="center" mt={2} color="white">
        {isConnected ? (
          <>
            <Typography variant="h6" fontWeight="bold">
              John Doe
            </Typography>
            <Typography variant="body2" fontStyle="italic" color="#e0e0e0">
              {audioConnected
                ? remoteAudioDetected
                  ? "Đang nghe được giọng nói"
                  : "Đã kết nối audio, chờ giọng nói..."
                : "Audio chưa kết nối"}
            </Typography>
          </>
        ) : (
          <Typography variant="body2" color="white" mt={2}>
            {isConnecting
              ? "Đang kết nối..."
              : retryCount >= maxRetries
                ? "Không thể kết nối sau nhiều lần thử."
                : "Đang chờ kết nối..."}
          </Typography>
        )}
      </Box>

      {error && (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default CallPage;