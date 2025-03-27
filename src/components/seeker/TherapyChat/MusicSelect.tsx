import { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import YouTube, { YouTubeProps } from "react-youtube";

interface MusicPlaylistProps {
  onClose: () => void; // To toggle shrink in RightComponents
}

const MusicPlaylist = ({ onClose }: MusicPlaylistProps) => {
  const [player, setPlayer] = useState<any>(null); // YouTube player instance
  const [isPlaying, setIsPlaying] = useState(false); // Play/pause state
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null); // Current YouTube video ID

  // Sample YouTube song list (replace with real video IDs)
  const songs = [
    { name: "Zagreus (Out Of Tartarus - Lofi ver.)", videoId: "BhHVUJk2oao" }, // Rick Astley - Never Gonna Give You Up
    { name: "Count Funkula (Danny Baranowsky)", videoId: "Fnb5DOOM8AA" }, // Ed Sheeran - Shape of You
    { name: "Lap of Luxury (Hades II)", videoId: "EIsTrob6-04" }, // Luis Fonsi - Despacito
  ];

  // YouTube player options
  const opts: YouTubeProps["opts"] = {
    height: "0", // Hide video (audio only)
    width: "0",
    playerVars: {
      autoplay: 0, // No autoplay due to browser restrictions
      controls: 0, // Hide controls
      modestbranding: 1, // Reduce YouTube branding
    },
  };

  // When player is ready, store the instance
  const onReady = (event: { target: any }) => {
    setPlayer(event.target);
  };

  // Play a specific song
  const playSong = (videoId: string) => {
    if (player) {
      if (currentVideoId !== videoId) {
        player.loadVideoById(videoId);
        setCurrentVideoId(videoId);
      }
      player.playVideo();
      setIsPlaying(true);
    }
  };

  // Pause the current song
  const pauseSong = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  // Play a random song
  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex].videoId);
  };

  // Handle back button
  const handleBackToChat = () => {
    console.log("Close This - Music continues in background");
    onClose(); // Toggle shrink in RightComponents
  };

  return (
    <Box width="100%" height="100%" bgcolor="white" p={2}
    sx={{
      position:"fixed",
      zIndex:0
    }}
    >
      {/* YouTube Player (hidden) */}
      <YouTube opts={opts} onReady={onReady} />

      {/* Now Playing Section */}
      <Typography variant="subtitle1" color="gray">
        Now Playing...
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {currentVideoId ? songs.find((s) => s.videoId === currentVideoId)?.name : "Background Music"}
      </Typography>
      <Box borderBottom={1} borderColor="gray" my={1} />

      {/* Playback Controls */}
      <Box display="flex" gap={1} mb={2}>
        <Button
          variant="contained"
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => (isPlaying ? pauseSong() : currentVideoId ? playSong(currentVideoId) : playRandomSong())}
          disabled={!songs.length || !player}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </Box>

      {/* Song List */}
      <List>
        {songs.map((song, index) => (
          <ListItem key={index} onClick={() => playSong(song.videoId)}>
            <IconButton>
              <StarBorderIcon />
            </IconButton>
            <ListItemText
              primary={song.name}
              secondary="YouTube Song"
              sx={{ color: currentVideoId === song.videoId ? "#0077b6" : "inherit" }} // Highlight current song
            />
          </ListItem>
        ))}
        <ListItem onClick={playRandomSong}>
          <IconButton>
            <StarBorderIcon />
          </IconButton>
          <ListItemText primary="Random From List" />
        </ListItem>
      </List>

      {/* Back to Chat */}
      <ListItem onClick={handleBackToChat}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <ListItemText
          primary="Back to chat list"
          secondary="*ps: Don’t worry, your music still plays in the background :3"
        />
      </ListItem>
    </Box>
  );
};

export default MusicPlaylist;