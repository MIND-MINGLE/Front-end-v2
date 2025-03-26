
import { useNavigate } from 'react-router';
import styles from './css/popup.module.css';
import PropTypes from 'prop-types';

const SubscriptionPopUp = ({
  isOpen = false,
  onClose = () => {},
  title = 'Premium Service Only Zone!',
  content = 'Purchase your package today',
}) => {
  if (!isOpen) return null;
    const nav = useNavigate()
    const gotoSub =()=>{
        nav("seeker/subscription")
    }
  return (
    <div className={styles.popupOverlay} >
      <div className={styles.popupContent} >
        <div className={styles.popupHeader}>
          <h2 className={styles.popupTitle}>{title}</h2>
          <span className={styles.closeIcon} onClick={onClose}>
            ×
          </span>
        </div>
        <p className={styles.popupText}>{content}</p>
        <button className={styles.popupButton} onClick={onClose}>
          Mayber Later
        </button>
        <button className={styles.popupButton} onClick={()=>{gotoSub(),onClose}}>
          Go to Subscription
        </button>
        <div className={styles.popupGlow}></div> {/* For extra flashiness */}
      </div>
    </div>
  );
};

SubscriptionPopUp.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  content: PropTypes.string,
  buttonText: PropTypes.string,
  customStyles: PropTypes.shape({
    overlay: PropTypes.object,
    content: PropTypes.object,
  }),
};

export default SubscriptionPopUp;