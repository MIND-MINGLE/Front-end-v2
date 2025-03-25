import { useEffect, useState } from 'react';
import styles from './subscription.module.css';
import { Subscription } from '../../../interface/IAccount';
import { getAllSubscription } from '../../../api/Subscription/Subscription';
import LoadingScreen from '../../common/LoadingScreen';
import { formatPriceToVnd } from '../../../services/common';
import { Modal, TextField, Button, Snackbar, Alert } from '@mui/material';
import { ChangeEvent } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../services/firebase'; // Đảm bảo import đúng đường dẫn firebase config
import axios from 'axios';

// Thêm interface cho payment request
interface PaymentRequest {
  patientId: string;
  amount: number;
  therapistReceive: number;
  paymentUrl: string;

}

// Tạo hàm gọi API riêng
const createPayment = async (paymentData: PaymentRequest) => {
  const response = await axios.post(
    'https://mindmingle202.azurewebsites.net/api/Payment/create',
    paymentData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  return response.data;
};

export default function SubscriptionPage() {
  // Sample subscription data matching your schema
  const [subscriptionData, setSubscriptonData] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const subscriptionsDetail =
    [
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
    const getSubscription = async () => {
      setIsLoading(true)
      const subData = await getAllSubscription()
      if (subData.statusCode === 200) {
        const mergedSubscriptions = subData.result?.map((subData: Subscription, index: number) => ({
          ...subData,
          ...subscriptionsDetail[index],
        }));
        setSubscriptonData(mergedSubscriptions)
      }
      setIsLoading(false)
    }
    getSubscription()
  }, [])

  // State to track selected subscription
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription>();

  // Handler for subscription selection
  const handleSelectSubscription = (subscription: Subscription) => {
    // Chọn ảnh QR dựa vào loại gói
    const qrImage = subscription.isPremium
      ? 'https://firebasestorage.googleapis.com/v0/b/mind-mingle-202.firebasestorage.app/o/momo%2F300kmomo.jpg?alt=media&token=5be4351b-d12b-4c96-b737-10fc1cd2bf80'  // QR cho gói premium 500k
      : 'https://firebasestorage.googleapis.com/v0/b/mind-mingle-202.firebasestorage.app/o/momo%2F100kmomo.jpg?alt=media&token=218c20b8-7d7e-4771-8020-f97569bdbf5b';   // QR cho gói basic 100k

    setSelectedSubscription(subscription);
    setSelectedQR(qrImage);
    setOpenQRModal(true);
  };

  const [openQRModal, setOpenQRModal] = useState(false);
  const [selectedQR, setSelectedQR] = useState<string>('');
  const [paymentImage, setPaymentImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  // Thêm state loading cho upload
  const [isUploading, setIsUploading] = useState(false);

  // Sửa lại hàm handleImageChange
  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        setIsUploading(true);
        setPaymentImage(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } finally {
        setIsUploading(false);
      }
    }
  };

  // Xử lý submit form
  const handleSubmitPayment = async () => {
    if (!paymentImage) {
      alert('Please upload payment proof');
      return;
    }

    try {
      setIsSubmitting(true);

      // Upload ảnh lên Firebase Storage
      const storageRef = ref(storage, `payment-proofs/${Date.now()}_${paymentImage.name}`);
      const uploadResult = await uploadBytes(storageRef, paymentImage);
      const imageUrl = await getDownloadURL(uploadResult.ref);

      // Lấy patientId từ sessionStorage
      const patient = sessionStorage.getItem('patient');
      const patientId = JSON.parse(patient || '{}').patientId;
      if (!patientId) {
        throw new Error('Patient information not found');
      }

      // Tạo payment request
      const paymentRequest: PaymentRequest = {
        patientId: patientId,
        amount: selectedSubscription?.price || 0, // Giá của gói subscription
        therapistReceive: 0,
        paymentUrl: imageUrl, // URL ảnh từ Firebase
      };

      // Gọi API tạo payment
      const result = await createPayment(paymentRequest);

      if (result.statusCode === 200) {
        setSnackbar({
          open: true,
          message: 'Payment request sent successfully!',
          severity: 'success'
        });

        // Đóng modal QR
        setOpenQRModal(false);

        // Reset form
        setPaymentImage(null);
        setPreviewUrl('');
      } else {
        throw new Error(result.message || 'Error when creating payment');
      }

    } catch (error) {
      console.error('Error:', error);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'An error occurred while processing payment',
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add this state near your other state declarations
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Add this handler
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>{isLoading ? <LoadingScreen /> : null}
      <div className={styles.container}>
        <div className={styles.wrapper}>
          {/* Header */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Choose Your <span className={styles.highlight}>MindMingle</span> Plan
            </h1>
            <p className={styles.subtitle}>
              Select the subscription that best fits your needs!
            </p>
          </div>

          {/* Subscription Cards */}
          <div className={styles.cardsContainer}>
            {subscriptionData.map((subscription: Subscription) => (
              <div
                key={subscription.subscriptionId}
                className={subscription.isPremium ? styles.cardPremium : styles.card}
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
                    className={subscription.isPremium ? styles.buttonPremium : styles.buttonPlus}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectSubscription(subscription)}
                  >
                    {subscription.isPremium ? "Go Premium" : "Get Started"}
                  </button>
                </div>
                <div className={styles.cardFeatures}>
                  <h3 className={styles.featuresTitle}>
                    What's included
                  </h3>
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
            ))}
          </div>


          {/* FAQ or additional info */}
          <div className={styles.footer}>
            <p>
              Questions about our subscription plans?{" "}
              <a href="#" className={styles.link}>
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>

      <Modal
        open={openQRModal}
        onClose={() => setOpenQRModal(false)}
      >
        <div className={styles.qrModal}>
          <div className={styles.qrHeader}>
            QR Nhận Tiền
          </div>
          <div className={styles.qrContent}>
            <img
              src={selectedQR}
              alt="QR Payment"
              className={styles.qrImage}
            />

            {/* Form xác nhận thanh toán */}
            <div className={styles.paymentForm}>
              {/* Upload ảnh */}
              <div className={styles.uploadSection}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="payment-proof"
                />
                <label htmlFor="payment-proof">
                  <Button
                    variant="outlined"
                    component="span"
                    fullWidth
                    disabled={isUploading || !!paymentImage}
                    className={styles.uploadButton}
                  >
                    {isUploading ? 'Uploading...' : 'Upload payment proof'}
                  </Button>
                </label>

                {/* Preview ảnh */}
                {previewUrl && (
                  <div className={styles.imagePreview}>
                    <div className={styles.previewContainer}>
                      <div className={styles.previewWrapper}>
                        <img
                          src={previewUrl}
                          alt="Payment proof"
                          style={{
                            maxWidth: '200px',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '8px'
                          }}
                        />
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => {
                            setPaymentImage(null);
                            setPreviewUrl('');
                          }}
                          sx={{
                            minWidth: '40px',
                            marginLeft: '8px',
                            height: 'fit-content'
                          }}
                        >
                          Xóa
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                variant="contained"
                fullWidth
                onClick={handleSubmitPayment}
                disabled={isSubmitting || !paymentImage}
                className={styles.submitButton}
              >
                {isSubmitting ? 'Processing...' : 'Confirm payment'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}