import AddIcon from "@mui/icons-material/Add"; 
import ChatIcon from "@mui/icons-material/Chat"; 
import EventIcon from "@mui/icons-material/Event"; 
import HealingIcon from "@mui/icons-material/Healing"; 
import HistoryIcon from "@mui/icons-material/History"; 
import HomeIcon from "@mui/icons-material/Home"; 
import PersonIcon from "@mui/icons-material/Person"; 
import { Avatar, Box, Stack, Typography } from "@mui/material"; 
import { JSX } from "react";
import {Link} from "react-router";


export const NavigationRail = (): JSX.Element => { 
    return ( 
        <Box 
            sx={{ 
                display: "flex", 
                flexDirection: "column", 
                width: "5vw", 
                alignItems: "center", 
                gap: 2.5, 
                pt: 11, 
                pb: 14, 
                bgcolor: "white", 
            }} 
        > 
            <Stack direction="column" alignItems="center" gap={1}> 
                <Avatar 
                    sx={{ 
                        bgcolor: "#8EDFFF",
                        width: 48, 
                        height: 48, 
                        boxShadow: 3, 
                    }} 
                > 
                    <AddIcon sx={{ color: "black", fontSize: 24 }} />  
                </Avatar> 
            </Stack> 
            <Stack direction="column" alignItems="center" gap={3} width="100%"> 

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                <Link to="/seeker">
                        <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                            <HomeIcon sx={{ color: "black", fontSize: 24 }} /> 
                        </Avatar>
                        <Typography variant="body2" color="textPrimary" sx={{ fontWeight: 'bold' }}> 
                            Home 
                        </Typography> 
                    </Link>
                </Stack> 

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                    <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                        <ChatIcon sx={{ color: "black", fontSize: 24 }} /> 
                    </Avatar> 
                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}> 
                        Chat 
                    </Typography> 
                </Stack> 

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                <Link to="/seeker/therapy-chat">
                        <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                            <HealingIcon sx={{ color: "black", fontSize: 24 }} /> 
                        </Avatar> 
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}> 
                            Therapy 
                        </Typography> 
                    </Link>
                </Stack> 

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                <Link to="/seeker/history">
                        <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                            <HistoryIcon sx={{ color: "black", fontSize: 24 }} /> 
                        </Avatar> 
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}> 
                            History 
                        </Typography> 
                    </Link>
                </Stack>

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                <Link to="/seeker/events">
                        <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                            <EventIcon sx={{ color: "black", fontSize: 24 }} /> 
                        </Avatar> 
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}> 
                            Event 
                        </Typography> 
                    </Link>
                </Stack> 

                <Stack direction="column" alignItems="center" gap={1} width="100%"> 
                <Link to="/seeker/profile">
                        <Avatar sx={{ bgcolor: "transparent", width: 48, height: 48 }}> 
                            <PersonIcon sx={{ color: "black", fontSize: 24 }} /> 
                        </Avatar> 
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.875rem' }}> 
                            Profile 
                        </Typography> 
                    </Link>
                </Stack> 

            </Stack> 
        </Box> 
    ); 
}; 

export default NavigationRail;