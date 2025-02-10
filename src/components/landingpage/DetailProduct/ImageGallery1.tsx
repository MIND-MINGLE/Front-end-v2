import React from 'react';
import { Box, Grid, Typography } from '@mui/material';

const Frame = (): React.JSX.Element => {
  return (
    <Box sx={{ position: "relative", width: "100%", maxWidth: "1029px", height: "433px" }}>
      <Typography
        sx={{
          fontWeight: "medium",
          color: "primary.main",
          fontSize: "body1.fontSize",
          letterSpacing: "body1.letterSpacing",
          lineHeight: "body1.lineHeight",
          whiteSpace: "nowrap",
          position: "absolute",
          top: "0",
          left: "0",
          bottom: "0",
        }}
      >
        More Image
      </Typography>
      <Grid
        container
        spacing={2}
        sx={{
          position: "relative",
          top: "20px",
          left: "0",
          width: "100%",
          height: "394px"
        }}
      >
        <Grid item xs={6}>
          <Box
            component="img"
            src="/Rectangle 11.png"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
            alt="Rectangle 1"
          />
        </Grid>
        <Grid item xs={3}>
          <Box
            component="img"
            src="/Rectangle 12.png"
            sx={{ width: "100%", height: "188px", objectFit: "cover" }}
            alt="Rectangle 12"
          />
          <Box
            component="img"
            src="/Rectangle 14.png"
            sx={{ width: "100%", height: "186px", marginTop: "18px", objectFit: "cover" }}
            alt="Rectangle 14"
          />
        </Grid>
        <Grid item xs={3}>
          <Box
            component="img"
            src="/Rectangle 13.png"
            sx={{ width: "100%", height: "188px", objectFit: "cover" }}
            alt="Rectangle 13"
          />
          <Box sx={{ position: "relative", width: "100%", height: "188px", marginTop: "18px", overflow: "hidden" }}>
            {/* Actual image */}
            <Box
              component="img"
              src="/Rectangle 15.png"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
              }}
              alt="Rectangle 15"
            />
            {/* Faded overlay */}
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
              }}
            />
            {/* Box for the "+5" text */}
            <Box
              sx={{
                position: "absolute",
                top: "40px",
                left: "50px",
                fontWeight: "medium",
                color: "common.white",
                fontSize: "h1.fontSize",
                letterSpacing: "h1.letterSpacing",
                lineHeight: "h1.lineHeight",
                whiteSpace: "nowrap",
              }}
            >
              +5
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Frame;
