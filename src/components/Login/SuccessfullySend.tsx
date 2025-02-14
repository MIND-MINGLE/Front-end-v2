import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Typography, Avatar, Button } from '@mui/material';
import React from 'react';

type SuccessfullySendProps = {
    onContinue: () => void;
};

const SuccessfullySend: React.FC<SuccessfullySendProps> = ({ onContinue }) => {
    return (
        <Box
            sx={{
                width: 463,
                height: 292,
                bgcolor: 'background.paper',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 4,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                p: 4,
            }}
        >
            <Box
                sx={{
                    textAlign: 'center',
                    position: 'relative',
                }}
            >
                <Avatar
                    sx={{
                        width: 60,
                        height: 60,
                        bgcolor: 'success.main',
                        mx: 'auto',
                        mb: 3,
                        boxShadow: 3,
                    }}
                >
                    <CheckCircleIcon sx={{ color: 'background.paper', fontSize: 34 }} />
                </Avatar>
                
                <Typography
                    variant="h6"
                    sx={{
                        color: 'success.main',
                        fontWeight: 'bold',
                        mb: 2,
                    }}
                >
                    Code Sent Successfully!
                </Typography>
                
                <Typography
                    variant="body2"
                    sx={{
                        color: 'text.secondary',
                        mb: 3,
                    }}
                >
                    A reset code has been sent to your registered email. Please check your inbox.
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={onContinue}
                    sx={{
                        background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 94.27%)",
                        color: 'white',
                        borderRadius: 2,
                        px: 5,
                        py: 1.2,
                        boxShadow: 2,
                        ':hover': {
                            background: "linear-gradient(180deg, rgb(0,139,202) 0%, rgb(27,167,250) 94.27%)",
                        },
                    }}
                >
                    Confirm
                </Button>
            </Box>
        </Box>
    );
};

export default SuccessfullySend;
