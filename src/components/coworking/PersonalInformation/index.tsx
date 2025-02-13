"use client";
import {
    AddCircle,
    Delete,
    Edit,
    Facebook,
    Google,
    Phone,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Select,
    TextField,
    Typography,
    Modal,
    Fade,
    Backdrop,
} from "@mui/material";
import { useState } from "react";
import AddCard from "./AddCard";

export const Frame = () => {
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Box display="flex" justifyContent="center" py={5} px={2}>
            <Box width="100%" maxWidth="1200px">
                <Grid container spacing={3}>
                    {/* Profile Section */}
                    <Grid item xs={12} md={4}>
                        <Box
                            border={1}
                            borderColor="black"
                            borderRadius={1}
                            bgcolor="white"
                            p={3}
                        >
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Avatar
                                    src="/Ellipse 27.svg"
                                    sx={{
                                        width: 110,
                                        height: 110,
                                        background: "linear-gradient(180deg, rgba(2, 127, 193, 0.84) 0%, rgba(0, 180, 216, 0.66) 46.35%, rgba(0, 180, 216, 0.61) 74.48%, rgba(27, 157, 240, 0.66) 94.27%)",
                                    }}
                                />
                                <Typography variant="h6" color="primary" mt={2}>
                                    Quỳnh Nguyễn
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Joined: 3 years ago
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Reviewed: 20
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 2 }} />
                            <Box>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Google />
                                    <Typography variant="body2" color="textSecondary" ml={2} flexGrow={1}>
                                        aiquynh2812@gmail.com
                                    </Typography>
                                    <IconButton size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Divider />
                                <Box display="flex" alignItems="center" my={2}>
                                    <Facebook />
                                    <Typography variant="body2" color="textSecondary" ml={2} flexGrow={1}>
                                        QuynhNguyen.Facebook
                                    </Typography>
                                    <IconButton size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                                <Divider />
                                <Box display="flex" alignItems="center" mt={2}>
                                    <Phone />
                                    <Typography variant="body2" color="textSecondary" ml={2} flexGrow={1}>
                                        0123456789
                                    </Typography>
                                    <IconButton size="small">
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={8}>
                        <Box
                            border={1}
                            borderColor="black"
                            borderRadius={1}
                            bgcolor="white"
                            p={3}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                        Full name
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value="Quỳnh Nguyễn"
                                        />
                                        <IconButton size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                        Date of birth
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Select variant="outlined" size="small" value={28} sx={{ mr: 1 }}>
                                            <MenuItem value={28}>28</MenuItem>
                                        </Select>
                                        <Select variant="outlined" size="small" value={12} sx={{ mr: 1 }}>
                                            <MenuItem value={12}>12</MenuItem>
                                        </Select>
                                        <Select value={2000} variant="outlined" size="small">
                                            <MenuItem value={2000}>2000</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                        Gender
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <Select variant="outlined" size="small" fullWidth value="female">
                                            <MenuItem value="female">Female</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                        Address
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value="58 Do Doc Loc, Hoa Xuan, Cam Le, Da Nang City"
                                        />
                                        <IconButton size="small">
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary">
                                        Payment method
                                    </Typography>
                                    <Box display="flex" mt={1}>
                                        <Card sx={{ width: 152, height: 100, mr: 2 }}>
                                            <CardMedia component="img" height="100" image="" alt="Visa Prepaid" />
                                        </Card>
                                        <Card sx={{ width: 152, height: 100, mr: 2 }}>
                                            <CardMedia component="img" height="100" image="" alt="Mastercard Prepaid" />
                                        </Card>
                                        <Card
                                            sx={{
                                                width: 152,
                                                height: 100,
                                                border: "1px dashed",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                marginBottom: 3,
                                            }}
                                        >
                                            <CardContent>
                                                <Button onClick={handleOpen}>
                                                    <AddCircle fontSize="large" />
                                                    <Typography variant="body2" color="textSecondary" textAlign="center">
                                                        Add Card
                                                    </Typography>
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
                {/* Modal for Adding a Card */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <Box
                            component="div"
                            position="fixed"
                            top="50%"
                            left="50%"
                            bgcolor="background.paper"
                            p={4}
                            boxShadow={24}
                            borderRadius={2}
                            maxWidth={500}
                            width="90%"
                            sx={{
                                transform: "translate(-50%, -50%)",
                            }}
                        >
                            <AddCard />
                        </Box>
                    </Fade>
                </Modal>
            </Box>
        </Box>
    );
};

export default Frame;
