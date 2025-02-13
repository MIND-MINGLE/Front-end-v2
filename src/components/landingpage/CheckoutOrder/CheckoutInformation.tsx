import { AddCircle, CreditCard, AttachMoney } from "@mui/icons-material";
import {
  Box,
  Card,
  CardMedia,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import styles from './CheckoutOrder.module.css';

export const CheckoutInformation = (): React.JSX.Element => {
  return (
    <Box className={styles.checkoutInformation} display="flex" flexDirection="column" gap={4}>
      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" color="primary">Billing Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField fullWidth label="First Name" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Last Name" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Company Name (Optional)" variant="outlined" />
          </Grid>
          <Grid item xs={12}>
            <TextField fullWidth label="Address" variant="outlined" />
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Country</InputLabel>
              <Select label="Country">
                <MenuItem value="">
                  <em>Select...</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>Region/State</InputLabel>
              <Select label="Region/State">
                <MenuItem value="">
                  <em>Select...</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <FormControl fullWidth>
              <InputLabel>City</InputLabel>
              <Select label="City">
                <MenuItem value="">
                  <em>Select...</em>
                </MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={3}>
            <TextField fullWidth label="Zip Code" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Email" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth label="Phone Number" variant="outlined" />
          </Grid>
        </Grid>
        <FormControlLabel
          control={<Checkbox />}
          label="Ship to a different address"
          color="primary"
        />
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" color="primary">Payment Methods</Typography>
        <Box display="flex" gap={2}>
          <Card variant="outlined">
            <CardMedia
              component="img"
              height="95"
              image="/visa-prepaid-card-800x450-1-1.png"
              alt="Visa Prepaid"
            />
          </Card>
          <Card variant="outlined">
            <CardMedia
              component="img"
              height="95"
              image="/prepaid-mastercard-card-1280x720-1.png"
              alt="Mastercard Prepaid"
            />
          </Card>
          <Card
            sx={{
              variant: "outlined",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 1,
            }}
          >
            <IconButton>
              <AddCircle fontSize="large" />
            </IconButton>
            <Typography>Add Card</Typography>
          </Card>
        </Box>

        <Box display="flex" gap={2} alignItems="center">
          <Box display="flex" flexDirection="column" alignItems="center">
            <AttachMoney fontSize="large" />
            <Typography color="primary">Cash on Delivery</Typography>
            <Checkbox />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src="/icon.svg"
              alt="Venmo"
              style={{ width: 32, height: 32 }}
            />
            <Typography color="primary">Venmo</Typography>
            <Checkbox />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src="/image-9.png"
              alt="PayPal"
              style={{ width: 32, height: 32 }}
            />
            <Typography color="primary">PayPal</Typography>
            <Checkbox />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" flexDirection="column" alignItems="center">
            <img
              src="/amazon-icon-1-1.svg"
              alt="Amazon Pay"
              style={{ width: 32, height: 32 }}
            />
            <Typography color="primary">Amazon Pay</Typography>
            <Checkbox />
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box display="flex" flexDirection="column" alignItems="center">
            <CreditCard fontSize="large" />
            <Typography color="primary">Debit/Credit Card</Typography>
            <Checkbox defaultChecked sx={{ color: "#3bb77e" }} />
          </Box>
        </Box>
      </Box>

      <Box display="flex" flexDirection="column" gap={2}>
        <Typography variant="h6" color="primary">Additional Information</Typography>
        <TextField
          fullWidth
          label="Order Notes (Optional)"
          multiline
          rows={4}
          placeholder="Notes about your order, e.g., special notes for delivery"
          variant="outlined"
        />
      </Box>
    </Box>
  );
};

export default CheckoutInformation;
