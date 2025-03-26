import { useNavigate } from 'react-router';
import styles from './css/popup.module.css';
import PropTypes from 'prop-types';
// Example diamond icon (replace with your actual image URL or import)
import diamondIcon from '/pack2.png'; // Adjust path as needed

const SubscriptionPopUp = ({
  isOpen = false,
  onClose = () => {},
  title = 'Premium Service Only Zone!',
  content = 'Purchase your package today',
}) => {
  if (!isOpen) return null;
  const nav = useNavigate();
  const gotoSub = () => {
    nav('/seeker/subscription');
  };

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <div className={styles.popupHeader}>
          <h2 className={styles.popupTitle}>{title}</h2>
        </div>
        <p className={styles.popupText}>{content}</p>
        <div className={styles.popupImageContainer}>
          <img src={diamondIcon} alt="Premium Diamond" className={styles.popupImage} />
        </div>
        <div className={styles.buttonContainer}>
          <button className={styles.popupButton} onClick={onClose}>
            Maybe Later {/* Fixed typo */}
          </button>
          <button
            className={styles.acceptPopupButton}
            onClick={() => {
              gotoSub();
              onClose();
            }}
          >
            Go to Subscription
          </button>
        </div>
        <div className={styles.popupGlow}></div>
      </div>
    </div>
  );
};

SubscriptionPopUp.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  customStyles: PropTypes.shape({
    overlay: PropTypes.object,
    content: PropTypes.object,
  }),
};

export default SubscriptionPopUp;