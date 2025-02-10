import React from 'react';
import styles from './PropertyFilter.module.css';
import SelectField from './SelectField';
import DateField from './DateField';
import PriceField from './PriceField';

const FilterForm: React.FC = () => {
  return (
    <form className={styles.filterForm}>
      <div className={styles.formGrid}>
        <SelectField label="Location" />
        <SelectField label="No of people" />
        <DateField label="Checkin date" />
        <PriceField label="Price" />
        <SelectField label="Radius" />
        <SelectField label="No of bedroom" />
        <DateField label="Checkout date" />
        <SelectField label="No of bathroom" />
      </div>
      <button type="submit" className={styles.searchButton}>searching</button>
    </form>
  );
};

export default FilterForm;