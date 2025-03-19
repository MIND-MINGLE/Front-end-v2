"use client";
import {
    AddCircle,
    Delete,
    Edit,
    Facebook,
    Google,
    Logout,
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
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import { useNavigate } from "react-router";


export const Frame = () => {
    const nav = useNavigate();
    const logout = () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("account");
        nav("/");
    };
    return (
        <Box
            display="flex"
            justifyContent="center"
            py={5}
            px={2}
            sx={{
                background: "linear-gradient(135deg, #0077B6, #1B9DF0)",
                minHeight: '100vh'
            }}
        >
            <Box width="100%" maxWidth="1400px">
                <Grid container spacing={4}>
                    {/* Profile Section */}
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={6}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                bgcolor: "#FFFFFF",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                                    transform: "translateY(-5px)",
                                },
                            }}
                        >
                            <Box display="flex" flexDirection="column" alignItems="center">
                                <Box position="relative">
                                    <Avatar
                                        src="/Ellipse 27.svg"
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            background: "linear-gradient(180deg, #027FC1 0%, #1B9DF0 100%)",
                                            border: "4px solid #E3F2FD",
                                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                                            transition: "all 0.3s ease",
                                            cursor: 'pointer',
                                            "&:hover": {
                                                transform: "scale(1.05)",
                                                boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)"
                                            },
                                        }}
                                    />
                                    <IconButton
                                        sx={{
                                            position: 'absolute',
                                            bottom: 0,
                                            right: 0,
                                            backgroundColor: '#fff',
                                            '&:hover': { backgroundColor: '#e3f2fd' },
                                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        <Edit fontSize="small" sx={{ color: '#027FC1' }} />
                                    </IconButton>
                                </Box>
                                <Typography
                                    variant="h5"
                                    color="#027FC1"
                                    mt={3}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    Quỳnh Nguyễn
                                </Typography>
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: 3,
                                        mt: 2,
                                        mb: 1
                                    }}
                                >
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="primary">3</Typography>
                                        <Typography variant="body2" color="text.secondary">Years</Typography>
                                    </Box>
                                    <Divider orientation="vertical" flexItem />
                                    <Box textAlign="center">
                                        <Typography variant="h6" color="primary">20</Typography>
                                        <Typography variant="body2" color="text.secondary">Reviews</Typography>
                                    </Box>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 3, borderColor: "#E3F2FD" }} />

                            <Box>
                                <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={2}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(2, 127, 193, 0.04)' }
                                    }}
                                >
                                    <Google sx={{ color: "#DB4437" }} />
                                    <Typography variant="body2" color="text.secondary" ml={2} flexGrow={1}>
                                        aiquynh2812@gmail.com
                                    </Typography>
                                    <IconButton size="small" sx={{ color: 'error.main' }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={2}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(2, 127, 193, 0.04)' }
                                    }}
                                >
                                    <Facebook sx={{ color: "#4267B2" }} />
                                    <Typography variant="body2" color="text.secondary" ml={2} flexGrow={1}>
                                        QuynhNguyen.Facebook
                                    </Typography>
                                    <IconButton size="small" sx={{ color: 'error.main' }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Box
                                    display="flex"
                                    alignItems="center"
                                    mb={2}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        '&:hover': { bgcolor: 'rgba(2, 127, 193, 0.04)' }
                                    }}
                                >
                                    <Phone sx={{ color: "#027FC1" }} />
                                    <Typography variant="body2" color="text.secondary" ml={2} flexGrow={1}>
                                        0123456789
                                    </Typography>
                                    <IconButton size="small" sx={{ color: 'error.main' }}>
                                        <Delete fontSize="small" />
                                    </IconButton>
                                </Box>

                                <Divider sx={{ borderColor: "#E3F2FD" }} />

                                <Box
                                    onClick={logout}
                                    display="flex"
                                    alignItems="center"
                                    mt={2}
                                    sx={{
                                        p: 1.5,
                                        borderRadius: 2,
                                        cursor: "pointer",
                                        transition: "all 0.3s ease",
                                        "&:hover": { bgcolor: "#FFEBEE" },
                                    }}
                                >
                                    <Logout color="error" />
                                    <Typography variant="body2" color="error" ml={2} flexGrow={1}>
                                        Sign Out
                                    </Typography>
                                </Box>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Contact Information */}
                    <Grid item xs={12} md={8}>
                        <Paper
                            elevation={6}
                            sx={{
                                p: 4,
                                borderRadius: 3,
                                bgcolor: "#FFFFFF",
                                boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    boxShadow: "0 12px 32px rgba(0, 0, 0, 0.15)",
                                    transform: "translateY(-5px)",
                                },
                            }}
                        >
                            <Typography variant="h6" color="#027FC1" fontWeight="medium" mb={4}>
                                Thông tin cá nhân
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Họ và tên
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value="Quỳnh Nguyễn"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <IconButton size="small" sx={{ ml: 1, color: '#027FC1' }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Ngày sinh
                                    </Typography>
                                    <Box display="flex" gap={1} mt={1}>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            value={28}
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        >
                                            <MenuItem value={28}>28</MenuItem>
                                        </Select>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            value={12}
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        >
                                            <MenuItem value={12}>12</MenuItem>
                                        </Select>
                                        <Select
                                            variant="outlined"
                                            size="small"
                                            value={2000}
                                            sx={{
                                                flex: 1,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        >
                                            <MenuItem value={2000}>2000</MenuItem>
                                        </Select>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Giới tính
                                    </Typography>
                                    <Select
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value="female"
                                        sx={{
                                            mt: 1,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                        }}
                                    >
                                        <MenuItem value="female">Female</MenuItem>
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="other">Other</MenuItem>
                                    </Select>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Địa chỉ
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value="58 Do Doc Loc, Hoa Xuan, Cam Le, Da Nang City"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <IconButton size="small" sx={{ ml: 1, color: '#027FC1' }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Giới thiệu
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            value="Happy code, happy life, happy money"
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        <IconButton size="small" sx={{ ml: 1, color: '#027FC1' }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium" mb={2}>
                                        Chứng chỉ
                                    </Typography>
                                    <Box
                                        display="flex"
                                        gap={2}
                                        flexWrap="wrap"
                                    >
                                        <Card
                                            sx={{
                                                width: 180,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image="/cert1.png"
                                                alt="Certificate 1"
                                            />
                                        </Card>

                                        <Card
                                            sx={{
                                                width: 180,
                                                borderRadius: 2,
                                                overflow: 'hidden',
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                transition: 'all 0.3s ease',
                                                '&:hover': {
                                                    transform: 'translateY(-4px)',
                                                    boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                                }
                                            }}
                                        >
                                            <CardMedia
                                                component="img"
                                                height="120"
                                                image="/cert2.png"
                                                alt="Certificate 2"
                                            />
                                        </Card>

                                        <Card
                                            sx={{
                                                width: 180,
                                                height: 120,
                                                borderRadius: 2,
                                                border: '2px dashed #027FC1',
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    borderColor: '#1B9DF0',
                                                    backgroundColor: 'rgba(2, 127, 193, 0.04)'
                                                }
                                            }}
                                        >
                                            <Button
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    gap: 1,
                                                    color: '#027FC1',
                                                    '&:hover': {
                                                        backgroundColor: 'transparent'
                                                    }
                                                }}
                                            >
                                                <AddCircle fontSize="large" />
                                                <Typography variant="body2">
                                                    Thêm chứng chỉ
                                                </Typography>
                                            </Button>
                                        </Card>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default Frame;
