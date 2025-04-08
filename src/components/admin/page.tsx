import { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  AttachMoney,
  Person,
  Psychology,
  Assignment,
} from '@mui/icons-material';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from './Dashboard.module.css';
import { getDashboardStats } from '../../api/Admin/Dashboard';

interface ApiResponse<T> {
  statusCode: number;
  isSuccess: boolean;
  errorMessage: string | null;
  result: T;
}

interface DashboardStats {
  totalRevenue: number;
  totalPatients: number;
  totalTherapists: number;
  totalAppointments: number;
  revenueByMonth: {
    month: string; // Format có thể là: "YYYY-WXX", "YYYY-MM", hoặc "YYYY"
    revenue: number;
  }[];
}

const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'

  useEffect(() => {
    fetchDashboardStats(timeRange);
  }, [timeRange]);

  useEffect(() => {
    console.log('Current stats:', stats);
  }, [stats]);

  const fetchDashboardStats = async (timeRange: string) => {
    try {
      setLoading(true);
      const response: ApiResponse<DashboardStats> = await getDashboardStats(timeRange);
      if (response.isSuccess && response.statusCode === 200) {
        setStats(response.result);
        console.log('Dashboard stats:', response.result);
      } else {
        console.error('Error:', response.errorMessage);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatMonth = (monthStr: string) => {
    // Xử lý định dạng tuần (YYYY-WXX)
    if (monthStr.includes('W')) {
      const [year, week] = monthStr.split('-W');
      return `Week ${parseInt(week)}, ${year}`; // Chuyển week về số để bỏ số 0 ở đầu nếu có
    }

    // Xử lý định dạng tháng (YYYY-MM)
    if (monthStr.includes('-') && monthStr.length === 7) {
      const [year, month] = monthStr.split('-');
      const date = new Date(parseInt(year), parseInt(month) - 1);
      return date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
    }

    // Xử lý định dạng năm (YYYY)
    if (monthStr.length === 4) {
      return `Year ${monthStr}`;
    }

    return monthStr;
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  console.log('Revenue data:', stats?.revenueByMonth);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Typography className={styles.title}>
          Dashboard Overview
        </Typography>
        <FormControl className={styles.timeRangeSelect}>
          <InputLabel>Time Range</InputLabel>
          <Select
            value={timeRange}
            label="Time Range"
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <MenuItem value="week">By Week</MenuItem>
            <MenuItem value="month">By Month</MenuItem>
            <MenuItem value="year">By Year</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.revenueIcon}`}>
                <AttachMoney />
              </div>
              <Typography className={styles.cardValue}>
                {formatCurrency(stats?.totalRevenue || 0)}
              </Typography>
              <Typography className={styles.cardLabel}>
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.patientIcon}`}>
                <Person />
              </div>
              <Typography className={styles.cardValue}>
                {stats?.totalPatients || 0}
              </Typography>
              <Typography className={styles.cardLabel}>
                Total Patients
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.therapistIcon}`}>
                <Psychology />
              </div>
              <Typography className={styles.cardValue}>
                {stats?.totalTherapists || 0}
              </Typography>
              <Typography className={styles.cardLabel}>
                Total Therapists
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card className={styles.statsCard}>
            <CardContent className={styles.cardContent}>
              <div className={`${styles.cardIcon} ${styles.appointmentIcon}`}>
                <Assignment />
              </div>
              <Typography className={styles.cardValue}>
                {stats?.totalAppointments || 0}
              </Typography>
              <Typography className={styles.cardLabel}>
                Total Appointments
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <div className={styles.chartContainer}>
        <Typography className={styles.chartTitle}>
          Revenue Trend ({timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'})
        </Typography>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={stats?.revenueByMonth || []}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              interval={0}
              stroke="#666"
              angle={timeRange === 'week' ? -45 : 0}
              textAnchor={timeRange === 'week' ? 'end' : 'middle'}
              height={timeRange === 'week' ? 60 : 30}
            />
            <YAxis
              stroke="#666"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  return `${(value / 1000000).toFixed(1)}M`;
                } else if (value >= 1000) {
                  return `${(value / 1000).toFixed(0)}K`;
                }
                return value.toString();
              }}
            />
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              labelFormatter={formatMonth}
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1976d2"
              strokeWidth={3}
              name={`${timeRange === 'week' ? 'Weekly' : timeRange === 'month' ? 'Monthly' : 'Yearly'} Revenue`}
              dot={{ r: 6, fill: '#1976d2' }}
              activeDot={{ r: 8, fill: '#1976d2' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminDashboardPage;  