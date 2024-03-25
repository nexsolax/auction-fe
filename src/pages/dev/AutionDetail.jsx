import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Input,
  Typography,
} from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import LabelValue from './LabelValue';
import dayjs from 'dayjs';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { moneyParser } from '../../utils/formatNumber';

const AutionDetail = () => {
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [bidModalOpen, setBidModalOpen] = useState(false);
  const [bidValue, setBidValue] = useState(0);
  const [highestBid, setHighestBid] = useState(0);
  const [winnerName, setWinnerName] = useState('');

  const { autionId } = useParams();

  useEffect(() => {
    if (!isPlaying) {
      return;
    }

    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => prevTime - 1);
    }, 1000);

    if (timeRemaining <= 0) {
      console.log('complete');
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [timeRemaining, isPlaying]);

  const daysRemaining = Math.floor(timeRemaining / (24 * 60 * 60));
  const hoursRemaining = Math.floor(
    (timeRemaining % (24 * 60 * 60)) / (60 * 60)
  );
  const minutesRemaining = Math.floor((timeRemaining % (60 * 60)) / 60);
  const secondsRemaining = timeRemaining % 60;

  const [product, setProduct] = useState([]);
  const [userName, setUserName] = useState('');

  const startSignalRConnection = () => {
    try {
      const connection = new HubConnectionBuilder()
        .withUrl('https://reasapiv2.azurewebsites.net/reasHub')
        .build();

      connection.start().then(() => {
        console.log('SignalR Connected.');
        var auctionId = autionId; //auction id here
        connection.invoke('JoinGroup', auctionId);
        console.log('User added to group: ' + auctionId);

        connection.on('UpdateHighestBid', (updatedPrice) => {
          // update the new price on UI
          console.log('BID UPDATED TO ' + updatedPrice);
          setHighestBid(updatedPrice);
        });
      });

      // Add the user to the group when they view the auction detail
    } catch (err) {
      console.error('Error starting SignalR connection:', err);
    }
  };

  useEffect(() => {
    axios
      .get(`https://reasapiv2.azurewebsites.net/api/Auction/${autionId}`)
      .then((response) => {
        setProduct(response.data.data);
        setHighestBid(
          response?.data?.data?.userBids[
            response?.data?.data?.userBids.length - 1
          ].amount
        );

        console.log('abc', response?.data?.data.startDate);
        // setTimeRemaining
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    startSignalRConnection();
  }, []);

  useEffect(() => {
    if (!product?.realEstates?.userId) return;
    // console.log('abc', product?.realEstates?.userId);
    axios
      .get(
        `https://reasapiv2.azurewebsites.net/api/User/${product.realEstates.userId}`
      )
      .then((response) => {
        setUserName(response?.data?.data?.name);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [product?.realEstates?.userId]);

  useEffect(() => {
    if (!product?.winnerId) return;

    axios
      .get(`https://reasapiv2.azurewebsites.net/api/User/${product.winnerId}`)
      .then((response) => {
        setWinnerName(response?.data?.data?.name);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [product?.winnerId]);

  const handleRegister = () => {
    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    axios
      .post(
        `https://reasapiv2.azurewebsites.net/api/Auction/${autionId}/register`,
        {},
        config
      )
      .then((response) => {
        console.log(response.data.data);

        window.open(
          `${response.data.data}`,
          '_blank',
          'rel=noopener noreferrer'
        );
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  const handleBidConfirm = () => {
    setBidModalOpen(true);
  };

  const handleBid = () => {
    const amount = Number(bidValue);
    if (!amount) return;

    let config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };
    axios
      .post(
        `https://reasapiv2.azurewebsites.net/api/Auction/${autionId}/place-bid`,
        {
          amount,
        },
        config
      )
      .then((response) => {
        console.log(response.data.data);
        setBidModalOpen(false);
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '85%' }}>
        <div style={{ height: 1, backgroundColor: 'gray' }} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Swiper
              centeredSlides={true}
              speed={700}
              autoplay={{
                delay: 3000,
              }}
              modules={[Autoplay]}
              style={{ width: 500, height: 400 }}
            >
              {product?.realEstates?.realEstateImages?.map((image, index) => (
                <SwiperSlide key={index}>
                  <img src={image.image} alt='product' width={500} />
                </SwiperSlide>
              ))}
            </Swiper>

            {product?.status === 'Completed' && winnerName && (
              <div>
                <h3 style={{ marginBottom: 5 }}>Người thắng</h3>
                <div>{winnerName}</div>
              </div>
            )}

            <h3 style={{ marginBottom: 5 }}>Lịch sử đặt giá</h3>
            {product?.userBids?.map((bid, index) => (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomStyle: 'solid',
                  borderBottomColor: 'gray',
                }}
              >
                <span>{moneyParser(bid?.amount)}</span>
                <span>
                  {dayjs(bid?.dateCreate).format('DD/MM/YYYY HH:mm:ss')}
                </span>
              </div>
            ))}
          </div>

          <div>
            <h3 style={{ marginBottom: 5 }}>Giá cao nhất hiện tại:</h3>
            <h2>{moneyParser(highestBid)} đ</h2>
            <h3>Thời gian đếm ngược bắt đầu trả giá:</h3>

            <Box sx={{ boxShadow: 3 }}>
              <Typography
                sx={{
                  display: 'flex',
                  justifycontent: 'space-between',
                  margin: '3%',
                }}
              >
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={'25px'}
                      fontWeight={'bold'}
                      margin={'1%'}
                      variant='subtitle'
                    >
                      {/* {countdown.days} */}
                      {daysRemaining}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant='subtitle'>
                      Ngày
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={'25px'}
                      fontWeight={'bold'}
                      margin={'1%'}
                      variant='subtitle'
                    >
                      {/* {countdown.hours} */}
                      {hoursRemaining}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant='subtitle'>
                      Giờ
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={'25px'}
                      fontWeight={'bold'}
                      margin={'1%'}
                      variant='subtitle'
                    >
                      {/* {countdown.minutes} */}
                      {minutesRemaining}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant='subtitle'>
                      Phút
                    </Typography>
                  </Grid>
                </Grid>
                <Grid container sx={{ textAlign: 'center' }}>
                  <Grid item xs={12}>
                    <Typography
                      fontSize={'25px'}
                      fontWeight={'bold'}
                      margin={'1%'}
                      variant='subtitle'
                    >
                      {/* {countdown.seconds} */}
                      {secondsRemaining}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography margin={'1%'} variant='subtitle'>
                      Giây
                    </Typography>
                  </Grid>
                </Grid>
              </Typography>
            </Box>

            <Box sx={{ boxShadow: 3 }} style={{ padding: 10 }}>
              <LabelValue
                label='Tên tài sản'
                value={product?.realEstates?.name}
              />
              <LabelValue
                label='Thời gian mở đăng ký'
                value={dayjs(product.registrationStartDate).format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
              />
              <LabelValue
                label='Thời gian kết thúc đăng ký'
                value={dayjs(product.registrationEndDate).format(
                  'DD/MM/YYYY HH:mm:ss'
                )}
              />
              <LabelValue label='Giá khởi điểm' value={product.startingPrice} />
              <LabelValue
                label='Phí đăng ký tham gia đấu giá'
                value={product.registrationFee}
              />
              <LabelValue label='Bước giá' value={product.bidIncrement} />
              <LabelValue
                label='Số bước giá tối đa/ lần trả'
                value={product?.maxBidIncrement || 'Không giới hạn'}
              />
              <LabelValue label='Tiền đặt trước' value={product.deposit} />
              <LabelValue label='Tên chủ tài sản' value={userName} />
              <LabelValue
                label='Thời gian bắt đầu trả giá'
                value={dayjs(product.startDate).format('DD/MM/YYYY HH:mm:ss')}
              />
              <LabelValue
                label='Thời gian kết thúc trả giá'
                value={dayjs(product.endDate).format('DD/MM/YYYY HH:mm:ss')}
              />
            </Box>

            {product.status === 'Completed' ? (
              <></>
            ) : (
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  width: '100%',
                }}
                onClick={
                  product.status === 'Approved'
                    ? handleRegister
                    : handleBidConfirm
                }
              >
                <span
                  style={{
                    backgroundColor: '#2980b9',
                    color: 'white',
                    padding: 5,
                    borderRadius: 5,
                    borderWidth: 1,
                    borderStyle: 'solid',
                    cursor: 'pointer',
                  }}
                >
                  {product.status === 'Approved' ? 'Đăng ký' : 'Đặt giá'}
                </span>
              </div>
            )}

            <Dialog open={bidModalOpen}>
              <DialogTitle variant='h3' align='center'>
                Nhập giá trị muốn đặt
              </DialogTitle>
              <DialogContent>
                <Input
                  value={bidValue}
                  onChange={(e) => setBidValue(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleBid}>OK</Button>
              </DialogActions>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutionDetail;
