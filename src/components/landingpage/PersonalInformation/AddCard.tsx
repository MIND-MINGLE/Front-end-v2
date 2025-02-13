import PayPalIcon from '@mui/icons-material/AccountBalanceWallet';
import VisaIcon from '@mui/icons-material/CreditCard';
import MasterCardIcon from '@mui/icons-material/CreditCard';
import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography
} from '@mui/material';
import React from 'react';

export const AddCard = (): React.JSX.Element => {
    return (
        <Box display="flex" justifyContent="center" width="100%" bgcolor="white">
            <Box width={447} height={369} bgcolor="white" p={2} boxShadow={1}>
                <Typography variant="h6" color="primary" gutterBottom>
                    Add card
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Name On Card"
                            defaultValue="Nguyen Thi Ai Quynh"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Card Number"
                            defaultValue="123 456 789 100"
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} container alignItems="center" spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Expiration Date"
                                defaultValue="28/20"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="CVV"
                                defaultValue="133"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container alignItems="center" spacing={2}>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="outlined" size="small">
                                <InputLabel>Country</InputLabel>
                                <Select defaultValue="Viet Nam" label="Country">
                                    <MenuItem value="Viet Nam">Viet Nam</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Zip Code"
                                defaultValue="123456"
                                variant="outlined"
                                size="small"
                            />
                        </Grid>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        alignItems="center"
                    >
                        <Typography
                            variant="body2"
                            color="secondary"
                            style={{ marginRight: 8 }}
                        >
                            Accepted cards
                        </Typography>
                        <VisaIcon style={{ marginRight: 8 }} />
                        <MasterCardIcon style={{ marginRight: 8 }} />
                        <PayPalIcon />
                    </Grid>
                    <Grid item xs={12} container justifyContent="center">
                        <Button variant="contained" color="primary">
                            Add card
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

export default AddCard;
