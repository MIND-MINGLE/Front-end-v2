
import { Box, Typography, IconButton, List, ListItem, ListItemAvatar, Avatar, ListItemText } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const profiles = [
  { id: 1, name: "Name", message: "Supporting line text...", time: "10 min" },
  { id: 2, name: "Name", message: "Supporting line text...", time: "10 min" },
  { id: 3, name: "Name", message: "Supporting line text...", time: "10 min" },
  { id: 4, name: "Name", message: "Supporting line text...", time: "10 min" },
  { id: 5, name: "Name", message: "Supporting line text...", time: "10 min" },
  { id: 6, name: "Name", message: "Supporting line text...", time: "10 min" },
];

const ChatProfileList = () => {
  return (
    <Box padding="10px" paddingBottom={0} paddingTop={0} width="100%" height="100vh" bgcolor="#D0E8FF" color="white">
  <Box sx={{ width: "100%", backgroundColor: "#1E73BE", color: "white", display: "flex", alignItems: "center", justifyContent: "space-between" 
    ,padding:"5px",
    paddingTop: "16px",
    paddingBottom: "16px",
  }}>
  <Typography paddingLeft={"15px"} variant="h6" fontWeight="bold">Therapy Message</Typography>
  <IconButton sx={{ color: "white" }}>
    <ArrowBackIcon />
  </IconButton>
</Box>

<Box sx={{ width: "100%", backgroundColor: "none", display: "flex", flexDirection: "column", gap: "10px",padding:"5px" }}>
  {profiles.map((_, index) => (
    <Box key={index} sx={{ display: "flex", alignItems: "center", backgroundColor: "#A9D2FF", padding: "10px", borderRadius: "10px", cursor: "pointer" }}>
      <Avatar sx={{ bgcolor: "#6BA6FF", marginRight: "10px" }}>N</Avatar>
      <Box>
        <Typography fontWeight="bold" color="white">Name</Typography>
        <Typography color="white">Supporting line text...</Typography>
      </Box>
      <Typography sx={{ marginLeft: "auto", color: "white" }}>10 min</Typography>
    </Box>
  ))}
</Box>
    </Box>
  );
};

export default ChatProfileList;
