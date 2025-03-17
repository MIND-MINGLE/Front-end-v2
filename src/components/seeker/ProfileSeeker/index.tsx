"use client";
import {
    Edit,
    Email,
    Logout,
    AccountCircle,
    Verified,
    Schedule,
    CalendarToday,
    Close,
} from "@mui/icons-material";
import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    IconButton,
    TextField,
    Typography,
    Paper,
    Modal,
    Fade,
    Backdrop,
    CircularProgress,
    Alert,
    Snackbar,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { updateUserAvatar } from "../../../api/Account/Account";

export const Frame = () => {
    const [openEdit, setOpenEdit] = useState(false);
    const [profile, setProfile] = useState({
        accountName: "",
        email: "",
        lastLogin: "",
        isEmailVerified: false,
        createdAt: "",
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const nav = useNavigate();
    const [avatarUrl, setAvatarUrl] = useState<string>("");
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [openImageModal, setOpenImageModal] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                console.log("Fetching profile...");

                const accountData = sessionStorage.getItem("account");
                console.log("Account data from sessionStorage:", accountData);

                if (!accountData) {
                    setError("Không tìm thấy thông tin tài khoản trong sessionStorage.");
                    setLoading(false);
                    return;
                }

                const { UserId } = JSON.parse(accountData);
                console.log("Parsed UserId:", UserId);

                if (!UserId) {
                    setError("Không tìm thấy UserId trong sessionStorage.");
                    setLoading(false);
                    return;
                }

                const response = await axios.get(
                    `https://mindmingle202.azurewebsites.net/api/Account/${UserId}`
                );
                console.log("API Response:", response.data);

                const data = response.data;
                if (data.isSuccess && data.result) {
                    setProfile({
                        accountName: data.result.accountName || "",
                        email: data.result.email || "",
                        lastLogin: data.result.lastLogin || "",
                        isEmailVerified: data.result.isEmailVerified || false,
                        createdAt: data.result.createdAt || "",
                    });
                    setAvatarUrl(data.result.avatar || "");
                } else {
                    setError("Dữ liệu không hợp lệ từ API.");
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
                setError("Đã xảy ra lỗi khi tải thông tin tài khoản.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleOpenEdit = () => setOpenEdit(true);
    const handleCloseEdit = () => setOpenEdit(false);
    const handleOpenImage = () => setOpenImageModal(true);
    const handleCloseImage = () => setOpenImageModal(false);

    const logout = () => {
        sessionStorage.removeItem("user");
        localStorage.removeItem("token");
        sessionStorage.removeItem("account");
        nav("/");
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingAvatar(true);
            setError(null);

            const accountData = sessionStorage.getItem("account");
            if (!accountData) {
                throw new Error("Không tìm thấy thông tin tài khoản");
            }

            const { UserId } = JSON.parse(accountData);
            if (!UserId) {
                throw new Error("Không tìm thấy UserId");
            }

            // Tạo URL tạm thời cho file ảnh để preview
            const tempUrl = URL.createObjectURL(file);

            const result = await updateUserAvatar(file, UserId);

            if (result?.isSuccess) {  // Kiểm tra kỹ cấu trúc response
                // Cập nhật URL avatar với URL thật từ API
                setAvatarUrl(tempUrl);
                setSnackbar({
                    open: true,
                    message: 'Cập nhật ảnh đại diện thành công!',
                    severity: 'success'
                });
            } else {
                // Nếu không có URL trong response, sử dụng URL tạm thời
                setAvatarUrl(tempUrl);
                setSnackbar({
                    open: true,
                    message: 'Đã lưu ảnh nhưng có thể cần refresh để hiển thị chính xác',
                    severity: 'warning'
                });
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật avatar');
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Đã xảy ra lỗi khi cập nhật avatar',
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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress sx={{ color: "#027FC1" }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <Typography variant="h6" color="error">
                    {error} - Kiểm tra console để biết thêm chi tiết.
                </Typography>
            </Box>
        );
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="center"
                py={5}
                px={{ xs: 2, md: 4 }}
                sx={{ background: "linear-gradient(135deg, #0077B6, #1B9DF0)" }}
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
                                            src={avatarUrl}
                                            key={avatarUrl}
                                            onClick={handleOpenImage}
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
                                        >
                                            {!avatarUrl && <AccountCircle sx={{ fontSize: 60, color: "#FFFFFF" }} />}
                                        </Avatar>
                                        <IconButton
                                            component="label"
                                            disabled={uploadingAvatar}
                                            sx={{
                                                position: 'absolute',
                                                bottom: 0,
                                                right: 0,
                                                backgroundColor: '#fff',
                                                '&:hover': { backgroundColor: '#e3f2fd' },
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                        >
                                            <input
                                                type="file"
                                                hidden
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                            {uploadingAvatar ? (
                                                <CircularProgress size={20} sx={{ color: '#027FC1' }} />
                                            ) : (
                                                <Edit fontSize="small" sx={{ color: '#027FC1' }} />
                                            )}
                                        </IconButton>
                                    </Box>
                                    <Typography
                                        variant="h5"
                                        color="#027FC1"
                                        mt={3}
                                        fontWeight="bold"
                                        textAlign="center"
                                    >
                                        {profile.accountName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        <CalendarToday fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                        Joined: {formatDate(profile.createdAt)}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        <Schedule fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                        Last Login: {formatDate(profile.lastLogin)}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        color={profile.isEmailVerified ? "success.main" : "error.main"}
                                        mt={1}
                                    >
                                        <Verified fontSize="small" sx={{ verticalAlign: "middle", mr: 1 }} />
                                        Email Verified: {profile.isEmailVerified ? "Yes" : "No"}
                                    </Typography>
                                </Box>
                                <Divider sx={{ my: 3, borderColor: "#E3F2FD" }} />
                                <Box>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <Email sx={{ color: "#027FC1" }} />
                                        <Typography variant="body2" color="textSecondary" ml={2} flexGrow={1}>
                                            {profile.email || "Not provided"}
                                        </Typography>
                                        <IconButton size="small" onClick={handleOpenEdit} sx={{ "&:hover": { color: "#027FC1" } }}>
                                            <Edit fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    <Divider sx={{ borderColor: "#E3F2FD" }} />
                                    <Box
                                        onClick={logout}
                                        display="flex"
                                        alignItems="center"
                                        mt={2}
                                        sx={{
                                            cursor: "pointer",
                                            transition: "all 0.3s ease",
                                            "&:hover": { bgcolor: "#FFEBEE", borderRadius: 1 },
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
                                <Typography variant="h6" color="#027FC1" fontWeight="medium" mb={3}>
                                    Thông tin cá nhân
                                </Typography>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                            Tên tài khoản
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={profile.accountName}
                                                disabled
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        "&:hover fieldset": { borderColor: "#027FC1" },
                                                        "&.Mui-focused fieldset": { borderColor: "#027FC1" },
                                                    },
                                                }}
                                            />
                                            <IconButton size="small" onClick={handleOpenEdit} sx={{ "&:hover": { color: "#027FC1" } }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                            Email
                                        </Typography>
                                        <Box display="flex" alignItems="center" mt={1}>
                                            <TextField
                                                variant="outlined"
                                                size="small"
                                                fullWidth
                                                value={profile.email || ""}
                                                disabled={!openEdit}
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        borderRadius: 2,
                                                        "&:hover fieldset": { borderColor: "#027FC1" },
                                                        "&.Mui-focused fieldset": { borderColor: "#027FC1" },
                                                    },
                                                }}
                                            />
                                            <IconButton size="small" onClick={handleOpenEdit} sx={{ "&:hover": { color: "#027FC1" } }}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        {/* Edit Modal */}
                        <Modal
                            open={openEdit}
                            onClose={handleCloseEdit}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                                sx: { backdropFilter: "blur(5px)" },
                            }}
                        >
                            <Fade in={openEdit}>
                                <Box
                                    component="div"
                                    position="fixed"
                                    top="50%"
                                    left="50%"
                                    bgcolor="background.paper"
                                    p={4}
                                    boxShadow="0 12px 40px rgba(0, 0, 0, 0.2)"
                                    borderRadius={3}
                                    maxWidth={500}
                                    width="90%"
                                    sx={{
                                        transform: "translate(-50%, -50%)",
                                        animation: "zoomIn 0.3s ease-in-out",
                                        "@keyframes zoomIn": {
                                            "0%": { transform: "translate(-50%, -50%) scale(0.8)", opacity: 0 },
                                            "100%": { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
                                        },
                                    }}
                                >
                                    <Typography variant="h6" color="#027FC1" mb={3} fontWeight="bold">
                                        Chỉnh sửa thông tin
                                    </Typography>
                                    <Box component="form" onSubmit={(e) => e.preventDefault()}>
                                        <TextField
                                            label="Tên tài khoản"
                                            fullWidth
                                            value={profile.accountName}
                                            onChange={(e) => setProfile({ ...profile, accountName: e.target.value })}
                                            variant="outlined"
                                            sx={{
                                                mb: 3,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    "&:hover fieldset": { borderColor: "#027FC1" },
                                                    "&.Mui-focused fieldset": { borderColor: "#027FC1" },
                                                },
                                            }}
                                        />
                                        <TextField
                                            label="Email"
                                            fullWidth
                                            value={profile.email}
                                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                            variant="outlined"
                                            sx={{
                                                mb: 3,
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                    "&:hover fieldset": { borderColor: "#027FC1" },
                                                    "&.Mui-focused fieldset": { borderColor: "#027FC1" },
                                                },
                                            }}
                                        />
                                        <Button
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            onClick={handleCloseEdit}
                                            sx={{
                                                mt: 2,
                                                py: 1.5,
                                                borderRadius: 2,
                                                background: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                                                boxShadow: "0 4px 12px rgba(33, 203, 243, .3)",
                                                "&:hover": {
                                                    background: "linear-gradient(45deg, #1976D2 30%, #1B9DF0 90%)",
                                                    boxShadow: "0 6px 20px rgba(33, 203, 243, .5)",
                                                },
                                            }}
                                        >
                                            Lưu thay đổi
                                        </Button>
                                    </Box>
                                </Box>
                            </Fade>
                        </Modal>

                        {/* Image Modal */}
                        <Modal
                            open={openImageModal}
                            onClose={handleCloseImage}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                                sx: { backdropFilter: "blur(8px)" },
                            }}
                        >
                            <Fade in={openImageModal}>
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: '50%',
                                        left: '50%',
                                        transform: 'translate(-50%, -50%)',
                                        maxWidth: '90vw',
                                        maxHeight: '90vh',
                                        outline: 'none',
                                        p: 1,
                                    }}
                                >
                                    <IconButton
                                        onClick={handleCloseImage}
                                        sx={{
                                            position: 'absolute',
                                            right: 8,
                                            top: 8,
                                            bgcolor: 'rgba(255, 255, 255, 0.8)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 255, 255, 0.9)',
                                            },
                                            zIndex: 1,
                                        }}
                                    >
                                        <Close />
                                    </IconButton>
                                    <Box
                                        component="img"
                                        src={avatarUrl}
                                        alt="Profile"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: '85vh',
                                            objectFit: 'contain',
                                            borderRadius: 2,
                                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                        }}
                                    />
                                </Box>
                            </Fade>
                        </Modal>
                    </Grid>
                </Box>
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{
                        width: '100%',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        borderRadius: '8px',
                        '& .MuiAlert-icon': {
                            fontSize: '24px'
                        }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Frame;