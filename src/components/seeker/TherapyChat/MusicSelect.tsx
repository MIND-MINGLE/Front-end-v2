import { Box, Typography, List, ListItem, ListItemText, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarBorderIcon from "@mui/icons-material/StarBorder";

const MusicPlaylist = () => {
  return (
    <Box width="100%" height="100%" bgcolor="white" p={2}>
      <Typography variant="subtitle1" color="gray">Now Playing...</Typography>
      <Typography variant="h6" fontWeight="bold">HELLOHELL (Akatsuki Records)</Typography>
      <Box borderBottom={1} borderColor="gray" my={1} />
      <List>
        {["Song 1", "Song 2", "Song 3"].map((song, index) => (
          <ListItem key={index}>
            <IconButton>
              <StarBorderIcon />
            </IconButton>
            <ListItemText primary={song} secondary="Menu description." />
          </ListItem>
        ))}
        <ListItem >
          <IconButton>
            <StarBorderIcon />
          </IconButton>
          <ListItemText primary="Random From List" />
        </ListItem>
      </List>
      <ListItem  onClick={()=>{console.log("Close This")}}>
        <IconButton>
          <ArrowBackIcon />
        </IconButton>
        <ListItemText primary="Back to chat list" secondary="*ps: Don’t worry, your music still plays in the background :3" />
      </ListItem>
    </Box>
  );
};

export default MusicPlaylist;
