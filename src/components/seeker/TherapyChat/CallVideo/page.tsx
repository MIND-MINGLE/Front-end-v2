"use client";
import MicOffIcon from "@mui/icons-material/MicOff"; 
import PhoneIcon from "@mui/icons-material/Phone"; 
import VideocamIcon from "@mui/icons-material/Videocam";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import NavigationRail from "../../NavBar";
import {useEffect,useState,useRef} from "react";
import RightComponents from "./component";
import Link from "next/link";
import {VideoCall} from '@/api/Twilio/TwilioApi';
import Video from "twilio-video";

const TherapyChatPage: React.FC = () => {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [room, setRoom] = useState(null);
    const [participants, setParticipants] = useState([]);
    const localAudioRef = useRef();
  
   useEffect(()=>{
          const fetchTwilio = async () => {
              var response = await VideoCall({
                  userId:"1",
                  roomNum:"1"
              });
              // result is a token sent from the server
              var token = response.data.result
              //console.log(data)
              const newRoom = await Video.connect(token, {
                room: 1,
                audio: true,
                video: !audioOnly // Disable video if audioOnly is true
            });
            setRoom(newRoom);
                setParticipants([...newRoom.participants.values()]);

                // Add event listeners for new participants
                newRoom.on("participantConnected", participant => {
                    setParticipants(prev => [...prev, participant]);
                });

                newRoom.on("participantDisconnected", participant => {
                    setParticipants(prev => prev.filter(p => p !== participant));
                });

                // Get user audio track and attach to audio element
                const localTracks = await Video.createLocalTracks({ audio: true, video: !audioOnly });
                localTracks.forEach(track => newRoom.localParticipant.publishTrack(track));

                if (audioOnly && localTracks.length > 0) {
                    localAudioRef.current.srcObject = new MediaStream(
                        localTracks.map(track => track.mediaStreamTrack)
                    );
                }
            return () => {
                  if (room) {
                      room.disconnect();
                      setRoom(null);
                  }
              };

          }
          fetchTwilio()
      },[])

  return (
    <Box
      width="100%"
      height="100vh"
      border={8}
      borderColor="#cac4d0"
      overflow="hidden"
      position="relative"
      display="flex"
    >
      {/* Video Section */}
      <Box
      sx={{
        width: "100%",
        maxWidth: "590px",
        height: "99vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-150%, -50%)",
        background: "#dff6ff",
        borderRadius: "20px",
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
      }}
    >
      {/* Background image section */}
      <Box
        sx={{
          width: "100%",
          height: "60%",
          position: "relative",
          overflow: "hidden",
        }}
      >
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
          }}
          alt="Video Call Background"
          src="/cat.png"
        />
      </Box>

      {/* Call control icons section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          mt: 3,
          mb: 2,
        }}
      >
        <Link href="/SeekerPage/TherapyChat/CallNoVideo" passHref>
          <IconButton
            sx={{
              backgroundColor: "#27ae60",
              borderRadius: "50%",
              width: 48,
              height: 48,
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "#27ae60",
                transform: "scale(1.1)",
                transition: "0.3s",
              },
            }}
          >
            <VideocamIcon sx={{ color: "white", fontSize: 30 }} />
          </IconButton>
        </Link>

        <IconButton
          sx={{
            backgroundColor: "#00000030",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#00000040",
              transform: "scale(1.1)",
              transition: "0.3s",
            },
          }}
        >
          <MicOffIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>

        <IconButton
          sx={{
            backgroundColor: "#ff4040",
            borderRadius: "50%",
            width: 48,
            height: 48,
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            "&:hover": {
              backgroundColor: "#ff4040",
              transform: "scale(1.1)",
              transition: "0.3s",
            },
          }}
        >
          <PhoneIcon sx={{ color: "white", fontSize: 30 }} />
        </IconButton>
      </Box>

      {/* Participant name and status */}
      <Box display="flex" flexDirection="column" alignItems="center" mt={2} color="white">
        <Typography variant="h6" fontWeight="bold">
          John Doe
        </Typography>
        <Typography variant="body2" fontStyle="italic" color="#e0e0e0">
          Live on call
        </Typography>
      </Box>
    </Box>

      {/* Main Content */}
      <Box
        width="calc(100vw - 379px)"
        height="99vh"
        position="absolute"
        top={0}
        left="649px"
        display="flex"
        flexDirection="column"
      >
        <RightComponents />
      </Box>
      {/* Navigation Sidebar */}
      <Box
        width="88px"
        height="2015px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        pt={2}
        pb={2}
        position="absolute"
        top={0}
        left={0}
        bgcolor="white"
      >
        <NavigationRail />
      </Box>
    </Box>
  );
};

export default TherapyChatPage;
