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
        >
            {/* Part 1: Navigation Rail */}
            <Box 
                width="88px"
                height="2015px"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={2}
                pt={2}
                pb={2}
                position="absolute"
                top={0}
                left={0}
                bgcolor="white"
            >
                <NavigationRail />
            </Box>

            {/* Part 2: Main Content */}
            <Box
                sx={{
                    flex: 1,
                    background: "linear-gradient(180deg, #0077B6 0%, #1B9DF0 50%, #DFF6FF 100%)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: "20px",
                    minHeight: "100vh",
                }}
            >
                <Box sx={{ marginTop: 10 }}>
                    <Frame />
                </Box>
            </Box>
        </Box>
    );
};

export default SeekerPage;
