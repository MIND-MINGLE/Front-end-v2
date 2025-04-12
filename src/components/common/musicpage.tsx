import { useState, useEffect } from "react";
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
import CloseIcon from "@mui/icons-material/Close";
import YouTube, { YouTubeProps } from "react-youtube";

interface MusicPlaylistProps {
  onClose: () => void;
}

const MusicPlaylist = ({ onClose }: MusicPlaylistProps) => {
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);

  const songs = [
    { name: "Zagreus (Out Of Tartarus - Lofi ver.)", videoId: "BhHVUJk2oao" },
    { name: "Count Funkula (Danny Baranowsky)", videoId: "Fnb5DOOM8AA" },
    { name: "Lap of Luxury (Hades II)", videoId: "EIsTrob6-04" },
  ];

  const opts: YouTubeProps["opts"] = {
    height: "0",
    width: "0",
    playerVars: {
      autoplay: 0, // Controlled manually below
      controls: 0,
      modestbranding: 1,
    },
  };

  //No Auto-play first song when player is ready
  const onReady = (event: { target: any }) => {
    setPlayer(event.target);
  };

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

  const pauseSong = () => {
    if (player) {
      player.pauseVideo();
      setIsPlaying(false);
    }
  };

  const playRandomSong = () => {
    const randomIndex = Math.floor(Math.random() * songs.length);
    playSong(songs[randomIndex].videoId);
  };

  const handleClose = () => {
    //console.log("Music continues in background");
    onClose();
  };

  return (
    <Box
      sx={{
        bgcolor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
        p: 3,
        width: "100%",
        maxWidth: "500px", // Consistent with app’s card widths
        maxHeight: "80vh",
        overflowY: "auto",
        position: "relative",
      }}
    >
      {/* Header with Close Button */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight="bold" color="#1E73BE">
          Music Playlist
        </Typography>
        <IconButton onClick={handleClose} sx={{ color: "#1E73BE" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* YouTube Player (hidden) */}
      <YouTube opts={opts} onReady={onReady} />

      {/* Now Playing Section */}
      <Typography variant="subtitle1" color="gray">
        Now Playing...
      </Typography>
      <Typography variant="h6" fontWeight="medium" color="#0077B6">
        {currentVideoId ? songs.find((s) => s.videoId === currentVideoId)?.name : "Background Music"}
      </Typography>
      <Box borderBottom={1} borderColor="gray" my={2} />

      {/* Playback Controls */}
      <Box display="flex" gap={1} mb={2}>
        <Button
          variant="contained"
          startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
          onClick={() => (isPlaying ? pauseSong() : currentVideoId ? playSong(currentVideoId) : playRandomSong())}
          disabled={!songs.length || !player}
          sx={{ bgcolor: "#1E73BE", "&:hover": { bgcolor: "#1557A0" } }}
        >
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button
          variant="outlined"
          onClick={playRandomSong}
          sx={{ color: "#1E73BE", borderColor: "#1E73BE", "&:hover": { borderColor: "#1557A0" } }}
        >
          Random
        </Button>
      </Box>

      {/* Song List */}
      <List>
        {songs.map((song, index) => (
          <ListItem
            key={index}
            onClick={() => playSong(song.videoId)}
            sx={{
              cursor: "pointer",
              "&:hover": { bgcolor: "#F0F8FF" }, // Light blue hover
              bgcolor: currentVideoId === song.videoId ? "#DFF6FF" : "inherit", // Highlight current
            }}
          >
            <IconButton>
              <StarBorderIcon sx={{ color: currentVideoId === song.videoId ? "#1E73BE" : "gray" }} />
            </IconButton>
            <ListItemText
              primary={song.name}
              secondary="YouTube Song"
              sx={{ color: currentVideoId === song.videoId ? "#1E73BE" : "inherit" }}
            />
          </ListItem>
        ))}
        <ListItem onClick={playRandomSong} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#F0F8FF" } }}>
          <IconButton>
            <StarBorderIcon />
          </IconButton>
          <ListItemText primary="Random From List" />
        </ListItem>
        <ListItem onClick={handleClose} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#F0F8FF" } }}>
          <IconButton>
            <ArrowBackIcon sx={{ color: "#1E73BE" }} />
          </IconButton>
          <ListItemText
            primary="Back to chat list"
            secondary="*ps: Music still plays in the background :3"
            sx={{ color: "#1E73BE" }}
          />
        </ListItem>
      </List>
    </Box>
  );
};

export default MusicPlaylist;