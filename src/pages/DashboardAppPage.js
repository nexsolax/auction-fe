import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';

import CircularProgress from '@mui/material/CircularProgress';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import SearchIcon from '@mui/icons-material/Search';
// @mui
import { useTheme } from '@mui/material/styles';
import {
  Grid,
  Container,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
// components
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axiosInstance from '../services/axios-instance';
import Iconify from '../components/iconify';
// sections


// ----------------------------------------------------------------------

export default function DashboardAppPage() {
  const theme = useTheme();

  const user = JSON.parse(localStorage.getItem('loginUser'));

  const [selectedMenuItem, setSelectedMenuItem] = useState('Quy1');
  // const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateUser, setStartDateUser] = useState(null);
  const [endDateUser, setEndDateUser] = useState(null);
  const [startDatePayment, setStartDatePayment] = useState(null);
  const [endDatePayment, setEndDatePayment] = useState(null);
  const [total, setTotal] = useState({});
  const [totalPayment, setTotalPayment] = useState({});
  // const [totalCategory, setTotalCategory] = useState({});
  const [totalUser, setTotalUser] = useState({});
  const [categories, setCategories] = useState([]);
  const [chartData, setChartData] = useState([]);
  // const [chartCategoryData, setChartCategoryData] = useState([]);
  const [chartUserData, setChartUserData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [maxWidth, setMaxWidth] = React.useState('xs');

  const mapLabelsToColors = (labels) => {
    const colorMap = {
      'Chưa bắt đầu': '#ff5722',
      'Đang diễn ra': '#3f51b5',
      'Chưa thanh toán': '#F7803B',
      'Thành công': '#1FEE26',
      'Thất bại': '#F2041E',
      'Đã nhận hàng': '#2196f3',
      'Nhận hàng lỗi': '#ff9800',
      'Đã xóa': '#795548',
    };

    return labels.map((label) => colorMap[label]);
  };

  const mapUserLabelsToColors = (labels) => {
    const colorMap = {
      'Đã chấp nhận': '#1FEE26',
      'Bị cấm': '#F2041E',
      'Đã từ chối': '#F7803B',
      'Đang chờ duyệt': '#ff9800',
    };

    return labels.map((label) => colorMap[label]);
  };

  // Inside your DashboardAppPage component
  const labelsPayment = [
    'Chưa bắt đầu',
    'Đang diễn ra',
    'Chưa thanh toán',
    'Thành công',
    'Thất bại',
    'Đã nhận hàng',
    'Nhận hàng lỗi',
    'Đã xóa',
  ];

  // const labelsCategory = [
  //   'Chưa bắt đầu',
  //   'Đang diễn ra',
  //   'Chưa thanh toán',
  //   'Thành công',
  //   'Thất bại',
  //   'Đã nhận hàng',
  //   'Nhận hàng lỗi',
  //   'Đã xóa',
  // ];

  const labelsUser = [
    'Đã chấp nhận',
    'Bị cấm',
    'Đã từ chối',
    'Đang chờ duyệt',
  ];

  const chartColorsPayment = mapLabelsToColors(labelsPayment);
  // const chartColorsCategory = mapLabelsToColors(labelsCategory); // Define labelsCategory based on your data
  const chartColorsUser = mapUserLabelsToColors(labelsUser); // Define labelsUser based on your data

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get(
          'https://reasapiv2.azurewebsites.net/api/Auction'
        );
        setTotal(response.data.data.pagingData);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Failed to fetch: ', error);
      }
    })();
  }, []);
  
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await axiosInstance.get('https://reasapiv2.azurewebsites.net/api/Category');
        console.log(response);
        if (response.data && Array.isArray(response.data.data.pagingData)) {
          setCategories(response.data.data.pagingData);
        } else {
          console.log('Response data is not an array:', response.data.data.pagingData);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.log('Failed to fetch: ', error);
      }
    })();
  }, []);
  

  const styles = {
    TaskAltIcon: {
      fontSize: '100px',
      color: '#C3E1AE'
    },
    errorIcon: {
      fontSize: '100px',
      color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
  };

  // useEffect(() => {
  //   if (selectedCategoryId) {
  //     (async () => {
  //       try {
  //         const response = await axiosInstance.get('https://reasapiv2.azurewebsites.net/api/Login/report_category', {
  //           params: {
  //             categoryId: selectedCategoryId,
  //             startDate: startDate.toISOString(),
  //             endDate: endDate.toISOString(),
  //           },
  //         });
  //         console.log(response);
  //         setTotalCategory(response.data);
  //       } catch (error) {
  //         console.log('Failed to fetch: ', error);
  //       }
  //     })();
  //   }
  // }, [selectedCategoryId, startDate, endDate]);

  useEffect(() => {
    (async () => {
      try {
        // Calculate the start and end dates based on the selected menu item
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let startMonth;
        let endMonth;

        switch (selectedMenuItem) {
          case 'Quy1':
            startMonth = 0; // January
            endMonth = 2; // March
            break;
          case 'Quy2':
            startMonth = 3; // April
            endMonth = 5; // June
            break;
          case 'Quy3':
            startMonth = 6; // July
            endMonth = 8; // September
            break;
          case 'Quy4':
            startMonth = 9; // October
            endMonth = 11; // December
            break;
          default:
            startMonth = 0;
            endMonth = 11;
        }

        const startDate = new Date(currentYear, startMonth, 1);
        const endDate = new Date(currentYear, endMonth + 1, 0);

        const response = await axiosInstance.get(
          `'https://reasapiv2.azurewebsites.net/api/Auction`,
          {
            params: {
              startDate: startDate.toISOString(),
              endDate: endDate.toISOString(),
            },
          }
        );

        console.log(response);
        setTotalPayment(response.data);
        const updatedChartData = [
          { label: 'totalCountNotStart', value: response.data.totalCountNotStart },
          { label: 'totalCountInStage', value: response.data.totalCountInStage },
          { label: 'totalCountHaventTranfer', value: response.data.totalCountHaventTranfer },
          { label: 'totalCountComplete', value: response.data.totalCountComplete },
          { label: 'totalCountFail', value: response.data.totalCountFail },
          { label: 'totalCountReceived', value: response.data.totalCountReceived },
          { label: 'totalCountErrorItem', value: response.data.totalCountErrorItem },
          { label: 'totalCountDelete', value: response.data.totalCountDelete },
        ];

        setChartData(updatedChartData);
      } catch (error) {
        console.log('Failed to fetch: ', error);
      }
    })();
  }, [selectedMenuItem]);


  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false);
  };

  const handleSubmitPayment = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {

      if (!startDatePayment || !endDatePayment) {
        setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      // Check if end date is not greater than start date
      if (endDatePayment <= startDatePayment) {
        setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      const response = await axiosInstance.get('https://reasapiv2.azurewebsites.net/api/Transaction', {
        params: {
          startDate: startDatePayment.toISOString(),
          endDate: endDatePayment.toISOString()
        }
      });
      console.log(response)
      setTotalPayment(response.data);
      setIsLoading(false);
      const updatedChartData = [
        { label: 'Chưa bắt đầu', value: response.data.totalCountNotStart },
        { label: 'Đang diễn ra', value: response.data.totalCountInStage },
        { label: 'Chưa thanh toán', value: response.data.totalCountHaventTranfer },
        { label: 'Thành công', value: response.data.totalCountComplete },
        { label: 'Thất bại', value: response.data.totalCountFail },
        { label: 'Đã nhận hàng', value: response.data.totalCountReceived },
        { label: 'Nhận hàng lỗi', value: response.data.totalCountErrorItem },
        { label: 'Đã xóa', value: response.data.totalCountDelete },
      ];
      setChartData(updatedChartData);
    }
    catch (error) {
      setIsLoading(false);
      console.log('Failed to fetch: ', error);
    }
  }

  // const handleSubmitCategory = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {

  //     if (!startDate || !endDate) {
  //       setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
  //       setErrorDialogOpen(true);
  //       setIsLoading(false);
  //       return; // Exit the function early to prevent the API request
  //     }
  
  //     // Check if end date is not greater than start date
  //     if (endDate <= startDate) {
  //       setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
  //       setErrorDialogOpen(true);
  //       setIsLoading(false);
  //       return; // Exit the function early to prevent the API request
  //     }
  //     const response = await axiosInstance.get('https://reasapiv2.azurewebsites.net/api/Category', {
  //       params: {
  //         categoryId: selectedCategoryId
  //         // startDate: startDate.toISOString(),
  //         // endDate: endDate.toISOString(),
  //       },
  //     });
  //     setIsLoading(false);
  //     console.log(response);
  //     setTotalCategory(response.data);

  //     // Update chartData with the new data from the API response
  //     // const updatedChartData = [
  //     //   { label: 'Chưa bắt đầu', value: response.data.totalCountNotStart },
  //     //   { label: 'Đang diễn ra', value: response.data.totalCountInStage },
  //     //   { label: 'Chưa thanh toán', value: response.data.totalCountHaventTranfer },
  //     //   { label: 'Thành công', value: response.data.totalCountComplete },
  //     //   { label: 'Thất bại', value: response.data.totalCountFail },
  //     //   { label: 'Đã nhận hàng', value: response.data.totalCountReceived },
  //     //   { label: 'Nhận hàng lỗi', value: response.data.totalCountErrorItem },
  //     //   { label: 'Đã xóa', value: response.data.totalCountDelete },
  //     // ];

  //     // setChartCategoryData(updatedChartData);
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log('Failed to fetch: ', error);
  //   }
  // };

  const handleSubmitUser = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (!startDateUser || !endDateUser) {
        setErrorMessage('Ngày Bắt Đầu Hoặc Kết Thúc Không Được Bỏ Trống');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
  
      // Check if end date is not greater than start date
      if (endDateUser <= startDateUser) {
        setErrorMessage('Ngày Kết Thúc Phải bằng Hoặc Lớn Hơn Ngày Bắt Đầu');
        setErrorDialogOpen(true);
        setIsLoading(false);
        return; // Exit the function early to prevent the API request
      }
      const response = await axiosInstance.get('https://reasapiv2.azurewebsites.net/api/User', {
        params: {
          startDate: startDateUser.toISOString(),
          endDate: endDateUser.toISOString(),
        },
      });
      console.log(response);
      setTotalUser(response.data);
      setIsLoading(false);
      const updatedChartData = [
        { label: 'Đã chấp nhận', value: response.data.totalAccountAccepted },
        { label: 'Bị cấm', value: response.data.totalAccountBanned },
        // { label: 'Đã từ chối', value: response.data.totalAccountRejected },
        { label: 'Đang chờ duyệt', value: response.data.totalAccountWaiting },
        // { label: 'totalCount', value: response.data.totalCount },
      ];

      setChartUserData(updatedChartData);
    } catch (error) {
      setIsLoading(false);
      console.log('Failed to fetch: ', error);
    }
  };

  return (
    <>
      <Helmet>
        <title> Tổng quan | REAs </title>
      </Helmet>

      <Container maxWidth="xl">
        <Typography variant="h4" sx={{ mb: 5 }}>
          Xin chào {user?.unique_name}
        </Typography>

        
      </Container>

      <Dialog
        fullWidth maxWidth={maxWidth}
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
      >
        <DialogTitle sx={{ textAlign: 'center' }}>
          <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
        </DialogTitle>
        <DialogTitle align='center' variant='h5'>Đã xảy ra Lỗi</DialogTitle>

        <DialogContent>
          <DialogContentText align='center' variant='subtitle2'>
            {errorMessage}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>

    </>
  );
}
