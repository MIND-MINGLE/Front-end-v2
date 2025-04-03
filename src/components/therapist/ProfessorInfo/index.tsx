"use client";
import {
    AddCircle,
    Delete,
    Edit,
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import { useNavigate } from "react-router";
import { Accountlogout } from "../../../services/logout";
import { getAccountById, updateUserAvatar } from "../../../api/Account/Account";
import { useState, useRef, useEffect } from "react";
import LoadingScreen from "../../common/LoadingScreen";
import { getTherapistById } from "../../../api/Therapist/Therapist";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../../../services/firebase";

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
    description: string;

}

// Thêm interface cho credential
interface Credential {
    credentialId: string;
    imageUrl: string;
    therapistId: string;
    isDisabled: number;
    createdAt: string;
    updatedAt: string;
}

// Thêm interface cho Specialization
interface Specialization {
    specializationId: string;
    name: string;
    description: string;
    isDisabled: boolean;
}

// Thêm interface cho TherapistSpecialization
interface TherapistSpecialization {
    specializationId: string;
    name: string;
    description: string;
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
        phoneNumber: '',
        description: ''
    });
    const [openAvatarModal, setOpenAvatarModal] = useState(false);
    const [credentials, setCredentials] = useState<Credential[]>([]);
    const [selectedImage, setSelectedImage] = useState<string>("");
    const [openImageModal, setOpenImageModal] = useState(false);
    const [uploadingCredential, setUploadingCredential] = useState(false);
    const credentialFileRef = useRef<HTMLInputElement>(null);
    const [editingCredentialId, setEditingCredentialId] = useState<string | null>(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editForm, setEditForm] = useState({
        firstName: '',
        lastName: '',
        dob: '',
        gender: '',
        description: ''
    });
    const [updating, setUpdating] = useState(false);
    const [specializations, setSpecializations] = useState<Specialization[]>([]);
    const [therapistSpecializations, setTherapistSpecializations] = useState<TherapistSpecialization[]>([]);
    const [openSpecDialog, setOpenSpecDialog] = useState(false);
    const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
        open: false,
        specializationId: '',
        specializationName: ''
    });

    const nav = useNavigate();
    const logout = () => {
        Accountlogout()
        nav("/", { replace: true });
    };
    const fileInputRef = useRef<HTMLInputElement>(null);
    const handleAvatarClick = (event: React.MouseEvent) => {
        if ((event.target as HTMLElement).closest('button')) {
            fileInputRef.current?.click();
            return;
        }
        setOpenAvatarModal(true);
    };
    const fetchCredentials = async (therapistId: string) => {
        try {
            const response = await fetch(`https://mindmingle202.azurewebsites.net/api/Credential/${therapistId}`);
            const data = await response.json();
            if (data.isSuccess) {
                setCredentials(data.result);
            }
        } catch (error) {
            console.error("Error fetching credentials:", error);
        }
    };
    const fetchSpecializations = async () => {
        try {
            const response = await fetch('https://mindmingle202.azurewebsites.net/api/Specialization');
            const data = await response.json();
            if (data.isSuccess) {
                setSpecializations(data.result.filter((spec: Specialization) => !spec.isDisabled));
            }
        } catch (error) {
            console.error("Error fetching specializations:", error);
        }
    };
    const fetchTherapistSpecializations = async (therapistId: string) => {
        try {
            const response = await fetch(`https://mindmingle202.azurewebsites.net/api/TherapistSpecialization/${therapistId}`);
            const data = await response.json();
            if (data.isSuccess && data.result.specializations) {
                setTherapistSpecializations(data.result.specializations);
            }
        } catch (error) {
            console.error("Error fetching therapist specializations:", error);
        }
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

                // Fetch tất cả dữ liệu cần thiết
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
                        phoneNumber: therapistResponse.result.phoneNumber || "",
                        description: therapistResponse.result.description || ""
                    });
                }

                // Fetch credentials sau khi có therapistId
                if (therapistResponse?.result?.therapistId) {
                    await fetchCredentials(therapistResponse.result.therapistId);
                }

                // Fetch specializations
                await fetchSpecializations();

                // Fetch therapist specializations
                if (therapistResponse?.result?.therapistId) {
                    await fetchTherapistSpecializations(therapistResponse.result.therapistId);
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
    const handleCloseAvatarModal = () => {
        setOpenAvatarModal(false);
    };
    const handleCloseImage = () => {
        setOpenImageModal(false);
    };

    // Thêm hàm upload ảnh lên Firebase
    const uploadCredentialImage = async (file: File) => {
        const timestamp = new Date().getTime();
        const storageRef = ref(storage, `credentials/${timestamp}_${file.name}`);
        await uploadBytes(storageRef, file);
        return await getDownloadURL(storageRef);
    };

    // Thêm hàm xử lý upload credential
    const handleCredentialUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setUploadingCredential(true);
            setError(null);

            // Upload ảnh lên Firebase
            const imageUrl = await uploadCredentialImage(file);

            // Gọi API để thêm credential
            const response = await fetch('https://mindmingle202.azurewebsites.net/api/Credential', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    therapistId: therapistInfo.therapistId,
                    imageUrl: imageUrl
                })
            });

            const data = await response.json();

            if (data.isSuccess) {
                // Refresh danh sách credentials
                await fetchCredentials(therapistInfo.therapistId);
                setSnackbar({
                    open: true,
                    message: 'Certificate has been uploaded successfully!',
                    severity: 'success'
                });
            } else {
                throw new Error(data.errorMessage || 'Failed to upload certificate');
            }
        } catch (err) {
            console.error('Error uploading credential:', err);
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Failed to upload certificate',
                severity: 'error'
            });
        } finally {
            setUploadingCredential(false);
        }
    };

    // Thêm hàm xử lý cập nhật credential
    const handleCredentialEdit = async (event: React.ChangeEvent<HTMLInputElement>, credentialId: string) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            setEditingCredentialId(credentialId);
            setError(null);

            // Upload ảnh mới lên Firebase
            const imageUrl = await uploadCredentialImage(file);

            // Gọi API để cập nhật credential
            const response = await fetch(`https://mindmingle202.azurewebsites.net/api/Credential/${credentialId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    imageUrl: imageUrl
                })
            });

            const data = await response.json();

            if (data.isSuccess) {
                // Refresh danh sách credentials
                await fetchCredentials(therapistInfo.therapistId);
                setSnackbar({
                    open: true,
                    message: 'Certificate has been updated successfully!',
                    severity: 'success'
                });
            } else {
                throw new Error(data.errorMessage || 'Failed to update certificate');
            }
        } catch (err) {
            console.error('Error updating credential:', err);
            setSnackbar({
                open: true,
                message: err instanceof Error ? err.message : 'Failed to update certificate',
                severity: 'error'
            });
        } finally {
            setEditingCredentialId(null);
        }
    };

    const handleOpenEditDialog = () => {
        setEditForm({
            firstName: therapistInfo.firstName,
            lastName: therapistInfo.lastName,
            dob: formatDateForInput(therapistInfo.dob),
            gender: therapistInfo.gender,
            description: therapistInfo.description
        });
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
    };

    const handleFormChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
        setEditForm(prev => ({
            ...prev,
            [field]: event.target.value
        }));
    };

    const handleUpdateProfile = async () => {
        try {
            setUpdating(true);
            const response = await fetch(`https://mindmingle202.azurewebsites.net/api/Therapist/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: therapistInfo.therapistId,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    dob: editForm.dob,
                    gender: editForm.gender,
                    phoneNumber: therapistInfo.phoneNumber,
                    description: editForm.description
                })
            });

            const data = await response.json();

            if (data.isSuccess) {
                setTherapistInfo(prev => ({
                    ...prev,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    dob: editForm.dob,
                    gender: editForm.gender,
                    description: editForm.description
                }));

                setSnackbar({
                    open: true,
                    message: 'Profile updated successfully!',
                    severity: 'success'
                });
                handleCloseEditDialog();
            } else {
                throw new Error(data.errorMessage || 'Failed to update profile');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to update profile',
                severity: 'error'
            });
        } finally {
            setUpdating(false);
        }
    };

    // Thêm hàm chuyển đổi định dạng ngày
    const formatDateForInput = (dateStr: string) => {
        if (!dateStr) return '';
        try {
            const [day, month, year] = dateStr.split('/');
            if (!day || !month || !year) return '';
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        } catch (error) {
            console.error('Error formatting date:', error);
            return '';
        }
    };

    // Thêm hàm xử lý khi chọn/bỏ chọn specialization
    const handleSpecializationToggle = async (specializationId: string) => {
        try {
            const response = await fetch('https://mindmingle202.azurewebsites.net/api/TherapistSpecialization', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    therapistId: therapistInfo.therapistId,
                    specializationId: specializationId
                })
            });

            const data = await response.json();

            if (data.isSuccess) {
                // Refresh lại danh sách specializations của therapist
                await fetchTherapistSpecializations(therapistInfo.therapistId);

                setSnackbar({
                    open: true,
                    message: 'Specialization added successfully!',
                    severity: 'success'
                });
            } else {
                throw new Error(data.errorMessage || 'Failed to add specialization');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to add specialization',
                severity: 'error'
            });
        }
    };

    const handleOpenSpecDialog = () => setOpenSpecDialog(true);
    const handleCloseSpecDialog = () => setOpenSpecDialog(false);

    const handleDeleteSpecialization = async (specializationId: string, specializationName: string) => {
        try {
            const response = await fetch(
                `https://mindmingle202.azurewebsites.net/api/TherapistSpecialization?therapistId=${therapistInfo.therapistId}&specId=${specializationId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'accept': '*/*'
                    }
                }
            );

            const data = await response.json();

            if (data.isSuccess) {
                // Cập nhật state trực tiếp trước khi gọi API fetch
                setTherapistSpecializations(prev =>
                    prev.filter(spec => spec.specializationId !== specializationId)
                );

                // Vẫn giữ fetch để đồng bộ với server
                await fetchTherapistSpecializations(therapistInfo.therapistId);

                setSnackbar({
                    open: true,
                    message: `Removed ${specializationName} successfully!`,
                    severity: 'success'
                });
            } else {
                throw new Error(data.errorMessage || 'Failed to remove specialization');
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: error instanceof Error ? error.message : 'Failed to remove specialization',
                severity: 'error'
            });

            // Trong trường hợp lỗi, fetch lại data để đảm bảo đồng bộ
            await fetchTherapistSpecializations(therapistInfo.therapistId);
        } finally {
            setDeleteConfirmDialog(prev => ({ ...prev, open: false }));
        }
    };

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
                            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
                                <Typography variant="h6" color="#027FC1" fontWeight="medium">
                                    Personal Information
                                </Typography>
                                <Button
                                    startIcon={<Edit />}
                                    onClick={handleOpenEditDialog}
                                    variant="outlined"
                                    color="primary"
                                    size="small"
                                    sx={{
                                        borderRadius: 2,
                                        textTransform: 'none',
                                        '&:hover': {
                                            backgroundColor: 'rgba(2, 127, 193, 0.04)'
                                        }
                                    }}
                                >
                                    Edit Profile
                                </Button>
                            </Box>

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
                                        value={formatDateForInput(therapistInfo.dob)}
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
                                        Gender
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
                                        About your self
                                    </Typography>
                                    <Box display="flex" alignItems="center" mt={1}>
                                        <TextField
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            multiline
                                            rows={3}
                                            disabled
                                            value={therapistInfo.description || "Chưa có thông tin giới thiệu"}
                                            sx={{
                                                "& .MuiOutlinedInput-root": {
                                                    borderRadius: 2,
                                                },
                                            }}
                                        />
                                        {/* <IconButton size="small" sx={{ ml: 1, color: '#027FC1' }}>
                                            <Edit fontSize="small" />
                                        </IconButton> */}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Typography variant="body1" color="textSecondary" fontWeight="medium">
                                            Your Specializations
                                        </Typography>
                                        {therapistSpecializations.length > 0 && (
                                            <Button
                                                startIcon={<AddCircle />}
                                                onClick={handleOpenSpecDialog}
                                                variant="outlined"
                                                color="primary"
                                                size="small"
                                                sx={{
                                                    borderRadius: 2,
                                                    textTransform: 'none',
                                                    '&:hover': {
                                                        backgroundColor: 'rgba(2, 127, 193, 0.04)'
                                                    }
                                                }}
                                            >
                                                Add More Specialization
                                            </Button>
                                        )}
                                    </Box>
                                    <Box display="flex" gap={1} flexWrap="wrap">
                                        {therapistSpecializations.map((spec) => (
                                            <Chip
                                                key={spec.specializationId}
                                                label={spec.name}
                                                onDelete={() => setDeleteConfirmDialog({
                                                    open: true,
                                                    specializationId: spec.specializationId,
                                                    specializationName: spec.name
                                                })}
                                                sx={{
                                                    bgcolor: 'rgba(2, 127, 193, 0.12)',
                                                    color: '#027FC1',
                                                    borderRadius: 2,
                                                    '& .MuiChip-deleteIcon': {
                                                        color: '#027FC1',
                                                        '&:hover': {
                                                            color: '#d32f2f'
                                                        }
                                                    }
                                                }}
                                                title={spec.description}
                                            />
                                        ))}
                                        {therapistSpecializations.length === 0 && (
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                alignItems="center"
                                                justifyContent="center"
                                                width="100%"
                                                py={3}
                                                sx={{
                                                    border: '1px dashed rgba(2, 127, 193, 0.3)',
                                                    borderRadius: 2,
                                                    bgcolor: 'rgba(2, 127, 193, 0.02)'
                                                }}
                                            >
                                                <Typography
                                                    variant="body1"
                                                    color="text.secondary"
                                                    textAlign="center"
                                                    sx={{
                                                        fontStyle: 'italic',
                                                        mb: 1
                                                    }}
                                                >
                                                    You have no specialization yet
                                                </Typography>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    textAlign="center"
                                                >
                                                    Please add specialization to help customers understand your expertise
                                                </Typography>
                                                <Button
                                                    startIcon={<AddCircle />}
                                                    onClick={handleOpenSpecDialog}
                                                    variant="contained"
                                                    color="primary"
                                                    size="medium"
                                                    sx={{
                                                        mt: 2,
                                                        borderRadius: 2,
                                                        textTransform: 'none',
                                                        bgcolor: '#027FC1',
                                                        '&:hover': {
                                                            bgcolor: '#0266A2'
                                                        }
                                                    }}
                                                >
                                                    Add Your First Specialization
                                                </Button>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid>

                                <Grid item xs={12}>
                                    <Typography variant="body1" color="textSecondary" fontWeight="medium" mb={2}>
                                        Certificates
                                    </Typography>
                                    <Box
                                        display="flex"
                                        gap={2}
                                        flexWrap="wrap"
                                    >
                                        {credentials
                                            .filter(credential => !credential.isDisabled)
                                            .map((credential) => (
                                                <Card
                                                    key={credential.credentialId}
                                                    sx={{
                                                        width: 180,
                                                        borderRadius: 2,
                                                        overflow: 'hidden',
                                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                                        transition: 'all 0.3s ease',
                                                        position: 'relative',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
                                                        }
                                                    }}
                                                >
                                                    <CardMedia
                                                        component="img"
                                                        height="120"
                                                        image={credential.imageUrl}
                                                        alt={`Certificate ${credential.credentialId}`}
                                                        sx={{
                                                            cursor: 'pointer',
                                                        }}
                                                        onClick={() => {
                                                            setOpenImageModal(true);
                                                            setSelectedImage(credential.imageUrl);
                                                        }}
                                                    />
                                                    <Box
                                                        sx={{
                                                            position: 'absolute',
                                                            top: 8,
                                                            right: 8,
                                                            bgcolor: 'rgba(255, 255, 255, 0.9)',
                                                            borderRadius: '50%',
                                                            width: 32,
                                                            height: 32,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s ease',
                                                            '&:hover': {
                                                                bgcolor: 'white',
                                                                transform: 'scale(1.1)'
                                                            }
                                                        }}
                                                    >
                                                        <input
                                                            type="file"
                                                            id={`edit-credential-${credential.credentialId}`}
                                                            onChange={(e) => handleCredentialEdit(e, credential.credentialId)}
                                                            accept="image/*"
                                                            style={{ display: 'none' }}
                                                        />
                                                        {editingCredentialId === credential.credentialId ? (
                                                            <CircularProgress size={20} sx={{ color: '#027FC1' }} />
                                                        ) : (
                                                            <IconButton
                                                                size="small"
                                                                onClick={(e) => document.getElementById(`edit-credential-${credential.credentialId}`)?.click()}
                                                                sx={{ color: '#027FC1' }}
                                                            >
                                                                <Edit fontSize="small" />
                                                            </IconButton>
                                                        )}
                                                    </Box>
                                                </Card>
                                            ))}

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
                                                position: 'relative',
                                                '&:hover': {
                                                    borderColor: '#1B9DF0',
                                                    backgroundColor: 'rgba(2, 127, 193, 0.04)'
                                                }
                                            }}
                                        >
                                            <input
                                                type="file"
                                                ref={credentialFileRef}
                                                onChange={handleCredentialUpload}
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                            />
                                            <Button
                                                onClick={() => credentialFileRef.current?.click()}
                                                disabled={uploadingCredential}
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
                                                {uploadingCredential ? (
                                                    <CircularProgress size={24} />
                                                ) : (
                                                    <>
                                                        <AddCircle fontSize="large" />
                                                        <Typography variant="body2">
                                                            Upload Certificate
                                                        </Typography>
                                                    </>
                                                )}
                                            </Button>
                                        </Card>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
            <Dialog
                open={openAvatarModal}
                onClose={handleCloseAvatarModal}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'transparent',
                        boxShadow: 'none'
                    }
                }}
            >
                <img
                    src={avatarUrl || "/Ellipse 27.svg"}
                    alt="Avatar"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        cursor: 'pointer'
                    }}
                    onClick={handleCloseAvatarModal}
                />
            </Dialog>
            <Dialog
                open={openImageModal}
                onClose={handleCloseImage}
                maxWidth="md"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        overflow: 'hidden',
                        bgcolor: 'transparent',
                        boxShadow: 'none'
                    }
                }}
            >
                <img
                    src={selectedImage}
                    alt="Certificate"
                    style={{
                        maxWidth: '100%',
                        maxHeight: '80vh',
                        objectFit: 'contain',
                        cursor: 'pointer'
                    }}
                    onClick={handleCloseImage}
                />
            </Dialog>
            <Dialog
                open={openEditDialog}
                onClose={handleCloseEditDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Edit Profile Information
                </DialogTitle>

                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="First Name"
                                value={editForm.firstName}
                                onChange={handleFormChange('firstName')}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Last Name"
                                value={editForm.lastName}
                                onChange={handleFormChange('lastName')}
                                variant="outlined"
                                size="small"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                type="date"
                                value={editForm.dob}
                                onChange={handleFormChange('dob')}
                                variant="outlined"
                                size="small"
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Gender</InputLabel>
                                <Select
                                    value={editForm.gender}
                                    onChange={handleFormChange('gender')}
                                    label="Gender"
                                >
                                    <MenuItem value="Male">Male</MenuItem>
                                    <MenuItem value="Female">Female</MenuItem>
                                    <MenuItem value="Others">Others</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Description"
                                value={editForm.description}
                                onChange={handleFormChange('description')}
                                variant="outlined"
                                size="small"
                                multiline
                                rows={4}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>

                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCloseEditDialog}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleUpdateProfile}
                        variant="contained"
                        disabled={updating}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100,
                            bgcolor: '#027FC1',
                            '&:hover': {
                                bgcolor: '#0266A2'
                            }
                        }}
                    >
                        {updating ? 'Updating...' : 'Save Changes'}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openSpecDialog}
                onClose={handleCloseSpecDialog}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Add Specialization
                </DialogTitle>
                <DialogContent>
                    <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                        {specializations
                            .filter(spec => !therapistSpecializations.some(
                                therapistSpec => therapistSpec.specializationId === spec.specializationId
                            )).length === 0 ? (
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                width="100%"
                                py={4}
                                gap={2}
                            >
                                <Typography
                                    variant="body1"
                                    color="text.secondary"
                                    textAlign="center"
                                    sx={{ fontStyle: 'italic' }}
                                >
                                    "Maybe you have selected all, you are really good, try to be more confident"
                                </Typography>
                            </Box>
                        ) : (
                            specializations
                                .filter(spec => !therapistSpecializations.some(
                                    therapistSpec => therapistSpec.specializationId === spec.specializationId
                                ))
                                .map((spec) => (
                                    <Chip
                                        key={spec.specializationId}
                                        label={spec.name}
                                        onClick={() => {
                                            handleSpecializationToggle(spec.specializationId);
                                            handleCloseSpecDialog();
                                        }}
                                        sx={{
                                            bgcolor: 'rgba(0, 0, 0, 0.08)',
                                            color: 'text.secondary',
                                            '&:hover': {
                                                bgcolor: 'rgba(2, 127, 193, 0.08)',
                                                color: '#027FC1',
                                            },
                                            borderRadius: 2,
                                            cursor: 'pointer'
                                        }}
                                        title={spec.description}
                                    />
                                ))
                        )}
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={handleCloseSpecDialog}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteConfirmDialog.open}
                onClose={() => setDeleteConfirmDialog(prev => ({ ...prev, open: false }))}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 3,
                        padding: 2
                    }
                }}
            >
                <DialogTitle sx={{ pb: 1 }}>
                    Confirm Remove Specialization
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" color="text.secondary">
                        Are you sure you want to remove "{deleteConfirmDialog.specializationName}" from your specializations?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button
                        onClick={() => setDeleteConfirmDialog(prev => ({ ...prev, open: false }))}
                        variant="outlined"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() => handleDeleteSpecialization(
                            deleteConfirmDialog.specializationId,
                            deleteConfirmDialog.specializationName
                        )}
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            minWidth: 100
                        }}
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
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
