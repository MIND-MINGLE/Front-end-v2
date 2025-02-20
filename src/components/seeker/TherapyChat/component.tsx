import { useState } from "react";
import IconComponentNode from "@mui/icons-material/AccountCircle"; 
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Icon2 from "@mui/icons-material/Mic"; 
import MoodIcon from "@mui/icons-material/Mood";
import Icon5 from "@mui/icons-material/MoreVert"; 
import Icon4 from "@mui/icons-material/MusicNote"; 
import Icon3 from "@mui/icons-material/ScreenShare"; 
import SendIcon from "@mui/icons-material/Send";
import Icon1 from "@mui/icons-material/Settings"; 
import { Avatar, Box, IconButton, InputAdornment, Paper, TextField, Typography } from "@mui/material";
import MusicPlaylist from "./MusicSelect";
import CallPage from "./CallPage";

const RightComponents = () => {
  const [showExtraComponent, setShowExtraComponent] = useState("");
  const [shrink,setShrink] = useState(false)
  const [format, setFormat] = useState("video")
  const shrinkPage = () =>{
    setShrink(true)
  }
  return (
    <Box display="flex" width="90%" height="100%" position="relative" bgcolor="white">
      {shrink && (
        <Box width="50%" bgcolor="#f0f0f0" height="100%">
          {showExtraComponent === "music" && <MusicPlaylist/> }
          {showExtraComponent === "call" && <CallPage format={format} />}
        </Box>
      )}
      <Box width={shrink ? "50%" : "100%"} height="100%" position="relative" bgcolor="white">
        <Box position="absolute" width="100%" height="100%"left={0}>
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "center",
              pt: 0,
              pb: 4,
              px: 0,
              bgcolor: "white",
            }}
          >
            <Box display="flex" flexDirection="column" gap={2} px={{ xs: 2, md: 4 }} py={2}>
              <Box display="flex" alignSelf="flex-end" flexDirection="column" gap={1} p={2} borderRadius="16px" sx={{ background: "#0077b6" }}>
                <Box
                  width={120}
                  height={120}
                  borderRadius="8px"
                  sx={{ backgroundImage: "url(/List.png)", backgroundSize: "cover", backgroundPosition: "center" }}
                />
                <Typography variant="body2" color="white">Homemade Dumplings</Typography>
                <Typography variant="body2" color="white" sx={{ textDecoration: "underline" }}>
                  everydumplingever.com
                </Typography>
              </Box>
              <Box display="flex" alignSelf="flex-end" px={3} py={2} borderRadius="16px 16px 8px 16px" sx={{ background: "#0077b6" }}>
                <Typography variant="body1" color="white">Can you help me?</Typography>
              </Box>
            </Box>
            <Box display="flex" alignItems="center" gap={2} px={{ xs: 2, md: 4 }} py={2}>
              <Avatar src="/image-2.png" sx={{ width: 36, height: 36 }} />
              <Box display="flex" px={3} py={2} borderRadius="16px 16px 16px 8px" border="1px solid #0077b6" bgcolor="white">
                <Typography variant="body1" color="#0077b6">I am here for you! Tell me about yourself.</Typography>
              </Box>
            </Box>
            <Box display="flex" justifyContent="end" px={{ xs: 2, md: 4 }} pt={4}>
              <Box px={3} py={2} borderRadius="16px 16px 8px 16px" sx={{ background: "#0077b6" }}>
                <Typography variant="body1" color="white">Let’s do it</Typography>
              </Box>
            </Box>
          </Paper>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="space-between" px={3} py={2} position="absolute" top={0} left={0} width="100%" bgcolor="#dff6ff" boxShadow="0px 4px 4px #00000040">
          <IconButton>
            <IconComponentNode />
          </IconButton>
          <Typography variant="h6" color="#1d1b20" flex={1}>Name</Typography>
          <Box display="flex" gap={2}>
            <IconButton><Icon1 /></IconButton>
            <IconButton onClick={() => {shrinkPage();setShowExtraComponent("call");setFormat("call")}}><Icon2 /></IconButton>
            <IconButton onClick={() => {shrinkPage();setShowExtraComponent("call");setFormat("video")}}><Icon3 /></IconButton>
            <IconButton onClick={() => {shrinkPage();setShowExtraComponent("music")}}><Icon4 /></IconButton>
            <IconButton><Icon5 /></IconButton>
          </Box>
        </Box>
        <Box display="flex" alignItems="center" justifyContent="center" gap={2} px={{ xs: 2, md: 4 }} py={3} position="absolute" bottom={0} left={0} width="100%">
          <IconButton>
            <AddCircleIcon />
          </IconButton>
          <IconButton>
            <MoodIcon />
          </IconButton>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Text messages here"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconComponentNode />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <SendIcon />
                </InputAdornment>
              ),
            }}
            sx={{ borderRadius: "10px", border: "2px solid #0077b6" }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default RightComponents;
