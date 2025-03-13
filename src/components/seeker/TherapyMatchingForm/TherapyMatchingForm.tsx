import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import styles from './TherapyMatchingForm.module.css';

const TherapyMatchingForm: React.FC = () => {
  const nav = useNavigate();
  const [formData, setFormData] = useState({
    // PHQ-9 (Depression)
    phq9_q1: '', // Little interest or pleasure
    phq9_q2: '', // Feeling down
    phq9_q3: '', // Trouble sleeping
    // GAD-7 (Anxiety)
    gad7_q4: '', // Nervous, anxious
    gad7_q5: '', // Unable to stop worrying
    gad7_q6: '', // Restless
    // PC-PTSD-5 (Trauma)
    pcptsd5_q7: false, // Nightmares
    pcptsd5_q8: false, // Avoidance
    pcptsd5_q9: false, // Hypervigilance
    // Custom
    concern: '',
    interference: '',
    urgency: '',
  });

  const handleChange = (e: React.ChangeEvent) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    nav('patient-summary');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Health Assessment</h1>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          {/* Depression Section (PHQ-9) */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Depression Symptoms</h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?
              </label>
              <select
                name="phq9_q1"
                value={formData.phq9_q1}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you felt down, depressed, or hopeless?
              </label>
              <select
                name="phq9_q2"
                value={formData.phq9_q2}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you had trouble falling or staying asleep?
              </label>
              <select
                name="phq9_q3"
                value={formData.phq9_q3}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>
          </div>

          {/* Anxiety Section (GAD-7) */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Anxiety Symptoms</h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?
              </label>
              <select
                name="gad7_q4"
                value={formData.gad7_q4}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you been unable to stop or control worrying?
              </label>
              <select
                name="gad7_q5"
                value={formData.gad7_q5}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                Over the last 2 weeks, how often have you felt restless or unable to sit still?
              </label>
              <select
                name="gad7_q6"
                value={formData.gad7_q6}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Several days</option>
                <option value="2">More than half the days</option>
                <option value="3">Nearly every day</option>
              </select>
            </div>
          </div>

          {/* Trauma Section (PC-PTSD-5) */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Trauma Symptoms</h2>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="pcptsd5_q7"
                checked={formData.pcptsd5_q7}
                onChange={handleChange}
                className={styles.checkbox}
                id="pcptsd5_q7"
              />
              <label htmlFor="pcptsd5_q7" className={styles.formLabel}>
                In the past month, have you had nightmares about a traumatic experience?
              </label>
            </div>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="pcptsd5_q8"
                checked={formData.pcptsd5_q8}
                onChange={handleChange}
                className={styles.checkbox}
                id="pcptsd5_q8"
              />
              <label htmlFor="pcptsd5_q8" className={styles.formLabel}>
                In the past month, have you tried hard not to think about a traumatic experience?
              </label>
            </div>

            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                name="pcptsd5_q9"
                checked={formData.pcptsd5_q9}
                onChange={handleChange}
                className={styles.checkbox}
                id="pcptsd5_q9"
              />
              <label htmlFor="pcptsd5_q9" className={styles.formLabel}>
                In the past month, have you felt constantly on guard or easily startled?
              </label>
            </div>
          </div>

          {/* Custom Section */}
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Additional Information</h2>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                What's your biggest concern right now?
              </label>
              <select
                name="concern"
                value={formData.concern}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="stress">Stress or burnout</option>
                <option value="relationships">Relationships</option>
                <option value="trauma">Past trauma</option>
                <option value="purpose">Feeling lost or purposeless</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                How much do your feelings interfere with daily life?
              </label>
              <select
                name="interference"
                value={formData.interference}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not at all</option>
                <option value="1">Slightly</option>
                <option value="2">Moderately</option>
                <option value="3">Significantly</option>
                <option value="4">Completely</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.formLabel}>
                How urgent is your need for support?
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className={styles.formSelect}
              >
                <option value="">Select...</option>
                <option value="0">Not urgent</option>
                <option value="1">Low</option>
                <option value="2">Medium</option>
                <option value="3">High</option>
                <option value="4">I need help now</option>
              </select>
            </div>
          </div>

          <div className={styles.infoBox}>
            <svg className={styles.infoIcon} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
            <p className={styles.infoText}>
              These questions help us understand your needs and match you with a suitable therapist.
            </p>
          </div>

          <button type="submit" className={styles.submitButton}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TherapyMatchingForm;
