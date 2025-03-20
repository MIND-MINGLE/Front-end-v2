import React, { useState } from 'react';
import styles from './subscription.module.css';

export default function SubscriptionPage() {
  // Sample subscription data matching your schema
  const [subscriptions, setSubscriptions] = useState([
    {
      subscriptionId: "plus-monthly",
      packageName: "MindMingle Plus",
      price: 9.99,
      features: [
        "100 activities per month",
        "Basic analytics",
        "Email support"
      ],
      description: "Perfect for beginners and casual users",
      isPremium: false
    },
    {
      subscriptionId: "premium-monthly",
      packageName: "MindMingle Premium",
      price: 19.99,
      features: [
        "Unlimited activities",
        "Advanced analytics dashboard",
        "Priority 24/7 support",
        "Exclusive premium content",
        "Custom user profiles"
      ],
      description: "For dedicated users seeking advanced features",
      isPremium: true
    }
  ]);

  // State to track selected subscription
  const [selectedSubscription, setSelectedSubscription] = useState("");

  // Handler for subscription selection
  const handleSelectSubscription = (subscriptionId:string) => {
    setSelectedSubscription(subscriptionId);
    console.log(`Selected subscription: ${subscriptionId}`);
    // Here you would typically proceed to checkout or account update
  };

  return (
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
          {subscriptions.map((subscription) => (
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
                    ${subscription.price.toFixed(2)}
                  </span>
                  <span className={subscription.isPremium ? styles.billingPeriodPremium : styles.billingPeriod}>
                    /month
                  </span>
                </p>
                <button
                  className={subscription.isPremium ? styles.buttonPremium : styles.buttonPlus}
                  onClick={() => handleSelectSubscription(subscription.subscriptionId)}
                >
                  {subscription.isPremium ? "Get Premium" : "Get Started"}
                </button>
              </div>
              <div className={styles.cardFeatures}>
                <h3 className={styles.featuresTitle}>
                  What's included
                </h3>
                <ul className={styles.featuresList}>
                  {subscription.features.map((feature, index) => (
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
            <p>You selected: {subscriptions.find(sub => sub.subscriptionId === selectedSubscription)?.packageName}</p>
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
  );
}