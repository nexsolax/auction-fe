import { useTheme } from "@mui/material/styles";
import axios from "axios";
import moment from "moment";
import React, { createContext, useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "@emotion/styled";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
  useMediaQuery
} from "@mui/material";
import {
  Product
} from "../../style/Products";
import { Colors } from "../../style/theme";
import AuctionCountdown from "./auctionCountdown";

const BidDialogContext = createContext();

const useBidDialog = () => {
  return useContext(BidDialogContext);
};

const AuctionForm = () => {
  const [auctionData, setAuctionData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [isCountdownRunning, setIsCountdownRunning] = useState(true);
  const [isAuctionOver, setIsAuctionOver] = useState(false);
  const [currentDelayTime, setCurrentDelayTime] = useState(() => {
    const storedDelayDate = localStorage.getItem("currentDelayTime");
    return storedDelayDate || null; // Set to null initially to fetch from API later
  });
  const [currentBigImage, setCurrentBigImage] = useState(null);
  const theme = useTheme();
  const currentDate = moment();
  const [isWinner, setIsWinner] = useState(false);
  const [winnerData, setWinnerData] = useState(null);
  const [isIntervalActive, setIsIntervalActive] = useState(true);
  const matches = useMediaQuery(theme.breakpoints.down("md"));
  const token = localStorage.getItem("token");
  const { sessionId } = useParams();
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const [sessionDetails, setSessionDetails] = useState([]);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [shouldResetCountdown, setShouldResetCountdown] = useState(false);

  const [connection, setConnection] = useState(null);
  const [inputText, setInputText] = useState("Check");
  const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [feeDialogOpen, setFeeDialogOpen] = useState(false);
  const [link, setPaymentlink] = useState();
  const [maxWidth, setMaxWidth] = React.useState("xs");
  const [hasServerResponse, setHasServerResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);


  

  useEffect(() => {
    // sendMessage();
    fetchAuctionData();
  }, []);

  useEffect(() => {
    localStorage.setItem("currentDelayTime", currentDelayTime);
  }, [currentDelayTime]);


  const highestPriceDetail = sessionDetails.reduce(
    (maxDetail, detail) => {
      if (
        detail.price > maxDetail.price ||
        (detail.price === maxDetail.price &&
          detail.createDate < maxDetail.createDate)
      ) {
        return { price: detail.price, createDate: detail.createDate };
      }
      return maxDetail;
    },
    { price: 0, createDate: null }
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };

  const closeJonningDialog = () => {
    setFeeDialogOpen(true); // Set the selected item first
    // handlePayment();
    setIsErrorDialogOpen(false);
  };

  function formatToVND(price) {
    return price?.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  }


  const fetchAuctionData = async () => {
    try {
      const response = await axios.get("https://reasapiv2.azurewebsites.net/api/Auction", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAuctionData(response.data.data.pagingData);

      if (response.data.length > 0) {
        const remainingDate = moment(
          response.data[0]?.endDate,
          "YYYY-MM-DD HH:mm:ss"
        ).diff(moment(), "seconds");

        if (remainingDate <= convertTimeToSeconds(response.data.data.pagingData[0]?.freeDate)) {
          setCurrentDelayTime(response.data.data.pagingData[0]?.delayFreeDate);
        } else {
          setCurrentDelayTime(response.data.data.pagingData[0]?.delayDate);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const makeApiCall = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        "https://reasapiv2.azurewebsites.net/api/User",
        { userId: jsonUser.Id, sessionId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setIsLoading(false);
    } catch (error) {
      if (
        error.response &&
        error.response.status === 400 &&
        error.response.data
      ) {
        setIsErrorDialogOpen(true);
        setDialogMessage(error.response.data);
        setIsLoading(false);
      } else {
        setIsErrorDialogOpen(true);
        setDialogMessage("Đã có lỗi xảy ra");
        setIsLoading(false);
      }
    }
  };

  const handleToggleDescriptions = () => {
    setShowDescriptions((prevState) => !prevState);
  };
  const formatCreateDate = (createDate) => {
    return moment(createDate).format("YYYY-MM-DD HH:mm:ss.SSS"); // Adjust the format as per your requirement
  };

  const convertTimeToSeconds = (timeString) => {
    if (timeString) {
      const [hours, minutes, seconds] = timeString.split(":").map(Number);
      return hours * 3600 + minutes * 60 + seconds;
    }
    // Handle the case where timeString is undefined or empty
    return 0; // Or some other default value as needed
  };

  const RemainingTime = ({ endDate }) => {
    const [time, setTime] = useState(() => {
      const storedTime = localStorage.getItem("countdownTime");
      return storedTime
        ? Math.max(0, parseInt(storedTime, 10))
        : convertTimeToSeconds(currentDelayTime);
    });

    useEffect(() => {
      const interval = setInterval(() => {
        setTime((prevTime) => {
          if (prevTime > 0) {
            const updatedTime = prevTime - 1;
            localStorage.setItem("countdownTime", updatedTime.toString());
            return updatedTime;
          }

          const fiveMinutesBeforeEndTime = convertTimeToSeconds(
            moment(auctionData[0]?.endDate, "YYYY-MM-DD HH:mm:ss")
              .subtract(
                convertTimeToSeconds(auctionData[0]?.freeTime),
                "seconds"
              )
              .format("HH:mm:ss")
          );

          if (prevTime <= 0 && fiveMinutesBeforeEndTime <= 0) {
            // window.localStorage.removeItem('currentDelayTime');
            // window.localStorage.removeItem('countdownTime');
            const delayFreeTime = auctionData[0]?.delayFreeTime;
            if (delayFreeTime) {
              setCurrentDelayTime(delayFreeTime);
              localStorage.setItem("currentDelayTime", delayFreeTime);
              setShouldResetCountdown(true); // Set the flag to indicate countdown reset
              return convertTimeToSeconds(delayFreeTime);
            }
          }

          setIsCountdownRunning(false);
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }, [endDate, auctionData, shouldResetCountdown]);

    useEffect(() => {
      const remainingTime = moment(
        auctionData[0]?.endDate,
        "YYYY-MM-DD HH:mm:ss"
      ).diff(moment(), "seconds");
      if (remainingTime <= 0) {
        setIsAuctionOver(true);
        setIsCountdownRunning(false);
      }
    }, [auctionData]);

    const formatTime = (seconds) => {
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;
      return `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    return (
      <Grid container margin={"1%"} sx={{ justifycontent: "center" }}>
        <Grid item>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Typography variant="h6" component="span" sx={{ mr: 1 }}>
              {formatTime(time)}
            </Typography>
          </Box>
        </Grid>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() => {
              setIsDialogOpen(true);
              setCurrentPrice(auctionData[0]?.finalPrice);
            }}
            // Disable the button if the current time is after the auction end time
            disabled={
              isCountdownRunning ||
              moment(auctionData[0]?.endDate, "YYYY-MM-DD HH:mm:ss").isBefore(
                currentDate
              )
            }
          >
            Tăng Giá :{" "}
            {formatToVND(
              auctionData[0]?.finalPrice + auctionData[0]?.stepPrice
            )}
          </Button>
        </Grid>
      </Grid>
    );
  };

  const ProductDetailWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    width: "100%",
    height: "100%",
    padding: theme.spacing(1),
    border: "1px dashed #000000",
    marginTop: "1%",
    borderRadius: "5px",
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));

  const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: "100%",
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    lineHeight: 1.5,
    [theme.breakpoints.down("md")]: {
      width: "100%",
    },
  }));

  useEffect(() => {
    const checkAuctionEnd = () => {
      if (auctionData && auctionData[0]) {
        const currentDate = moment();
        const auctionEndDate = moment(
          auctionData[0]?.endDate,
          "YYYY-MM-DD HH:mm:ss"
        );
        const fiveMinutesBeforeEndDate = convertTimeToSeconds(
          moment(auctionData[0]?.endDate, "YYYY-MM-DD HH:mm:ss")
            .subtract(convertTimeToSeconds(auctionData[0]?.freeDate), "seconds")
            .format("HH:mm:ss")
        );

        if (auctionEndDate.isBefore(currentDate)) {
          // handleGoBack();
          setIsIntervalActive(false);
        } else if (currentDate.isAfter(fiveMinutesBeforeEndDate)) {
          // Change the interval to 3 seconds (3000 milliseconds)
          clearInterval(interval);
          interval = setInterval(() => {
            fetchAuctionData();

            checkAuctionEnd();
          }, 3000);
        }
      }
    };

    let interval = null;

    if (isIntervalActive) {
      interval = setInterval(() => {
        fetchAuctionData();

        checkAuctionEnd();
      }, 5000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isIntervalActive, auctionData]);

  const styles = {
    TaskAltIcon: {
      fontSize: "100px",
      color: "#C3E1AE",
    },
    errorIcon: {
      fontSize: "100px",
      color: "#B5E4EB", // Adjust the size as needed // To center it vertically
    },
  };
  const handleDialogClose = async () => {
    // await sendMessage();
    await makeApiCall();

    setPage(0);
    fetchAuctionData();


    setIsDialogOpen(false);
    setIsCountdownRunning(true);

    if (currentDelayTime) {
      localStorage.setItem(
        "countdownTime",
        convertTimeToSeconds(currentDelayTime).toString()
      );
    }

    setShouldResetCountdown(false);
    // Reset the flag after countdown reset
  };

  if (!auctionData) {
    return <Typography>Trang này hiện giờ không khả dụng</Typography>;
  }

  const ProductDetailImageContainer = styled(Box)({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  });

  const ProductDetailImage1 = styled("img")(({ theme }) => ({
    width: "650px",
    height: "500px",
    background: Colors.light_gray,
    padding: "10px",
    [theme.breakpoints.down("md")]: {
      width: "80%",
      height: "80%",
      padding: "25px",
    },
  }));

  const ProductDetailThumbnail = styled("img")(({ theme }) => ({
    width: "100px",
    height: "80px",
    objectFit: "cover",
    borderRadius: "5px",
    cursor: "pointer",
    transition: "transform 0.3s ease-in-out",
    "&:hover": {
      transform: "scale(1.1)",
    },
    [theme.breakpoints.down("md")]: {
      width: "80px",
      height: "60px",
    },
  }));

  const renderProductImages = () => {
    if (
      !auctionData ||
      !auctionData[0] ||
      !auctionData[0].images ||
      auctionData[0].images.length === 0
    ) {
      // Render the default image when there are no product images
      return (
        <ProductDetailImageContainer>
          <ProductDetailImage1 src="/assets/images/covers/auction-hammer.jpg" />
        </ProductDetailImageContainer>
      );
    }

    // Use the selected thumbnail index or default to 0 (first image) if not selected
    const selectedThumbnailIndex = currentBigImage
      ? auctionData[0]?.images.findIndex(
          (image) => image.detail === currentBigImage
        )
      : 0;

    const bigImage =
      currentBigImage ||
      auctionData[0]?.images?.[selectedThumbnailIndex]?.detail;
    const thumbnailImages = auctionData[0]?.images || [];

    return (
      <ProductDetailImageContainer>
        <ProductDetailImage1 src={bigImage} />
        <Box sx={{ display: "flex", gap: "5px" }}>
          {thumbnailImages.map((image, index) => (
            <ProductDetailThumbnail
              key={index}
              src={image.detail}
              onClick={() => setCurrentBigImage(image.detail)} // Set the clicked image as the current big image
            />
          ))}
        </Box>
      </ProductDetailImageContainer>
    );
  };

  const BidDialog = () => {
    const { isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice } =
      useBidDialog();

    return (
      <Modal
        open={isDialogOpen}
        onClose={closeDialog}
        aria-labelledby="bid-dialog-title"
        aria-describedby="bid-dialog-description"
        BackdropProps={{
          style: {
            backgroundColor: "transparent", // or 'rgba(0, 0, 0, 0)'
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: "5px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <DialogTitle sx={{ textAlign: "center" }}>
            <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
          </DialogTitle>
          <DialogTitle align="center" variant="h4" id="bid-dialog-title">
            Bạn Có Muốn Tăng Giá
          </DialogTitle>
          <DialogContent>
            <Typography
              align="center"
              variant="subtitle2"
              id="bid-dialog-description"
            >
              Giá của sản phẩm hiện giờ là :{" "}
              {formatToVND(auctionData[0]?.finalPrice)}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Thoát
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleDialogClose();
                closeDialog();
              }}
              disabled={isLoading} // Disable when loading
            >
              {isLoading ? <CircularProgress size={24} /> : "Đồng Ý"}
            </Button>
            {/* <Button onClick={() => {
            handleDialogClose();
            closeDialog();
          }} color="primary">
            Đồng Ý
          </Button> */}
          </DialogActions>
        </Box>
      </Modal>
    );
  };

  return (
    <>

      <ProductDetailWrapper
        display={"flex"}
        flexDirection={matches ? "column" : "row"}
      >
        <Product sx={{ mr: 2 }}>{renderProductImages()}</Product>

        <ProductDetailInfoWrapper>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifycontent: "center",
              flexDirection: "column",
            }}
          >
            {auctionData[0]?.endDate && auctionData[0]?.startDate && (
              <AuctionCountdown
                endDate={auctionData[0]?.endDate}
                startDate={auctionData[0]?.startDate}
              />
            )}
          </Box>
          <Stack
            sx={{
              boxShadow: 12,
              padding: 2,
            }}
          >
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                align="inherit"
                color={"#696969"}
                variant="subtitle"
              >
                Mô tả sản phẩm{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {auctionData[0]?.description}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Giá khởi Điểm :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {formatToVND(auctionData[0]?.firstPrice)}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Phí Tham Gia Đấu Giá:{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {formatToVND(
                  Math.min(
                    Math.max(
                      auctionData[0]?.participationFee *
                        auctionData[0]?.firstPrice,
                      10000
                    ),
                    200000
                  )
                )}
                {/* {formatToVND(auctionData[0]?.participationFee * auctionData[0]?.firstPrice)} */}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Tiền Đặt Cọc:{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {auctionData[0]?.deposit
                  ? formatToVND(
                      auctionData[0]?.depositFee * auctionData[0]?.firstPrice
                    )
                  : "0"}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Bước Giá :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {formatToVND(auctionData[0]?.stepPrice)}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Giá hiện tại{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {formatToVND(auctionData[0]?.finalPrice)}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Thời gian trì hoãn tăng giá :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {auctionData[0]?.delayDate}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Thay đổi thời gian trì hoãn tăng giá :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {auctionData[0]?.freeDate} (Cuối){" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Thời gian trì hoãn tăng giá đã thay đổi :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {auctionData[0]?.delayFreeDate}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
              }}
            >
              <Typography
                margin={"1%"}
                color={"#696969"}
                align="left"
                variant="subtitle"
              >
                Thời gian bắt đầu :{" "}
              </Typography>
              <Typography
                margin={"1%"}
                align="right"
                color={"#B41712"}
                variant="subtitle"
              >
                {" "}
                {formatCreateDate(auctionData[0]?.startDate)}{" "}
              </Typography>
            </Typography>
            <Typography
              sx={{
                display: "flex",
                justifycontent: "space-between",
                margin: "1%",
              }}
            >
              <Typography color={"#696969"} align="left" variant="subtitle">
                Thời gian Kết thúc :{" "}
              </Typography>
              <Typography align="right" color={"#B41712"} variant="subtitle">
                {" "}
                {formatCreateDate(auctionData[0]?.endDate)}{" "}
              </Typography>
            </Typography>
            <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(auctionData.startingPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(auctionData.bidIncrement)}</Typography>
                                {/* <Typography margin={'1%'} variant="subtitle">Giá hiện tại : {formatToVND(auctionData.finalPrice)}</Typography> */}
                                <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {formatCreateDate(auctionData.startDate)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {formatCreateDate(auctionData.endDate)}</Typography>

            {auctionData[0]?.descriptions.map((description, index) => (
              <Typography
                key={index}
                margin={"1%"}
                sx={{
                  display: showDescriptions ? "flex" : "none", // Show or hide the descriptions based on state
                  justifycontent: "space-between",
                }}
              >
                <Typography color={"#696969"} variant="subtitle">
                  {description.description} :
                </Typography>
                <Typography
                  color={"#B41712"}
                  variant="subtitle"
                  sx={{ marginLeft: "auto" }}
                >
                  {description.detail}
                </Typography>
              </Typography>
            ))}

            <Typography
              margin={"1%"}
              fontWeight={"bold"}
              variant="dashed"
              sx={{
                cursor: "pointer",
                display: "flex",
                justifycontent: "center",
              }}
              onClick={handleToggleDescriptions} // Toggle the visibility on click
            >
              {showDescriptions ? (
                <>
                  Ẩn bớt <KeyboardArrowUpIcon />
                </>
              ) : (
                <>
                  Xem thêm <KeyboardArrowDownIcon />
                </>
              )}
            </Typography>

            <Box
              display="flex"
              alignItems="center"
              justifycontent="space-between"
            >
              {auctionData[0]?.delayDate && (
                <RemainingTime endDate={auctionData[0]?.endDate} />
              )}
            </Box>
          </Stack>
        </ProductDetailInfoWrapper>
      </ProductDetailWrapper>
      <Stack boxShadow={12} marginTop={"2%"}>
        <>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Người Dùng</TableCell>
                  <TableCell align="center">Giá</TableCell>
                  <TableCell align="center">Vào Lúc</TableCell>
                  <TableCell align="center">Trạng Thái</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sessionDetails
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((detail, index) => (
                    <TableRow key={index}>
                      <TableCell style={{ color: "green" }} align="center">
                        {detail.unique_name}
                      </TableCell>
                      <TableCell align="center">
                        {formatToVND(detail.price)}
                      </TableCell>
                      <TableCell align="center">
                        {formatCreateDate(detail.createDate)}
                      </TableCell>
                      <TableCell align="center">
                        {detail.price === highestPriceDetail.price &&
                        detail.createDate === highestPriceDetail.createDate ? (
                          <Typography style={{ color: "green" }}>
                            Trả Giá Cao Nhất(Sớm nhất){" "}
                          </Typography>
                        ) : (
                          <Typography style={{ color: "red" }}>
                            Trả Giá Thấp Hơn
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={sessionDetails.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage="Số hàng trên mỗi trang:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} của ${count}`
            }
          />
        </>
      </Stack>

      <BidDialogContext.Provider
        value={{ isDialogOpen, setIsDialogOpen, currentPrice, setCurrentPrice }}
      >
        <BidDialog />
      </BidDialogContext.Provider>
      {/* popupdialog */}

      <Dialog
        open={isErrorDialogOpen}
        onClose={() => setIsErrorDialogOpen(false)}
      >
        <DialogTitle align="center" variant="h4">
          Thông Báo
        </DialogTitle>
        <DialogContent>
          <DialogContentText>{dialogMessage}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeJonningDialog()} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Modal
        open={feeDialogOpen}
        onClose={closeDialog}
        aria-labelledby="bid-dialog-title"
        aria-describedby="bid-dialog-description"
        BackdropProps={{
          style: {
            backgroundColor: "transparent", // or 'rgba(0, 0, 0, 0)'
          },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 500,
            bgcolor: "background.paper",
            borderRadius: "5px",
            boxShadow: 24,
            p: 4,
          }}
        >
          <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          <DialogContent>
            {auctionData && (
              <>
                <Grid marginTop={"50px"} marginBottom={"50px"}>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Phí Tham Gia Đấu Giá
                    </Typography>
                    <Typography margin={"1%"} align="right" variant="subtitle1">
                      {formatToVND(
                        Math.min(
                          Math.max(
                            auctionData[0]?.participationFee *
                              auctionData[0]?.firstPrice,
                            10000
                          ),
                          200000
                        )
                      )}
                    </Typography>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Phí Đặt Cọc
                    </Typography>
                    <Typography margin={"1%"} align="right" variant="subtitle1">
                      {auctionData[0]?.deposit
                        ? formatToVND(
                            auctionData[0]?.depositFee *
                              auctionData[0]?.firstPrice
                          )
                        : "--"}
                    </Typography>
                  </Typography>
                </Grid>
                <Divider variant="inset" />
                <Typography marginTop={"50px"} marginBottom={"50px"}>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Tổng phụ
                    </Typography>
                    <Typography margin={"1%"} align="right" variant="subtitle1">
                      {auctionData[0]?.deposit
                        ? formatToVND(
                            Math.min(
                              Math.max(
                                auctionData[0]?.participationFee *
                                  auctionData[0]?.firstPrice,
                                10000
                              ),
                              200000
                            ) +
                              auctionData[0]?.depositFee *
                                auctionData[0]?.firstPrice
                          )
                        : formatToVND(
                            Math.min(
                              Math.max(
                                auctionData[0]?.participationFee *
                                  auctionData[0]?.firstPrice,
                                10000
                              ),
                              200000
                            )
                          )}
                    </Typography>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Phí Vận Chuyển
                    </Typography>
                    <Typography margin={"1%"} align="right" variant="subtitle1">
                      {" "}
                      --{" "}
                    </Typography>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Thuế
                    </Typography>
                    <Typography margin={"1%"} align="right" variant="subtitle1">
                      {" "}
                      --{" "}
                    </Typography>
                  </Typography>
                  <Typography
                    sx={{
                      mt: 1,
                      mb: 1,
                      display: "flex",
                      justifycontent: "space-between",
                    }}
                  >
                    <Typography
                      margin={"1%"}
                      color={"#4688F4"}
                      align="inherit"
                      variant="subtitle1"
                    >
                      Khuyến Mãi/ Mã Quà Tặng{" "}
                    </Typography>
                  </Typography>
                </Typography>

                <Divider variant="inset" />
                <Typography
                  sx={{ display: "flex", justifycontent: "space-between" }}
                >
                  <Typography margin={"1%"} align="inherit" variant="subtitle1">
                    Tổng tiền phải trả
                  </Typography>
                  <Typography margin={"1%"} align="right" variant="h4">
                    {auctionData[0]?.deposit
                      ? formatToVND(
                          Math.min(
                            Math.max(
                              auctionData[0]?.participationFee *
                                auctionData[0]?.firstPrice,
                              10000
                            ),
                            200000
                          ) +
                            auctionData[0]?.depositFee *
                              auctionData[0]?.firstPrice
                        )
                      : formatToVND(
                          Math.min(
                            Math.max(
                              auctionData[0]?.participationFee *
                                auctionData[0]?.firstPrice,
                              10000
                            ),
                            200000
                          )
                        )}{" "}
                  </Typography>
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog} color="primary">
              Thoát
            </Button>
            <Button color="primary">Thanh toán bằng PayPal</Button>
          </DialogActions>
        </Box>
      </Modal>

      <Dialog fullWidth maxWidth={maxWidth} open={isLoading} onClose={() => {}}>
        <DialogContent align="center">
          <CircularProgress color="primary" size={60} />
          <Typography>Đang Tải ...</Typography>
        </DialogContent>
      </Dialog>

      {isAuctionOver && hasServerResponse && (
        <>
          {isWinner ? (
            <Dialog fullWidth maxWidth={maxWidth} open onClose={() => {}}>
              <DialogTitle sx={{ textAlign: "center" }}>
                <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
              </DialogTitle>
              <DialogTitle align="center" variant="h4">
                Xin chúc mừng
              </DialogTitle>
              <DialogContent align="center" variant="subtitle1">
                <Typography>
                  Xin Chúc Mừng Bạn Là Người Chiến Thắng Với Số Tiền Là :{" "}
                  {formatToVND(auctionData[0]?.finalPrice)}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Link to="/home" style={{ textDecoration: "none" }}>
                  <Button color="primary">Quay lại Trang chủ</Button>
                </Link>
                <Link to="/shoppingcart" style={{ textDecoration: "none" }}>
                  <Button color="primary">Thanh Toán Ngay</Button>
                </Link>
              </DialogActions>
            </Dialog>
          ) : (
            <Dialog fullWidth maxWidth={maxWidth} open onClose={() => {}}>
              <DialogTitle sx={{ textAlign: "center" }}>
                <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
              </DialogTitle>
              <DialogTitle variant="h4" align="center">
                Cuộc đấu giá đã kết thúc
              </DialogTitle>
              <DialogContent>
                <Typography align="center">
                  Rất tiếc, bạn đã không thắng cuộc đấu giá.{" "}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Link to="/home" style={{ textDecoration: "none" }}>
                  <Button color="primary">Quay lại Trang chủ</Button>
                </Link>
              </DialogActions>
            </Dialog>
          )}
        </>
      )}
    </>
  );
};

export default AuctionForm;
