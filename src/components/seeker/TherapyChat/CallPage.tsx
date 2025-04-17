import { useEffect, useRef, useState } from "react";
import { HubConnection } from "@microsoft/signalr";
import { connectToChatHub } from "../../../api/SignalR/SignalRAPI";
import { Box, IconButton, Typography } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";

interface CallPageProps {
  format: "call" | "video" | null;
  onFormatChange: (newFormat: "call" | "video") => void;
  groupId: string;
  setShrink: () => void;
}

const CallPage = ({ setShrink,format: initialFormat, onFormatChange, groupId }: CallPageProps) => {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [peerConnection, setPeerConnection] = useState<RTCPeerConnection | null>(null);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(initialFormat === "video");
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [otherUserId, setOtherUserId] = useState<string | null>(null);

  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      // Replace with your TURN server credentials
      {
        urls: "turn:your-turn-server:3478",
        username: "your-username",
        credential: "your-password",
      },
    ],
  };

  const getFriendlyError = (err: string) => {
    if (err.includes("Media error")) return "Please allow camera and microphone access.";
    if (err.includes("SignalR error")) return "Connection issue. Please try again.";
    if (err.includes("ICE error")) return "Network issue. Check your connection and try again.";
    return "An error occurred. Please try again.";
  };

  useEffect(() => {
    // Check subscription (from MindMingle Premium/Plus discussion)
    const packageName = sessionStorage.getItem("package");
    const role = localStorage.getItem("role");
    if (role==="seeker"&&(!packageName || packageName === "")) {
      setError("Video calls require a Premium or Plus subscription.");
      return;
    }

    const pc = new RTCPeerConnection(configuration);
    setPeerConnection(pc);

    const initializeSignalR = async () => {
      try {
        const conn = await connectToChatHub(
          () => {},
          (err) => setError(getFriendlyError("SignalR error: " + (err.message || "Unknown")))
        );

        if (conn) {
          setConnection(conn);

          // Handle SignalR reconnection
          conn.onreconnected(async () => {
            await conn.invoke("JoinGroup", groupId);
            setError(null);
            console.log("Reconnected to SignalR and rejoined group:", groupId);
          });

          conn.on("UserConnected", (userId: string) => {
            if (userId !== conn.connectionId) {
              setOtherUserId(userId);
              if (!isConnected) startCall(pc, conn);
            }
          });

          conn.on("UserDisconnected", (userId: string) => {
            if (userId === otherUserId) {
              setIsConnected(false);
              setOtherUserId(null);
              cleanup(pc, conn);
            }
          });

          conn.on("ReceiveOffer", async (offer: string, callerId: string) => {
            setOtherUserId(callerId);
            await handleOffer(pc, conn, offer, callerId);
          });

          conn.on("ReceiveAnswer", async (answer: string) => {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription({ type: "answer", sdp: answer }));
              setIsConnected(true);
            } catch (err) {
              console.error("Error setting remote answer:", err);
              setError(getFriendlyError("ICE error: " + (err instanceof Error ? err.message : "Unknown")));
            }
          });

          conn.on("ReceiveCandidate", async (candidate: string) => {
            try {
              const parsedCandidate = JSON.parse(candidate);
              await pc.addIceCandidate(new RTCIceCandidate(parsedCandidate));
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          });

          conn.on("ReceiveVideoState", (videoOn: boolean) => {
            setIsVideoOn(videoOn);
            onFormatChange(videoOn ? "video" : "call");
          });

          await conn.invoke("JoinGroup", groupId);
          console.log(`Joined group: ${groupId}`);
        } else {
          setError(getFriendlyError("Không thể kết nối SignalR"));
        }
      } catch (err) {
        console.error("SignalR initialization error:", err);
        setError(getFriendlyError("SignalR error: " + (err instanceof Error ? err.message : "Unknown")));
      }
    };

    initializeSignalR();

    pc.onicecandidate = (event) => {
      if (event.candidate && connection?.state === "Connected") {
        connection.invoke("SendCandidate", groupId, JSON.stringify(event.candidate));
      }
    };

    pc.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    pc.oniceconnectionstatechange = () => {
      console.log("ICE connection state:", pc.iceConnectionState);
      if (pc.iceConnectionState === "failed" || pc.iceConnectionState === "disconnected") {
        setError(getFriendlyError("ICE error: Connection failed"));
        setIsConnected(false);
      }
    };

    return () => {
      cleanup(pc, connection);
    };
  }, [groupId]);

  const startCall = async (pc: RTCPeerConnection, conn: HubConnection) => {
    setIsLoading(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideoOn ? { width: 640 } : false,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log("Added track:", track.kind);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      conn.invoke("SendOffer", groupId, offer.sdp);
      conn.invoke("SendVideoState", groupId, isVideoOn);
    } catch (err) {
      console.error("Start call error:", err);
      setError(getFriendlyError("Media error: " + (err instanceof Error ? err.message : "Unknown")));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOffer = async (pc: RTCPeerConnection, conn: HubConnection, offer: string, callerId: string) => {
    setIsLoading(true);
    try {
      if (pc.signalingState !== "stable") {
        await pc.setLocalDescription({ type: "rollback" });
      }

      await pc.setRemoteDescription(new RTCSessionDescription({ type: "offer", sdp: offer }));
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: isVideoOn ? { width: 640 } : false,
      });
      setLocalStream(stream);
      stream.getTracks().forEach((track) => {
        pc.addTrack(track, stream);
        console.log("Added track:", track.kind);
      });
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      conn.invoke("SendAnswer", groupId, answer.sdp, callerId);
      conn.invoke("SendVideoState", groupId, isVideoOn);
      setIsConnected(true);
    } catch (err) {
      console.error("Handle offer error:", err);
      setError(getFriendlyError("Offer handling error: " + (err instanceof Error ? err.message : "Unknown")));
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMic = () => {
    if (localStream) {
      localStream.getAudioTracks().forEach((track) => (track.enabled = !isMicOn));
      setIsMicOn(!isMicOn);
    }
  };

  const toggleVideo = async () => {
    if (!peerConnection || !connection || !isConnected) return;

    setIsLoading(true);
    try {
      if (isVideoOn) {
        localStream?.getVideoTracks().forEach((track) => {
          track.stop();
          peerConnection.getSenders().forEach((sender) => {
            if (sender.track?.kind === "video") {
              peerConnection.removeTrack(sender);
            }
          });
        });
        setLocalStream((prev) => new MediaStream(prev ? prev.getAudioTracks() : []));
        setIsVideoOn(false);
        onFormatChange("call");
      } else {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640 } });
        stream.getVideoTracks().forEach((track) => peerConnection.addTrack(track, stream));
        setLocalStream((prev) => {
          const newStream = new MediaStream([...(prev?.getTracks() || []), ...stream.getTracks()]);
          if (localVideoRef.current) localVideoRef.current.srcObject = newStream;
          return newStream;
        });
        setIsVideoOn(true);
        onFormatChange("video");
      }

      // Renegotiate
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      connection.invoke("SendOffer", groupId, offer.sdp);
      connection.invoke("SendVideoState", groupId, !isVideoOn);
    } catch (err) {
      console.error("Toggle video error:", err);
      setError(getFriendlyError("Video toggle error: " + (err instanceof Error ? err.message : "Unknown")));
    } finally {
      setIsLoading(false);
    }
  };

  const cleanup = (pc: RTCPeerConnection | null, conn: HubConnection | null) => {
    localStream?.getTracks().forEach((track) => track.stop());
    pc?.close();
    conn?.stop();
    setIsConnected(false);
    setLocalStream(null);
    setOtherUserId(null);
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    console.log("Cleaned up WebRTC and SignalR");
  };

  const handleHangup = () => {
    if (window.confirm("End the call?")) {
      cleanup(peerConnection, connection);
      setShrink;
    }
  };

  return (
    <Box sx={{ width: "100%", height: "100vh", display: "flex", flexDirection: "column", bgcolor: "#dff6ff"}}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", bgcolor: "black", gap: 2 }}>
        <Box sx={{ width: "40%", height: "100%", position: "relative" }}>
          <video ref={localVideoRef} autoPlay muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Typography sx={{ position: "absolute", bottom: 10, left: 10, color: "white" }}>You</Typography>
        </Box>
        <Box sx={{ width: "40%", height: "100%", position: "relative" }}>
          <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <Typography sx={{ position: "absolute", bottom: 10, left: 10, color: "white" }}>Remote</Typography>
        </Box>
      </Box>

      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, my: 3 }}>
        <IconButton onClick={toggleMic} disabled={!isConnected}>
          {isMicOn ? <MicIcon /> : <MicOffIcon />}
        </IconButton>
        <IconButton onClick={handleHangup} disabled={!connection}>
          <PhoneIcon color={isConnected ? "error" : "inherit"} />
        </IconButton>
        <IconButton onClick={toggleVideo} disabled={!isConnected}>
          {isVideoOn ? <VideocamIcon /> : <VideocamOffIcon />}
        </IconButton>
      </Box>

      {error && <Typography color="error" sx={{ textAlign: "center" }}>{error}</Typography>}
      {isLoading && <Typography sx={{ textAlign: "center" }}>Connecting...</Typography>}
      <Typography sx={{ textAlign: "center", mb: 2 }}>
        {isConnected ? "Connected" : otherUserId ? "Waiting for call..." : "Waiting for other user..."}
      </Typography>
    </Box>
  );
};

export default CallPage;