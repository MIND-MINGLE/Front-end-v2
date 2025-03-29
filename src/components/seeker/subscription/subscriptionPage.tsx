import { useEffect, useState } from 'react';
import styles from './subscription.module.css';
import { PaymentRequest, PurchasedPackagedRequest, Subscription } from '../../../interface/IAccount';
import { getAllSubscription } from '../../../api/Subscription/Subscription';
import LoadingScreen from '../../common/LoadingScreen';
import { formatPriceToVnd } from '../../../services/common';
import { Modal, Button, Snackbar, Alert, Box, Typography, Link } from '@mui/material';
import { ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../services/firebase';
import { createSubPayment } from '../../../api/Payment/PaymentApi';
import { createSubscription } from '../../../api/PackageApi/Package';



// API call for creating payment (unchanged)
const createPayment = async (paymentData: PaymentRequest) => {
  const response = await createSubPayment(paymentData)
  if(response.statusCode === 200) {
    return response;
  }else{
    alert("Please Try Again")
  }
  
};

export default function SubscriptionPage() {
  const [subscriptionData, setSubscriptionData] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPackage, setCurrentPackage] = useState<Subscription | null>(null); // Store packageName 
  const [paymentUrl, setPaymentUrl] =useState<string|null>(null);
  const subscriptionsDetail = [
    {
      features: ["10% discounts on each session", "Basic Audio Call", "Email support"],
      description: "Perfect for beginners and casual users",
      isPremium: false,
    },
    {
      features: [
        "30% discounts on each session",
        "Background Music (Customization support)",
        "Priority 24/7 support",
        "Video calling chat",
        "Custom your avatar",
      ],
      description: "For dedicated users seeking advanced features",
      isPremium: true,
    },
  ];

  useEffect(() => {
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        // Get current package from sessionStorage
        const currentPackage = sessionStorage.getItem("package");
        if (currentPackage) {
          setCurrentPackage(JSON.parse(currentPackage)); // Assuming this is packageName or subscriptionId
        }

        // Fetch subscription data
        const subData = await getAllSubscription();
        if (subData.statusCode === 200) {
          const mergedSubscriptions = subData.result?.map((subData: Subscription, index: number) => ({
            ...subData,
            ...subscriptionsDetail[index],
          }));
          setSubscriptionData(mergedSubscriptions);
        }
      } catch (error) {
        console.error("Error fetching subscriptions:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
  }, []);

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>();
  const [openQRModal, setOpenQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string>('');
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  // Handlers
  const handleSelectSubscription = (subscription: Subscription) => {
    const qrImage = subscription.isPremium
      ? 'https://firebasestorage.googleapis.com/v0/b/mind-mingle-202.firebasestorage.app/o/momo%2F300kmomo.jpg?alt=media&token=5be4351b-d12b-4c96-b737-10fc1cd2bf80'
      : 'https://firebasestorage.googleapis.com/v0/b/mind-mingle-202.firebasestorage.app/o/momo%2F100kmomo.jpg?alt=media&token=218c20b8-7d7e-4771-8020-f97569bdbf5b';
    setSelectedSubscription(subscription);
    setSelectedQR(qrImage);
    setOpenQRModal(true);
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setPaymentImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setIsUploading(false);
      handleImage()
    }
  };
  // FIX THIS SH@T WTF
  const handleImage = async() => {
    if (!paymentImage) {
      setSnackbar({ open: true, message: 'Please upload payment proof', severity: 'error' });
      return;
    }
    const storageRef = ref(storage, `payment-proofs/${Date.now()}_${paymentImage.name}`);
    const uploadResult = await uploadBytes(storageRef, paymentImage);
    const imageUrl = await getDownloadURL(uploadResult.ref);
    setPreviewUrl(imageUrl)
  }
  const handlePurchases = async(patientId:string) => {
    const newSubscription:PurchasedPackagedRequest={
      subscriptionId: selectedSubscription?.subscriptionId||"123",
      patientId: patientId
    }
    const response = await createSubscription(newSubscription);
    if (response.statusCode === 200) {
      return true
    }else{
      return false
    }
  }

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    try {
      const patient = sessionStorage.getItem('patient');
      const patientId = JSON.parse(patient || '{}').patientId;
      if (!patientId) throw new Error('Patient information not found');
      if(!await handlePurchases(patientId)){
        setSnackbar({ open: true, message: 'Subscription Incompleted, Please Try Again!', severity: 'error' });
      }
      const paymentRequest: PaymentRequest = {
        patientId,
        amount: selectedSubscription?.price || 0,
        therapistReceive: 0,
        paymentUrl: previewUrl,
      };
      const paymentWindow = window.open("", "_blank");
      const response = await createPayment(paymentRequest);
      if (response.statusCode === 200) {
        const payOSURL = response.result
        setPaymentUrl(payOSURL)
        if (paymentWindow) {
          paymentWindow.location.href = payOSURL;
        }
        setSnackbar({ open: true, message: 'Payment request sent successfully!', severity: 'success' });
        setOpenQRModal(false);
        setPaymentImage(null);
      } else {
        throw new Error(response.message || 'Error when creating payment');
      }
    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred while processing payment',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  return (
    <>
      {isLoading && <LoadingScreen />}
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>
              Choose Your <span className={styles.highlight}>MindMingle</span> Plan
            </h1>
            <p className={styles.subtitle}>Select the subscription that best fits your needs!</p>
          </div>

          <div className={styles.cardsContainer}>
            {subscriptionData.map((subscription: Subscription) => {
              const isActive = currentPackage?.packageName === subscription.packageName;
              return (
                <div
                  key={subscription.subscriptionId}
                  className={`${subscription.isPremium ? styles.cardPremium : styles.card} ${isActive ? styles.cardActive : ''}`}
                >
                  <div className={subscription.isPremium ? styles.cardHeaderPremium : styles.cardHeader}>
                    <h2 className={subscription.isPremium ? styles.cardTitlePremium : styles.cardTitle}>
                      {subscription.packageName}
                    </h2>
                    <p className={subscription.isPremium ? styles.cardDescriptionPremium : styles.cardDescription}>
                      {subscription.description}
                    </p>
                    <p className={subscription.isPremium ? styles.pricingContainerPremium : styles.pricingContainer}>
                      <span className={subscription.isPremium ? styles.pricePremium : styles.price}>
                        {formatPriceToVnd(subscription.price)}
                      </span>
                      <span className={subscription.isPremium ? styles.billingPeriodPremium : styles.billingPeriod}>
                        /month
                      </span>
                    </p>
                    <button
                      disabled={currentPackage?true:false}
                      className={subscription.isPremium ? styles.buttonPremium : styles.buttonPlus}
                      style={{ cursor: currentPackage ? 'not-allowed' : 'pointer' }}
                      onClick={() => handleSelectSubscription(subscription)}
                    >
                      {isActive ? "Your Current Plan" : subscription.isPremium ? "Go Premium" : "Get Started"}
                    </button>
                  </div>
                  <div className={styles.cardFeatures}>
                    <h3 className={styles.featuresTitle}>What's included</h3>
                    <ul className={styles.featuresList}>
                      {subscription.features?.map((feature, index) => (
                        <li key={index} className={styles.featureItem}>
                          <svg className={styles.checkIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.footer}>
            <p>
              Questions about our subscription plans?{" "}
              <a href="#" className={styles.link}>Contact our support team</a>
            </p>
          </div>
        </div>
      </div>

      <Modal open={openQRModal} onClose={() => setOpenQRModal(false)}>
        <div className={styles.qrModal}>
          <div className={styles.qrHeader}>We will redirect you to PayOS Payment</div>
          <div className={styles.qrHeader}>Help us by screenshot your transactions afterward for our records</div>
          <div className={styles.qrContent}>
            <div className={styles.paymentForm}>
            <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitPayment}
                disabled={isSubmitting}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Processing...' : 'Payment'}
              </Button>
              <div className={styles.uploadSection}>
                {/* <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="payment-proof"
                /> */}
                {/* <label htmlFor="payment-proof">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={isUploading || !!paymentImage}
                    className={styles.uploadButton}
                  >
                    {isUploading ? 'Uploading...' : 'Upload payment proof'}
                  </Button>
                  </label> */}
                  {paymentUrl!==null && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Typography color="warning.main">
                      Popup blocked. Please use this link:
                    </Typography>
                    <Link href={previewUrl} target="_blank">
                      Proceed to Payment
                    </Link>
                  </Box>
                )}
               
                {/* {previewUrl && (
                  <div className={styles.imagePreview}>
                    <div className={styles.previewContainer}>
                      <div className={styles.previewWrapper}>
                        <img
                          src={previewUrl}
                          alt="Payment proof"
                          style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain', borderRadius: '8px' }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setPaymentImage(null);
                            setPreviewUrl('');
                          }}
                          sx={{ minWidth: '40px', marginLeft: '8px', height: 'fit-content' }}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )} */}
              </div>
              <Button
                variant="contained"
                fullWidth
                onClick={()=>setOpenQRModal(false)}
                disabled={isSubmitting || !paymentUrl}
                className={styles.submitButton}
              >
                {'Confirm payment'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
}