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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to backend
    console.log('Form Data:', formData);
    // Replace with actual API call
    nav('patient-summary');
  };

  return (
    <section className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Mental Health Assessment</h1>
        <hr className={styles.divider} />
        <p className={styles.subtitle}>
          Please answer the following questions to help us match you with the right therapist.
        </p>

        {/* Depression Section (PHQ-9) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Depression Symptoms</h2>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you felt little interest or pleasure in doing things?</label>
            <select name="phq9_q1" value={formData.phq9_q1} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you felt down, depressed, or hopeless?</label>
            <select name="phq9_q2" value={formData.phq9_q2} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you had trouble falling or staying asleep?</label>
            <select name="phq9_q3" value={formData.phq9_q3} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
        </div>

        {/* Anxiety Section (GAD-7) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Anxiety Symptoms</h2>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?</label>
            <select name="gad7_q4" value={formData.gad7_q4} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you been unable to stop or control worrying?</label>
            <select name="gad7_q5" value={formData.gad7_q5} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>Over the last 2 weeks, how often have you felt restless or unable to sit still?</label>
            <select name="gad7_q6" value={formData.gad7_q6} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="0">Not at all</option>
              <option value="1">Several days</option>
              <option value="2">More than half the days</option>
              <option value="3">Nearly every day</option>
            </select>
          </div>
        </div>

        {/* Trauma Section (PC-PTSD-5) */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Trauma Symptoms</h2>
          <div className={styles.formGroup}>
            <label>In the past month, have you had nightmares about a traumatic experience?</label>
            <input
              type="checkbox"
              name="pcptsd5_q7"
              checked={formData.pcptsd5_q7}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>
          <div className={styles.formGroup}>
            <label>In the past month, have you tried hard not to think about a traumatic experience?</label>
            <input
              type="checkbox"
              name="pcptsd5_q8"
              checked={formData.pcptsd5_q8}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>
          <div className={styles.formGroup}>
            <label>In the past month, have you felt constantly on guard or easily startled?</label>
            <input
              type="checkbox"
              name="pcptsd5_q9"
              checked={formData.pcptsd5_q9}
              onChange={handleChange}
              className={styles.checkbox}
            />
          </div>
        </div>

        {/* Custom Section */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Additional Information</h2>
          <div className={styles.formGroup}>
            <label>What’s your biggest concern right now?</label>
            <select name="concern" value={formData.concern} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="Stress">Stress or burnout</option>
              <option value="Relationships">Relationships</option>
              <option value="Trauma">Past trauma</option>
              <option value="Purpose">Feeling lost or purposeless</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>How much do your feelings interfere with daily life?</label>
            <select name="interference" value={formData.interference} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="1">Not at all</option>
              <option value="2">Slightly</option>
              <option value="3">Moderately</option>
              <option value="4">Significantly</option>
              <option value="5">Completely</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label>How urgent is your need for support?</label>
            <select name="urgency" value={formData.urgency} onChange={handleChange} className={styles.input} required>
              <option value="">Select...</option>
              <option value="1">Not urgent</option>
              <option value="2">Low</option>
              <option value="3">Medium</option>
              <option value="4">High</option>
              <option value="5">I need help now</option>
            </select>
          </div>
        </div>

        <button type="submit" className={styles.submitButton} onClick={handleSubmit}>
          Submit
        </button>
        <div className={styles.infoBox}>
          <img src="/info.svg" alt="Info Icon" className={styles.infoIcon} />
          <p className={styles.infoText}>
            These questions help us understand your needs and match you with a suitable therapist.
          </p>
        </div>
      </div>
      <img src="/Logo3.png" alt="Company Logo" className={styles.logo} />
    </section>
  );
};

export default TherapyMatchingForm;