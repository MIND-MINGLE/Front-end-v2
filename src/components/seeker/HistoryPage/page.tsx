import React, { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  styled,
} from "@mui/material";
import styles from "./HistoryView.module.css";
import HistoryAppointment from "./HistoryView/history-appointment";
import HistorySubscription from "./HistoryView/history-subscription";

// Styled components
const HistoryContainer = styled(Box)(() => ({
  marginLeft:"6vw",
  width: "92vw",
  height: "100vh",
  position: "relative",
  display: "flex",
  flexDirection: "column",
}));

const TabPanel = styled(Box)(() => ({
  flex: 1,
  overflowY: "auto",
  padding: "24px",
  backgroundColor: "#FFFFFF",
  borderRadius: "0 0 12px 12px",
  boxShadow: "inset 0 2px 4px rgba(0, 0, 0, 0.05)",
}));

const ModernTabs = styled(Tabs)(() => ({
  backgroundColor: "#0077b6",
  minHeight: "40px", // Smaller height
  "& .MuiTabs-indicator": {
    height: "3px",
    backgroundColor: "#FFFFFF",
    borderRadius: "2px 2px 0 0",
    transition: "all 0.3s ease",
  },
}));

const ModernTab = styled(Tab)(() => ({
  minHeight: "40px", // Match tabs height
  padding: "8px 16px", // Reduced padding for smaller size
  fontSize: "14px", // Smaller font
  fontWeight: "600",
  color: "rgba(255, 255, 255, 0.8)", // Softer white for unselected
  textTransform: "none",
  borderRadius: "8px 8px 0 0",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgba(27, 157, 240, 0.2)", // Subtle hover effect
    color: "#FFFFFF",
  },
  "&.Mui-selected": {
    color: "#FFFFFF",
    backgroundColor: "rgba(27, 157, 240, 0.3)", // Slightly darker when selected
  },
}));

// Tab panel component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanelContent: React.FC<TabPanelProps> = ({ children, value, index, ...other }) => {
  return (
    <TabPanel
      role="tabpanel"
      hidden={value !== index}
      id={`history-tabpanel-${index}`}
      aria-labelledby={`history-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ height: "100%" }}>
          {children}
        </Box>
      )}
    </TabPanel>
  );
};

const HistoryPage: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <HistoryContainer>
      {/* Modern Tabs */}
      <ModernTabs
        value={tabValue}
        onChange={handleTabChange}
        aria-label="history tabs"
        variant="fullWidth"
      >
        <ModernTab label="Subscription History" id="history-tab-0" aria-controls="history-tabpanel-0" />
        <ModernTab label="Appointment History" id="history-tab-1" aria-controls="history-tabpanel-1" />
      </ModernTabs>

      {/* Tab Content */}
      <TabPanelContent value={tabValue} index={0}>
       <HistorySubscription/>
      </TabPanelContent>

      <TabPanelContent value={tabValue} index={1}>
       <HistoryAppointment/>
      </TabPanelContent>
    </HistoryContainer>
  );
};

export default HistoryPage;