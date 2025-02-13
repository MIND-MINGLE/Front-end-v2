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
import Link from "next/link";
import React from "react";

const RightComponents = () => {
  return (
    <Box display="flex" justifyContent="start" width="100vw" height="100vh" bgcolor="transparent">
      <Box width="80%"  height="100%">
        <Box position="relative" height="100%" bgcolor="white">
          <Box position="absolute" width="100%" height="100%" top={200} left={0}>
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
              <Box display="flex" flexDirection="column" height="80px" justifyContent="end" gap={1} px={6} py={2} bgcolor="white">
                <Box display="flex" flexDirection="column" gap={1.5} p={3} borderRadius="16px" sx={{ background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 94.27%)" }}>
                  <Box
                    width="200px"
                    height="176px"
                    borderRadius="8px"
                    sx={{ backgroundImage: "url(/List.png)", backgroundSize: "cover", backgroundPosition: "center" }}
                  />
                  <Box width="200px">
                    <Typography
                      variant="body1"
                      color="white"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      Homemade Dumplings
                    </Typography>
                    <Typography
                      variant="body1"
                      color="white"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        textDecoration: "underline",
                      }}
                    >
                      everydumplingever.com
                    </Typography>
                  </Box>
                </Box>
                <Box display="flex" alignItems="center" px={4} py={2} borderRadius="20px 20px 8px 20px" sx={{ background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 94.27%)" }}>
                  <Typography variant="body1" color="white">Can you help me?</Typography>
                </Box>
              </Box>
              <Box display="flex" alignItems="center" gap={2} px={6} py={2} bgcolor="white">
                <Avatar src="/image-2.png" sx={{ width: 36, height: 36 }} />
                <Box display="flex" alignItems="center" px={4} py={2} borderRadius="20px 20px 20px 8px" border="1px solid #0077b6" bgcolor="white">
                  <Typography variant="body1" color="#0077b6">I am here for you! Tell me about yourself.</Typography>
                </Box>
              </Box>
              <Box display="flex" justifyContent="end" gap={2} pt={4} px={6} bgcolor="white">
                <Box display="flex" alignItems="center" px={4} py={2} borderRadius="20px 20px 8px 20px" sx={{ background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 94.27%)" }}>
                  <Typography variant="body1" color="white">Let’s do it</Typography>
                </Box>
              </Box>
            </Paper>
          </Box>
          <Box display="flex" alignItems="center" justifyContent="center" gap={4} px={6} py={3} position="absolute" top="90%" left={0} width="100%">
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
          <Box display="flex" alignItems="center" gap={1} px={3} py={2} position="absolute" top={0} left={0} width="100%" height="55px" bgcolor="#dff6ff" boxShadow="0px 4px 4px #00000040">
            <IconButton>
              <IconComponentNode />
            </IconButton>
            <Typography variant="h6" color="#1d1b20" flex={1}>
              Name
            </Typography>
            <Box display="flex" gap={3}>
              <IconButton>
                <Icon1 />
              </IconButton>

              <Link href="/SeekerPage/TherapyChat/CallNoVideo">
                <IconButton>
                    <Icon2 />
                </IconButton>
              </Link>

              <Link href="/SeekerPage/TherapyChat/CallVideo">
                <IconButton>
                    <Icon3 />
                </IconButton>
              </Link>

              <Link href="/SeekerPage/TherapyChat/MusicSelect">
                <IconButton>
                    <Icon4 />
                </IconButton>
              </Link>

              <IconButton>
                <Icon5 />
              </IconButton>

            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default RightComponents;
