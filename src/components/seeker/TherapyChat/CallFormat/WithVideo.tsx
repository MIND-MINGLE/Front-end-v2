"use client";
import MicOffIcon from "@mui/icons-material/MicOff";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import TwilioVideo from "twilio-video";
import { VideoCall } from "../../../../api/Twilio/TwilioApi";

const NoVideo: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);
  const [room, setRoom] = useState<TwilioVideo.Room | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [audioConnected, setAudioConnected] = useState(false);
  const [remoteAudioDetected, setRemoteAudioDetected] = useState(false);
  const [cameraPermissionGranted, setCameraPermissionGranted] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  const [localTrack, setLocalTrack] = useState<TwilioVideo.LocalVideoTrack | null>(null); // Lưu track video cục bộ
  const maxRetries = 3;
  const retryDelay = 5000;

  // Kiểm tra quyền micro và camera khi component mount
  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setMicPermissionGranted(true);
        console.log("Micro hoạt động bình thường.");
        stream.getTracks().forEach(track => track.stop()); // Dừng stream sau khi kiểm tra
      } catch (err) {
        setError("Không thể truy cập micro: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
      }
    };

    checkPermissions();
  }, []);

  // Thiết lập kết nối Twilio
  useEffect(() => {
    const connectTwilio = async () => {
      if (room || isConnected || isConnecting || retryCount >= maxRetries || !micPermissionGranted) {
        console.log("Không thể kết nối: ", { room, isConnected, isConnecting, retryCount, micPermissionGranted });
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
          roomNum: "room-1",
        });
        console.log("Twilio token:", token);

        const roomInstance = await TwilioVideo.connect(token, {
          name: "room-1",
          audio: true,
          video: false,
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

        roomInstance.on("participantConnected", (participant: TwilioVideo.Participant) => {
          console.log(`${participant.identity} đã tham gia phòng`);
          participant.on("trackSubscribed", (track: TwilioVideo.RemoteTrack) => {
            if (track.kind === "audio" && remoteAudioRef.current) {
              (track as TwilioVideo.RemoteAudioTrack).attach(remoteAudioRef.current);
              setRemoteAudioDetected(true);
              console.log("Track audio từ xa đã được subscribe.");
            }
          });

          participant.on("trackUnsubscribed", (track: TwilioVideo.RemoteTrack) => {
            if (track.kind === "audio") {
              setRemoteAudioDetected(false);
              console.log("Track audio từ xa đã bị unsubscribed.");
            }
          });
        });

        roomInstance.on("participantDisconnected", (participant: TwilioVideo.Participant) => {
          console.log(`${participant.identity} đã rời phòng`);
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
  }, [micPermissionGranted]);

  // Retry logic
  useEffect(() => {
    if (retryCount > 0 && retryCount < maxRetries && !isConnected && !isConnecting) {
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
              roomNum: "room-1",
            });

            const roomInstance = await TwilioVideo.connect(token, {
              name: "room-1",
              audio: true,
              video: false,
            });

            setRoom(roomInstance);
            setIsConnected(true);
            setError(null);
            setRetryCount(0);
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
    }
  }, [retryCount, isConnected, isConnecting]);

  // Yêu cầu quyền camera
  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      setCameraPermissionGranted(true);
      console.log("Quyền truy cập camera đã được cấp.");
      stream.getTracks().forEach(track => track.stop()); // Dừng stream sau khi kiểm tra
    } catch (err) {
      setError("Không thể truy cập camera: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
    }
  };

  // Bật/tắt video
  const toggleVideo = async () => {
    if (!room || !cameraPermissionGranted) {
      console.log("Không thể bật video: Phòng chưa kết nối hoặc chưa cấp quyền camera.");
      return;
    }

    if (isVideoOn) {
      console.log("Tắt video...");
      room.localParticipant.videoTracks.forEach((publication) => {
        publication.track.disable();
        publication.track.stop();
        if (localVideoRef.current) localVideoRef.current.srcObject = null;
      });
      setLocalTrack(null);
      setIsVideoOn(false);
    } else {
      console.log("Bật video...");
      try {
        const track = await TwilioVideo.createLocalVideoTrack();
        console.log("Local video track created:", track);
        await room.localParticipant.publishTrack(track);
        console.log("Luồng video đã được publish.");
        setLocalTrack(track); // Lưu track để gắn sau khi thẻ <video> render
        setIsVideoOn(true);
      } catch (err) {
        console.error("Lỗi khi bật video:", err);
        setError("Không thể bật video: " + (err instanceof Error ? err.message : "Lỗi không xác định"));
      }
    }
  };

  // Gắn track video sau khi thẻ <video> được render
  useEffect(() => {
    if (isVideoOn && localTrack && localVideoRef.current) {
      localTrack.attach(localVideoRef.current);
      console.log("Luồng video đã được gắn vào localVideoRef.");
    } else if (isVideoOn && !localVideoRef.current) {
      console.error("localVideoRef.current không tồn tại khi isVideoOn = true.");
      setError("Không thể hiển thị video: Thẻ video không tồn tại.");
    }
  }, [isVideoOn, localTrack]);

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
    if (room) {
      console.log("Ngắt kết nối phòng Twilio.");
      room.disconnect();
      cleanup();
    }
  };

  const cleanup = () => {
    console.log("Dọn dẹp trạng thái...");
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
    setRoom(null);
    setIsConnected(false);
    setIsVideoOn(false);
    setAudioConnected(false);
    setRemoteAudioDetected(false);
    setLocalTrack(null);
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
          background: "black",
        }}
      >
        {isVideoOn ? (
          <video
            ref={localVideoRef}
            autoPlay
            muted
            style={{
              width: "40%",
              height: "100%",
              objectFit: "cover",
              position: "relative",
              zIndex: 2,
              borderRadius: "8px",
              background: "black",
            }}
          />
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
          onClick={toggleVideo}
          disabled={!isConnected || !cameraPermissionGranted}
          sx={{
            backgroundColor: isVideoOn ? "green" : "#00000030",
            borderRadius: "50%",
            width: 48,
            height: 48,
            "&:hover": { backgroundColor: isVideoOn ? "#00cc00" : "#00000050" },
          }}
        >
          <VideocamIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      </Box>

      {!cameraPermissionGranted && (
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

export default NoVideo;