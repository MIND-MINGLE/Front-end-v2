import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Typography,
  styled,
} from "@mui/material";
import Footer from "../coworking/Components/Footer/Footer";
import CopyrightFooter from "../coworking/Components/CopyrightFooter/CopyrightFooter";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { AccountProps } from "../../interface/IAccount";

const roles = [
  {
    title: "Therapist Seeker",
    image: "/Ellipse 30.svg",
    link: "/seeker/",
  },
  { title: "Therapist", 
    image: "/Ellipse 27.svg",
    link: "/doctor/"
  },
  { title: "Co-working Space Agent", 
    image: "/Ellipse 33.svg", 
    link: "/agent/" 
  },
];

const GradientAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(14),
  height: theme.spacing(14),
  border: `5px solid ${theme.palette.primary.main}`,
  background:
    "linear-gradient(180deg, rgba(2, 127, 193, 0.84) 0%, rgba(0, 180, 216, 0.66) 46.35%, rgba(0, 180, 216, 0.61) 74.48%, rgba(27, 157, 240, 0.66) 94.27%)",
}));

const LandingPage = () => {
const nav = useNavigate()
const naviagate =(url:string)=>{
  nav(url)
}
useEffect(()=>{
  const autoLogin = ()=>{
    const user = localStorage.getItem("token"); // Store user token in local. Don't worry it expired
    if(!user){
      console.error("No account found");
      return false; 
    }
    else{
      var token = jwtDecode<AccountProps>(user||"");
      sessionStorage.setItem("account", JSON.stringify(token));
      switch(token.Role){
        case "seeker":
          nav("/seeker/")
          break;
        case "doc":
          nav("/doctor/")
          break;
        case "agent":
          nav("/agent/")
          break;
        default:
          nav("/")
      }
      return true; 
    }
  }
  autoLogin()
},[])
  return (
    <Box
      sx={{
        background: "linear-gradient(180deg, #DFF6FF 100%, #FFFFFF 100%)",
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <Box
        component="img"
        sx={{
          position: "relative",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "80%",
          maxWidth: "700px",
          height: "auto",
          objectFit: "cover",
          marginBottom: 5,
          "@media (min-width: 1920px)": {
            width: "70%",
          },
          "@media (min-width: 1280px) and (max-width: 1919px)": {
            width: "75%",
          },
          "@media (max-width: 1279px)": {
            width: "90%",
          },
        }}
        alt="Logo"
        src="/Logo1.png"
      />
      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{ marginBottom: 10 }}
      >
        {roles.map((role, index) => (
          <Grid item key={index}>
            <Button
              onClick={() => naviagate(role.link)}
            >
              <Card
                sx={{
                  width: 304,
                  height: 508,
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "transform 0.3s, opacity 0.3s",
                  "&:hover": {
                    transform: "scale(1.05)",
                    opacity: 0.9,
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: 8,
                  }}
                >
                  <GradientAvatar src={role.image} alt={role.title} />
                  <Typography
                    variant="h6"
                    color="primary"
                    sx={{ mt: 2, textAlign: "center", marginTop: 15 }}
                  >
                    {role.title}
                  </Typography>
                </CardContent>
              </Card>
            </Button>
          </Grid>
        ))}
      </Grid>
      <Footer />
      <CopyrightFooter />
    </Box>
  );
};

export default LandingPage;
