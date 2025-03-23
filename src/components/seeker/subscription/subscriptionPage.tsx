import { useEffect, useState } from 'react';
import styles from './subscription.module.css';
import { Subscription } from '../../../interface/IAccount';
import { getAllSubscription } from '../../../api/Subscription/Subscription';
import LoadingScreen from '../../common/LoadingScreen';
import { formatVnd } from '../../../services/common';

export default function SubscriptionPage() {
  // Sample subscription data matching your schema
  const [subscriptionData,setSubscriptonData] = useState<Subscription[]>([])
  const [isLoading,setIsLoading] = useState<boolean>(false)
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
  useEffect(()=>{
    const getSubscription = async()=>{
      setIsLoading(true)
      const subData = await getAllSubscription()
      if(subData.statusCode === 200){
        const mergedSubscriptions = subData.result?.map((subData:Subscription, index:number) => ({
          ...subData,
          ...subscriptionsDetail[index],
        }));
        setSubscriptonData(mergedSubscriptions)
      }
      setIsLoading(false)
    }
    getSubscription()
  },[])

  // State to track selected subscription
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription>();

  // Handler for subscription selection
  const handleSelectSubscription = (subscription:Subscription) => {
    setSelectedSubscription(subscription);
    console.log(`Selected subscription: ${subscription}`);
    // Here you would typically proceed to checkout or account update
  };

  return (
    <>{isLoading?<LoadingScreen/>:null}
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
          {subscriptionData.map((subscription:Subscription) => (
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
                    {formatVnd(subscription.price)}
                  </span>
                  <span className={subscription.isPremium ? styles.billingPeriodPremium : styles.billingPeriod}>
                    /month
                  </span>
                </p>
                <button
                  className={subscription.isPremium ? styles.buttonPremium : styles.buttonPlus}
                  style={{cursor: 'pointer'}}
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

        {/* Selected plan feedback (optional) */}
        {selectedSubscription && (
          <div className={styles.selectedPlan}>
            <p>You selected: {selectedSubscription.packageName}</p>
          </div>
        )}
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
    </>
  );
}