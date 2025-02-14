import { AppBar, Box, Button, Toolbar } from "@mui/material";
import { JSX } from "react";
import {Link, useNavigate} from "react-router";

const HeaderLogin = (): JSX.Element => {
    const nav = useNavigate()
    const naviagate =()=>{
        nav("/")
    }
    return (
        <AppBar position="static" sx={{ backgroundColor: "white", boxShadow: "none" }}>
            <Toolbar
                sx={{
                    justifyContent: "space-between",
                    width: "100%",
                    maxWidth: "1440px",
                    margin: "0 auto",
                }}
            >
                <Box
                    onClick={()=>naviagate()}
                    component="img"
                    src="/Logo.png"
                    alt="Logo"
                    sx={{ width: 203, height: 63 }}
                />
                <Box 
                    sx={{ display: "flex", alignItems: "center" }}
                >
                    <Link to="/login">
                        <Button 
                            variant="contained"
                            color="primary"
                            sx={{ marginRight: 2, borderRadius: 1, textTransform: "none" }}
                        >
                            Sign In
                        </Button>
                    </Link>
                    <Link to="/register">
                        <Button 
                            variant="outlined"
                            color="primary"
                            sx={{ marginRight: 2, borderRadius: 1, textTransform: "none" }}
                        >
                            Sign Up
                        </Button>
                    </Link>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderLogin;