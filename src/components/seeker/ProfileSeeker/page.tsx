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
            {/* Part 1: Navigation Rail */}
            <Box
                width={{ xs: "80px", md: "110px" }} // Đồng bộ với NavigationRail
                height="100vh"
                display="flex"
                flexDirection="column"
                alignItems="center"
                position="fixed" // Đảm bảo NavigationRail luôn cố định
                top={0}
                left={0}
                zIndex={1000}
            >
                <NavigationRail />
            </Box>

            {/* Part 2: Main Content */}
            <Box
                sx={{
                    flex: 1,
                    marginLeft: { xs: "80px", md: "110px" }, // Đẩy nội dung chính sang phải để không bị che bởi NavigationRail
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: { xs: "20px", md: "40px" }, // Tăng padding trên desktop
                    minHeight: "100vh",
                    background: "rgba(255, 255, 255, 0.1)", // Nền nhẹ để tạo chiều sâu
                    backdropFilter: "blur(5px)", // Hiệu ứng mờ nền
                }}
            >
                <Box sx={{ width: "100%", maxWidth: "1400px", marginTop: { xs: 5, md: 10 } }}>
                    <Frame />
                </Box>
            </Box>
        </Box>
    );
};

export default SeekerPage;