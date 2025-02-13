"use client";
import {
    Box,
    Button as MuiButton,
    Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import Link from "next/link";

const GradientButton = styled(MuiButton)({
    width: "100%",
    maxWidth: "340px", 
    minWidth: "340px",
    height: "70px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "2.5px",
    padding: "11px 2px",
    background: "linear-gradient(180deg, rgb(0,119,182) 0%, rgb(27,157,240) 100%)",
    borderRadius: "20px",
    border: "1px solid transparent",
    color: "white",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    fontWeight: 500,
    fontSize: "20px",
    textAlign: "center",
    textTransform: "none",
    margin: "20px 0",
});

export const Frame = () => {
    return (
<Box
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="70vh"
    width="100%"
>
    <Box display="flex" justifyContent="center"  width="100%">
        <Box width="100%" maxWidth="1200px">
            <Grid container spacing={4}>
                {/* Button Column */}
                <Grid
                    item
                    xs={12}
                    md={4}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                >
                    <Link href="/ProfessorPage/ThankYouPage">
                        <GradientButton>Book a workspace</GradientButton>
                    </Link>

                    <Link href="/ProfessorPage/ProfessorCalendar" passHref>
                        <GradientButton>Create an appointment</GradientButton>
                    </Link>

                    <Link href="/ProfessorPage/ProfessorWorkshop" passHref>
                        <GradientButton>Create a workshop</GradientButton>
                    </Link>
                </Grid>

                {/* Image Column */}
                <Grid item xs={12} md={8} display="flex" justifyContent="center">
                    <Box
                        sx={{
                            width: "100%",
                            maxWidth: 600,
                            height: "auto",
                            position: "relative",
                        }}
                    >
                        <Link href="/ProfessorPage/ThankYouPage">
                            <Box
                                component="img"
                                sx={{
                                    width: "100%",
                                    height: "auto",
                                    borderRadius: "20px", 
                                    objectFit: "cover",
                                }}
                                alt="Calendar"
                                src="/calendar.png"
                            />
                        </Link>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    </Box>
</Box>

    );
};

export default Frame;
