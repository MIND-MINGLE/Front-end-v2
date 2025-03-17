import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Divider,
    Stack,
    Tooltip,
    Fade,
} from '@mui/material';
import React, { useState } from 'react';
import VisaLogo from './assets/visa.png'; // Thêm hình ảnh Visa (tải từ internet hoặc tài nguyên)
import MasterCardLogo from './assets/mastercard.png'; // Thêm hình ảnh Mastercard
import PayPalLogo from './assets/paypal.png'; // Thêm hình ảnh PayPal

export const AddCard = (): React.JSX.Element => {
    const [cardType, setCardType] = useState('visa');

    const cardOptions = [
        { type: 'visa', label: 'Visa', icon: VisaLogo, color: '#1976D2' },
        { type: 'mastercard', label: 'MasterCard', icon: MasterCardLogo, color: '#FF4400' },
        { type: 'paypal', label: 'PayPal', icon: PayPalLogo, color: '#0070BA' },
    ];

    return (
        <Paper
            elevation={6}
            sx={{
                p: 4,
                borderRadius: 3,
                maxWidth: 600,
                mx: 'auto',
                bgcolor: '#FFFFFF',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-5px)',
                },
            }}
        >
            <Typography
                variant="h4"
                fontWeight="bold"
                mb={4}
                color="#027FC1"
                textAlign="center"
                sx={{
                    background: 'linear-gradient(45deg, #027FC1, #1B9DF0)',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                }}
            >
                Thêm Thẻ Thanh Toán
            </Typography>

            <Divider sx={{ mb: 4, borderColor: '#E3F2FD' }} />

            <Stack spacing={4}>
                <FormControl fullWidth variant="outlined">
                    <InputLabel id="country-label" sx={{ color: '#027FC1' }}>
                        Quốc gia
                    </InputLabel>
                    <Select
                        labelId="country-label"
                        defaultValue="vietnam"
                        label="Quốc gia"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '& fieldset': { borderColor: '#E3F2FD' },
                                '&:hover fieldset': { borderColor: '#027FC1' },
                                '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                            },
                        }}
                    >
                        <MenuItem value="vietnam">Việt Nam</MenuItem>
                        <MenuItem value="usa">Hoa Kỳ</MenuItem>
                        <MenuItem value="singapore">Singapore</MenuItem>
                    </Select>
                </FormControl>

                <Box>
                    <Typography variant="h6" mb={2} color="#027FC1" fontWeight="medium">
                        Chọn loại thẻ
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        {cardOptions.map((option) => (
                            <Tooltip title={option.label} key={option.type}>
                                <Paper
                                    elevation={cardType === option.type ? 8 : 2}
                                    sx={{
                                        p: 3,
                                        borderRadius: 2,
                                        cursor: 'pointer',
                                        border: cardType === option.type ? `3px solid ${option.color}` : '1px solid #E3F2FD',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.05)',
                                            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
                                        },
                                        bgcolor: cardType === option.type ? '#E3F2FD' : 'transparent',
                                    }}
                                    onClick={() => setCardType(option.type)}
                                >
                                    <Box
                                        component="img"
                                        src={option.icon}
                                        alt={option.label}
                                        sx={{
                                            width: 60,
                                            height: 40,
                                            objectFit: 'contain',
                                            filter: cardType === option.type ? 'none' : 'grayscale(80%)',
                                        }}
                                    />
                                    <Typography
                                        variant="body1"
                                        mt={1}
                                        color={cardType === option.type ? option.color : 'text.secondary'}
                                        fontWeight={cardType === option.type ? 'bold' : 'normal'}
                                    >
                                        {option.label}
                                    </Typography>
                                </Paper>
                            </Tooltip>
                        ))}
                    </Box>
                </Box>

                <TextField
                    label="Số thẻ"
                    fullWidth
                    placeholder="XXXX XXXX XXXX XXXX"
                    variant="outlined"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#E3F2FD' },
                            '&:hover fieldset': { borderColor: '#027FC1' },
                            '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                            borderRadius: 2,
                        },
                    }}
                />

                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <TextField
                            label="Tên trên thẻ"
                            fullWidth
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#E3F2FD' },
                                    '&:hover fieldset': { borderColor: '#027FC1' },
                                    '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            label="CVV"
                            fullWidth
                            placeholder="XXX"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#E3F2FD' },
                                    '&:hover fieldset': { borderColor: '#027FC1' },
                                    '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <TextField
                            label="Tháng hết hạn"
                            fullWidth
                            placeholder="MM"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#E3F2FD' },
                                    '&:hover fieldset': { borderColor: '#027FC1' },
                                    '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            label="Năm hết hạn"
                            fullWidth
                            placeholder="YY"
                            variant="outlined"
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#E3F2FD' },
                                    '&:hover fieldset': { borderColor: '#027FC1' },
                                    '&.Mui-focused fieldset': { borderColor: '#027FC1' },
                                    borderRadius: 2,
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                        mt: 3,
                        py: 2,
                        borderRadius: 2,
                        background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                        boxShadow: '0 4px 12px rgba(33, 203, 243, .3)',
                        color: '#FFFFFF',
                        fontWeight: 'bold',
                        '&:hover': {
                            background: 'linear-gradient(45deg, #1976D2 30%, #1B9DF0 90%)',
                            boxShadow: '0 6px 20px rgba(33, 203, 243, .5)',
                            transform: 'scale(1.02)',
                        },
                    }}
                >
                    Thêm Thẻ
                </Button>
            </Stack>
        </Paper>
    );
};

export default AddCard;