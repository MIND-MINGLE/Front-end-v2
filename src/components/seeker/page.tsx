/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { Box, Divider, Typography } from '@mui/material';
import { JSX, useState } from 'react';
import NavigationRail from './NavBar';
import Footer from '../coworking/Components/Footer/Footer';
import CopyrightFooter from '../coworking/Components/CopyrightFooter/CopyrightFooter';
import TherapyMatchingForm from './TherapyMatchingForm/TherapyMatchingForm';
import TherapistConnector from './Connector/Connector';
import {Link} from 'react-router';
import { AnimatePresence, motion } from "framer-motion";


const SeekerPage = (): JSX.Element => {
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
    };
    return (
        <Box
            sx={{
                display: "flex",
                height: "100%",
                width: "100vw",
            }}
        >
            {/* Part 1: Navigation Rail */}
            <Box 
                sx={{
                    display: "flex",
                    minHeight: "100%",
                    backgroundColor: "white",
                }}
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
                    height: "calc(100% - 100px)",
                }}
            >
                {/* Image at the top */}
                <Link to="/">
                    <Box
                        component="img"
                        src="/LogoWhite.png"
                        alt="Untitled"
                        sx={{
                            width: "272px",
                            height: "87px",
                            objectFit: "cover",
                            marginBottom: "20px",
                        }}
                    />
                </Link>

                {/* Title Typography */}
                <Box width="100%" justifyItems="center" alignItems="center" ml={8} mb={2}>
                    <Typography 
                        variant="h4" 
                        align="center" 
                        sx={{ 
                            fontFamily: "Roboto-Medium, Helvetica", 
                            fontWeight: "medium", 
                            color: "white",
                            lineHeight: "normal",
                        }} 
                    > 
                        Convenient and affordable therapy with <br /> 
                        <Box component="span" color="#dff6ff">MindMingle</Box>
                    </Typography>
                </Box>

                {/* Horizontal Divider */}
                <Divider sx={{ width: "80%", mb: 2 }} />

                {/* Conditional rendering of TherapyMatchingForm or TherapistConnector */}
                <Box alignItems="center" justifyItems="center" width="100%" mb={4}>
                    <AnimatePresence mode="wait">
                        {!isClicked ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TherapyMatchingForm onClick={handleClick} />
                        </motion.div>
                        ) : (
                        <motion.div
                            key="connector"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <TherapistConnector />
                        </motion.div>
                        )}
                    </AnimatePresence>
                </Box>

                {/* Footer Components */}
                <Box width="100%" >
                    <Footer />
                    <CopyrightFooter />
                </Box>
            </Box>
        </Box>
    );
};

export default SeekerPage;
