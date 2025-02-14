
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";

const SignUpForm = ({ onCreateAccount }: { onCreateAccount: () => void }) => (
  <Box
    sx={{
      width: 600,
      bgcolor: "background.paper",
      borderRadius: 2,
      boxShadow: 3,
      p: 4,
      m: "auto",
      mt: 5,
      maxWidth: "90%",
    }}
  >
    <Typography variant="h5" color="primary" sx={{ mb: 2, fontWeight: 500 }}>
      Sign up to Mindmingle
    </Typography>

    <Box sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            fullWidth 
            label="Full Name" 
            placeholder="Your full name" 
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email or Phone Number"
            placeholder="Your email address or phone number"
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Password"
            placeholder="Your password"
            variant="outlined"
            size="small"
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Confirm Password"
            placeholder="Confirm your password"
            variant="outlined"
            size="small"
            type="password"
          />
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 500 }}>Birthday</Typography>
          <Grid container spacing={2}>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Day</InputLabel>
                <Select label="Day" defaultValue={2} IconComponent={ArrowDropDownIcon}>
                  <MenuItem value={2}>2</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Month</InputLabel>
                <Select label="Month" defaultValue="December" IconComponent={ArrowDropDownIcon}>
                  {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].map((month) => (
                    <MenuItem key={month} value={month}>{month}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Year</InputLabel>
                <Select label="Year" defaultValue={2022} IconComponent={ArrowDropDownIcon}>
                  <MenuItem value={2022}>2022</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
    
        <Grid item xs={12} sx={{ mt: 3 }}>
        <Typography color="text.primary" sx={{ fontWeight: 600 }}>
            Gender
        </Typography>
        <RadioGroup row sx={{ mt: 1 }}>
            <FormControlLabel
            value="female"
            control={<Radio />}
            label="Female"
            sx={{ color: "text.primary", mr: 3 }} 
            />
            <FormControlLabel
            value="male"
            control={<Radio />}
            label="Male"
            sx={{ color: "text.primary", mr: 3 }}
            />
            <FormControlLabel
            value="other"
            control={<Radio />}
            label="Other"
            sx={{ color: "text.primary" }}
            />
        </RadioGroup>
        </Grid>
      </Grid>
    </Box>

    <Box 
      sx={{ 
        display: "center",
        alignItems: "center",
        mt: 3,
      }}
    >
      <Checkbox />
      <Typography variant="body2" color="textSecondary">
        I agree to{" "}
        <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
          Terms of Use
        </Typography>{" "}
        and{" "}
        <Typography component="span" color="primary" sx={{ fontWeight: 500 }}>
          Privacy Policy
        </Typography>
      </Typography>
    </Box>

    <Button
      variant="contained"
      color="primary"
      sx={{
        mt: 3,
        width: "100%",
        py: 1,
        fontSize: "1rem",
        fontWeight: 500,
        borderRadius: 1,
      }}
      onClick={onCreateAccount}
    >
      Create Account
    </Button>
  </Box>
);

export default SignUpForm;