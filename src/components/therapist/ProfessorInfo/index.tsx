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
    CardMedia,
    Divider,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
    Snackbar,
    Alert,
    CircularProgress,
    Skeleton,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Accountlogout } from "../../../services/logout";
import { getAccountById, updateUserAvatar } from "../../../api/Account/Account";
import { useState, useRef, useEffect } from "react";
import LoadingScreen from "../../common/LoadingScreen";
import { getTherapistById } from "../../../api/Therapist/Therapist";

interface TherapistProfile {
    accountName: string;
    email: string;
    lastLogin: string;
    isEmailVerified: boolean;
    createdAt: string;
}
interface TherapistInfo {
    therapistId: string;
    firstName: string;
    lastName: string;
    dob: string;
    gender: string;
    phoneNumber: string;
}

export const Frame = () => {
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [loading, setLoading] = useState(true);
    const [openImageModal, setOpenImageModal] = useState(false);
    const [profile, setProfile] = useState<TherapistProfile>({
        accountName: '',
        email: '',
        lastLogin: '',
        isEmailVerified: false,
        createdAt: ''
    });
    const [therapistInfo, setTherapistInfo] = useState<TherapistInfo>({
        therapistId: '',
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        phoneNumber: ''
    });

    const nav = useNavigate();
    const logout = () => {
        Accountlogout()
        nav("/", { replace: true });
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleAvatarClick = () => {
        fileInputRef.current?.click();
    };
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const accountData = sessionStorage.getItem("account");
                if (!accountData) {
                    setError("Không tìm thấy thông tin tài khoản trong sessionStorage.");
                    return;
                }

                const { UserId } = JSON.parse(accountData);
                if (!UserId) {
                    setError("Không tìm thấy UserId trong sessionStorage.");
                    return;
                }

                // Fetch cả account và patient data
                const [accountResponse, therapistResponse] = await Promise.all([
                    getAccountById(UserId),
                    getTherapistById(UserId)
                ]);

                // Xử lý account data
                if (accountResponse?.result) {
                    setProfile({
                        accountName: accountResponse.result.accountName || "",
                        email: accountResponse.result.email || "",
                        lastLogin: accountResponse.result.lastLogin || "",
                        isEmailVerified: accountResponse.result.isEmailVerified || false,
                        createdAt: accountResponse.result.createdAt || "",
                    });
                    setAvatarUrl(accountResponse.result.avatar || "");
                } else {
                    setError("Dữ liệu tài khoản không hợp lệ.");
                }

                // Xử lý patient data
                if (therapistResponse?.result) {
                    setTherapistInfo({
                        therapistId: therapistResponse.result.therapistId || "",
                        firstName: therapistResponse.result.firstName || "",
                        lastName: therapistResponse.result.lastName || "",
                        dob: therapistResponse.result.dob || "",
                        gender: therapistResponse.result.gender || "",
                        phoneNumber: therapistResponse.result.phoneNumber || ""
                    });
                }
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Đã xảy ra lỗi khi tải thông tin.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            setError(null);

            const accountData = sessionStorage.getItem("account");
            if (!accountData) {
                throw new Error("Account information not found");
            }

            const { UserId } = JSON.parse(accountData);
            if (!UserId) {
                throw new Error("UserId not found");
            }

            // Tạo URL tạm thời cho file ảnh để preview
            const tempUrl = URL.createObjectURL(file);

            const result = await updateUserAvatar(file, UserId);

            if (result?.isSuccess) {
                setAvatarUrl(tempUrl);
                setSnackbar({
                    open: true,
                    message: 'The avatar has been updated successfully!',
                    severity: 'success'
                });
            } else {
                // Nếu không có URL trong response, sử dụng URL tạm thời
                setAvatarUrl(tempUrl);
                setSnackbar({
                    open: true,
                    message: 'The image has been saved, but it may need to be refreshed to display correctly',
                    severity: 'success'
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred while updating the avatar');
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'An error occurred while updating the avatar',
                severity: 'error'
            });
            console.error('Error:', err);
        } finally {
            setUploadingAvatar(false);
        }
    };
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };
    const handleOpenImage = () => setOpenImageModal(true);
    const handleCloseImage = () => setOpenImageModal(false);
    if (loading) {
        return <LoadingScreen />;
    }
    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    {error} - Check the console for more details.
                </Typography>
            </Box>
        );
    }
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
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        accept="image/*"
                                        style={{ display: 'none' }}
                                    />
                                    <Avatar
                                        src={avatarUrl || "/Ellipse 27.svg"}
                                        onClick={handleAvatarClick}
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
                                        onClick={handleAvatarClick}
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
                                {uploadingAvatar && (
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        right={0}
                                        bottom={0}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        bgcolor="rgba(255, 255, 255, 0.8)"
                                        borderRadius="50%"
                                    >
                                        <CircularProgress size={40} />
                                    </Box>
                                )}
                                <Typography
                                    variant="h5"
                                    color="#027FC1"
                                    mt={3}
                                    fontWeight="bold"
                                    textAlign="center"
                                >
                                    {`${therapistInfo.firstName} ${therapistInfo.lastName}`}
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
                                        {profile.email}
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
                                        {therapistInfo.phoneNumber || 'Chưa cập nhật số điện thoại'}
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
                                Personal Information
                            </Typography>

                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Full Name
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            value={`${therapistInfo.firstName} ${therapistInfo.lastName}`}
                                            disabled
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                                "& .Mui-disabled": {
                                                    backgroundColor: "rgba(0, 0, 0, 0.03)",
                                                    color: "text.primary",
                                                }
                                            }}
                                        />
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Date of Birth
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="date"
                                        value={therapistInfo.dob}
                                        disabled
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        sx={{
                                            mt: 1,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                            "& .Mui-disabled": {
                                                backgroundColor: "rgba(0, 0, 0, 0.03)",
                                                color: "text.primary",
                                            }
                                        }}
                                    />
                                </Grid>

                                <Grid item xs={12} md={6}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                        Giới tính
                                    </Typography>
                                    <Select
                                        variant="outlined"
                                        size="small"
                                        fullWidth
                                        value={therapistInfo.gender || ''}
                                        disabled
                                        sx={{
                                            mt: 1,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 2,
                                            },
                                            "& .Mui-disabled": {
                                                backgroundColor: "rgba(0, 0, 0, 0.03)",
                                                color: "text.primary",
                                            }
                                        }}
                                    >
                                        <MenuItem value="Male">Male</MenuItem>
                                        <MenuItem value="Female">Female</MenuItem>
                                        <MenuItem value="Others">Others</MenuItem>
                                    </Select>
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
                                                    Upload Certificate
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
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default Frame;
