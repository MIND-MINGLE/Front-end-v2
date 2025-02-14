import React from "react";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import {Link} from "react-router";

type EnterCodeProps = {
  onCancel: () => void; // Add onCancel prop type
};

const EnterCode: React.FC<EnterCodeProps> = ({ onCancel }): React.JSX.Element => {
  return (
    <Box
      sx={{
        width: 586,
        height: 350,
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "primary.main",
        p: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h6"
        color="primary"
        sx={{ textAlign: "center", mb: 1 }}
      >
        Enter security code
      </Typography>

      <Divider sx={{ width: "100%", mb: 2 }} />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ textAlign: "center", mb: 1 }}
      >
        Please check the code in your email.{" "}
        <Typography color="text.primary" component="span">
          This code consists of 6 numbers.
        </Typography>
      </Typography>

      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <TextField
          placeholder="Enter code"
          variant="outlined"
          sx={{
            width: "75%",
            maxWidth: 300,
            borderRadius: 1,
          }}
        />

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", mt: 1 }}
        >
          We sent you the code to:
        </Typography>
        <Typography
          variant="body2"
          color="text.primary"
          sx={{ textAlign: "center" }}
        >
          babiemxinh212@gmail.com
        </Typography>
      </Box>

      <Divider sx={{ width: "100%", my: 2 }} />

      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
          marginBottom: 6,
          marginTop: -2,
        }}
      >
        <Button
          variant="contained"
          sx={{
            bgcolor: "grey.400",
            color: "text.primary",
            width: 100,
            borderRadius: 1,
          }}
          onClick={onCancel} 
        >
          Cancel
        </Button>
        <Link to="/login/changepassword">
            <Button
            variant="contained"
            sx={{
                bgcolor: "primary.main",
                color: "common.white",
                width: 100,
                borderRadius: 1,
            }}
            >
            Continue
            </Button>
        </Link>
      </Box>

      <Typography
        variant="body2"
        color="primary"
        sx={{ textAlign: "center", mt: 2 }}
      >
        Don’t have the code yet?
      </Typography>
    </Box>
  );
};

export default EnterCode;
