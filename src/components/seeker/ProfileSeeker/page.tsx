"use client";
import { Box } from '@mui/material';
import React from 'react';
import NavigationRail from '../NavBar';
import Frame from './index';

const SeekerPage = (): React.JSX.Element => {
    return (

        <Box
            width="100vw"
            height="100vh"
            overflow="hidden"
            position="relative"
            display="flex"
            sx={{
                background: "linear-gradient(135deg, #0077B6 0%, #1B9DF0 50%, #E3F2FD 100%)", // Gradient mượt hơn
                animation: "fadeIn 1s ease-in-out", // Hiệu ứng fade-in khi tải trang
                "@keyframes fadeIn": {
                    "0%": { opacity: 0 },
                    "100%": { opacity: 1 },
                },
            }}
        >

            {/* Part 2: Main Content */}
            <Box
                sx={{
                    flex: 1,
                    marginLeft: { xs: "80px", md: "100px" }, // Đẩy nội dung chính sang phải để không bị che bởi NavigationRail
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: { xs: "20px", md: "10px" }, // Tăng padding trên desktop
                    minHeight: "auto",
                    background: "rgba(255, 255, 255, 0.1)", // Nền nhẹ để tạo chiều sâu
                    backdropFilter: "blur(5px)", // Hiệu ứng mờ nền
                }}
            >
                    <Frame />
            </Box>
        </Box>

    );
};

export default SeekerPage;