import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import styles from "./HistoryView.module.css";
import HistoryAppointment from "./HistoryView/history-appointment";
import HistorySubscription from "./HistoryView/history-subscription";

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanelContent: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      className={styles.tabPanel}
      {...other}
    >
      {value === index && (
        <Box className={styles.tabPanelContent}>
          {children}
        </Box>
      )}
    </Box>
  );
};

const HistoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <Box className={styles.historyContainer}>
      <Box className={styles.contentContainer}>


        {/* Modern Tabs */}
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="history tabs"
          variant="fullWidth"
          className={styles.modernTabs}
        >
          <Tab
            label="Subscription History"
            id="history-tab-0"
            aria-controls="history-tabpanel-0"
            className={styles.modernTab}
          />
          <Tab
            label="Appointment History"
            id="history-tab-1"
            aria-controls="history-tabpanel-1"
            className={styles.modernTab}
          />
        </Tabs>

        {/* Tab Content */}
        <TabPanelContent value={tabValue} index={0}>
          <HistorySubscription />
        </TabPanelContent>

        <TabPanelContent value={tabValue} index={1}>
          <HistoryAppointment />
        </TabPanelContent>
      </Box>
    </Box>
  );
};

export default HistoryPage;