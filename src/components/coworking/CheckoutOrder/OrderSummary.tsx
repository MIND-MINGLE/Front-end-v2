import { Box, Button, Divider, Typography } from "@mui/material";
import React from "react";
import styles from './CheckoutOrder.module.css';

const OrderSummary = (): React.JSX.Element => {
  return (
    <Box
      className={styles.orderSummary}
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      pt={0}
      pb={6}
      px={0}
      bgcolor="white"
      border={1}
      borderColor="grey.100"
    >
      <Box display="flex" alignItems="start" gap={2.5} px={6} py={5}>
        <Typography
          variant="h6"
          component="div"
          color="textPrimary"
          sx={{ width: 376, mt: -1 }}
        >
          Order Summary
        </Typography>
      </Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="start"
        gap={4}
        pt={0}
        pb={6}
        px={0}
      >
        <Box display="flex" flexDirection="column" alignItems="start" gap={3} pt={0} pb={1} px={0}>
          <Box display="flex" justifyContent="space-between" width={376}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: -1 }}>
              Sub-total
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="textPrimary" sx={{ mt: -1 }}>
              $320
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width={376}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: -1 }}>
              Discount
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="textPrimary" sx={{ mt: -1 }}>
              $24
            </Typography>
          </Box>
          <Box display="flex" justifyContent="space-between" width={376}>
            <Typography variant="body2" color="textSecondary" sx={{ mt: -1 }}>
              Tax
            </Typography>
            <Typography variant="body2" fontWeight="bold" color="textPrimary" sx={{ mt: -1 }}>
              $61.99
            </Typography>
          </Box>
          <Box width={376} />
        </Box>
        <Divider sx={{ width: 376 }} />
        <Box display="flex" justifyContent="space-between" width={376}>
          <Typography variant="body1" fontWeight="medium" color="textPrimary" sx={{ mt: -1 }}>
            Total
          </Typography>
          <Typography variant="body1" fontWeight="bold" color="textPrimary" sx={{ mt: -1 }}>
            $357.99 USD
          </Typography>
        </Box>
      </Box>
      <a href="/LandingPage/ThankYouPage">
        <Button variant="contained" color="primary" sx={{ px: 11, py: 2, borderRadius: 1 }}>
          Place Order
        </Button>
      </a>
    </Box>
  );
};

export default OrderSummary;
