import { useTheme } from "@mui/material/styles";
import {
    useMediaQuery,
    Dialog,
    DialogTitle,
    Slide,
    Box,
    IconButton,
    DialogContent,
    Typography,
    Button,
    Stack,
    Grid,
    Divider,
    CircularProgress,
} from "@mui/material";

import DialogActions from "@mui/material/DialogActions";
import DialogContentText from "@mui/material/DialogContentText";
import CloseIcon from "@mui/icons-material/Close";
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import GavelIcon from '@mui/icons-material/Gavel';
import styled from "@emotion/styled";

import React, { useEffect, useState } from "react";
import axios from 'axios';
import moment from "moment";
import { useNavigate } from "react-router-dom";
import useDialogModal from "../../hooks/useDialogModal";
import { Colors } from "../../style/theme";
import { Product, ProductDetailImage, ProductImage } from "../../style/Products";
import AuctionForm from "../auction";

function getTimeRemaining(endDate) {
    const total = Date.parse(endDate) - Date.now();
    const remainingTime = total > 0 ? total : 0;

    const seconds = Math.floor((remainingTime / 1000) % 60);
    const minutes = Math.floor((remainingTime / 1000 / 60) % 60);
    const hours = Math.floor((remainingTime / (1000 * 60 * 60)) % 24);
    const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    return {
        total: remainingTime,
        days,
        hours,
        minutes,
        seconds,
    };
}
function SlideTransition(props) {
    return <Slide direction="down" {...props} />;
}

const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
};

const ProductDetailWrapper = styled(Box)(({ theme }) => ({
    display: "flex",
    padding: theme.spacing(1),
    marginTop: '1%',
    [theme.breakpoints.down('md')]: {
        width: '100%',
    }

}));

const ProductDetailInfoWrapper = styled(Box)(() => ({
    width: '100%',
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",
    lineHeight: 1.5,

}));

const styles = {
    TaskAltIcon: {
        fontSize: '150px',
        color: '#C3E1AE'
    },
    errorIcon: {
        fontSize: '150px',
        color: '#B5E4EB' // Adjust the size as needed // To center it vertically
    },
};

export default function ProductDetail({ open, onClose, product }) {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(
        product.images.length > 0 ? product.images[0].detail : "/assets/images/covers/auction-hammer.jpg"
    );
    const Image = "https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDJ8fHxlbnwwfHx8fHw%3D&auto=format&fit=crop&w=500&q=60"
    const [AuctionDetailDialog, showAuctionDetailDialog, closeProductDialog] =
        useDialogModal(AuctionForm);
    const [countdown, setCountdown] = useState(getTimeRemaining(product.startDate));
    const [showDescriptions, setShowDescriptions] = useState(false);
    const [feeDialogOpen, setFeeDialogOpen] = useState(false);
    const [maxWidth, setMaxWidth] = React.useState('sm');
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const [isErrorDialogOpen, setIsErrorDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState("");
    const [successgMessage, setSuccessDialogMessage] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const navigate = useNavigate();

    const token = localStorage.getItem('token');
    const user = localStorage.getItem('loginUser');
    const jsonUser = JSON.parse(user);
    const isLoggedIn = !!jsonUser && !!jsonUser.name;



    const closeDialog = () => {
        setFeeDialogOpen(false);
    };
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.startDate));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, [product.startDate]);

    const handleImageClick = (image) => {
        setSelectedImage(image);
    };

    const joinAuction = () => {
        setLoading(true);
        const requestData = {
            sessionId: product.id,
            userId: jsonUser.Id
        };

        axios.post("https://reasapiv2.azurewebsites.net/api/User", requestData, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setLoading(false);

            })
            .catch(error => {
                console.error('Error joining the auction:', error);
                if (error.response && error.response.status === 400 && error.response.data) {

                    if (error.response.data === "Bạn đã tham gia vào cuộc đấu giá này trước đó, vui lòng kiểm tra lại email để nắm bắt thông tin của cuộc đấu giá.") {
                        setIsSuccessDialogOpen(true)
                        setSuccessDialogMessage(error.response.data)
                        setLoading(false);
                    } else {
                        setIsErrorDialogOpen(true);
                        setDialogMessage(error.response.data);
                        setLoading(false);
                    }

                } else {
                    setIsErrorDialogOpen(true);
                    setDialogMessage("Đã có lỗi xảy ra");
                    setLoading(false);
                }
            });
    };

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown(getTimeRemaining(product.startDate));

            // Check if the countdown has reached 0
            if (countdown.total <= 0) {
                // Make the API call when the countdown reaches 0
                axios.put("https://reasapiv2.azurewebsites.net/api/Auction", { sessionID: product.id }, { headers: { Authorization: `Bearer ${token}` } },)
                    .then(response => {

                    })
                    .catch(error => {
                        console.error('Error making the API call:', error);
                    });

                clearInterval(interval);
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        };
    }, [countdown.total, product.startDate, product.id]);

    function formatToVND(price) {
        return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    }
    const handleAuctionButtonClick = () => {
        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            joinAuction();
        } else {
            setDialogOpen(true);
        }
    };

    const openDialog = (product) => {

        localStorage.setItem("sessionId", product.sessionId);
        if (isLoggedIn) {
            joinAuction();
        } else {
            setDialogOpen(true);
        }
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const handleToggleDescriptions = () => {
        setShowDescriptions((prevState) => !prevState);
    };
    const handleLogin = () => {        window.location.href = "/login"; // Replace "/login" with your actual login page URL.
    };
    return (
        <>
            <Dialog
                TransitionComponent={SlideTransition}
                variant="permanant"
                open={open}
                fullScreen
            >
                <DialogTitle
                    sx={{ ml: 5, p: 2, backgroundImage: `url(${Image})`, backgroundSize: 'cover' }}
                >
                    <Box
                        display="flex"
                        alignItems="center"
                        justifycontent={"space-between"}

                    >
                        <Typography fontSize={"25px"} >Tên Sản Phẩm : {product.realEstates.name}</Typography>
                        <IconButton onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <ProductDetailWrapper display={"flex"} flexDirection={matches ? "column" : "row"}>
                        <Product sx={{ mr: 2 }}>
                            {/* Use the product.image from the API link as the src */}
                            <ProductDetailImage src={selectedImage} />
                            <Box display="flex" justifycontent="flex-start" mt={2}>
                                {/* Render small images on the same row */}
                                {product.images.map((image, index) => (
                                    <Box key={index} sx={{ flex: "0 0 auto" }}>
                                        <button
                                            type="button"
                                            onClick={() => handleImageClick(image.detail)}
                                            onKeyPress={(event) => {
                                                // Add keyboard event listener to handle Enter key press
                                                if (event.key === 'Enter') {
                                                    handleImageClick(image.detail);
                                                }
                                            }}
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                padding: 0,
                                                margin: 5,
                                                width: "100px", // Set the width for small images
                                            }}
                                        >
                                            <img
                                                src={image.detail}
                                                alt=""
                                                style={{
                                                    width: "100%",
                                                    marginBottom: "4px",
                                                    border: selectedImage === image.detail ? "2px solid blue" : "none",
                                                }}
                                            />
                                        </button>
                                    </Box>
                                ))}
                            </Box>
                        </Product>
                        <ProductDetailInfoWrapper>

                            {/* <Typography sx={{ lineHeight: 4 }} variant="h4">
                                Tên Sản Phẩm : {product.realEstates.name}
                            </Typography> */}
                            <Typography margin={"1%"} color={"#696969"}>Thời gian đếm ngược bắt đầu trả giá:</Typography>
                            <Box sx={{ boxShadow: 3 }}>
                                <Typography sx={{ display: "flex", justifycontent: "space-between", margin: "3%" }}>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.days}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Ngày
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.hours}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Giờ
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.minutes}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Phút
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container sx={{ textAlign: "center" }}>
                                        <Grid item xs={12}>
                                            <Typography fontSize={"25px"} fontWeight={"bold"} margin={"1%"} variant="subtitle">
                                                {countdown.seconds}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Typography margin={"1%"} variant="subtitle">
                                                Giây
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Typography>
                            </Box>

                            <Stack
                                sx={{
                                    boxShadow: 12,
                                    padding: 2,
                                }}
                            >
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} align="inherit" color={"#696969"} variant="subtitle">Mô tả sản phẩm  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {product.description} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá khởi Điểm :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.startingPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">
                                        Phí Tham Gia Đấu Giá:
                                    </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle">
                                        {formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.startingPrice, 10000),
                                                200000
                                            )
                                        )}
                                    </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Tiền Đặt Cọc:  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle">{product.deposit ? (formatToVND(product.depositFee * product.startingPrice)):("0")}  </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Bước Giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.bidIncrement)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Giá hiện tại  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatToVND(product.finalPrice)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.delayTime)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thay đổi thời gian trì hoãn tăng giá :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.freeTime)} (Cuối) </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian trì hoãn tăng giá đã thay đổi :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {(product.delayFreeTime)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                }}>
                                    <Typography margin={'1%'} color={"#696969"} align="left" variant="subtitle">Thời gian bắt đầu :  </Typography>
                                    <Typography margin={'1%'} align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(product.startDate)} </Typography>
                                </Typography>
                                <Typography sx={{
                                    display: "flex",
                                    justifycontent: "space-between",
                                    margin: '1%'
                                }}>
                                    <Typography color={"#696969"} align="left" variant="subtitle">Thời gian Kết thúc :  </Typography>
                                    <Typography align="right" color={"#B41712"} variant="subtitle"> {formatCreateDate(product.endDate)} </Typography>
                                </Typography>
                                <Typography margin={'1%'} variant="subtitle">Giá khởi Điểm : {formatToVND(product.startingPrice)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Bước Giá : {formatToVND(product.bidIncrement)}</Typography>
                                
                                <Typography margin={'1%'} variant="subtitle">Thời gian bắt đầu : {formatCreateDate(product.startDate)}</Typography>
                                <Typography margin={'1%'} variant="subtitle">Thời gian Kết thúc : {formatCreateDate(product.endDate)}</Typography>

                                {
                                    product.descriptions.map((description, index) => (
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
                                    ))
                                }
                                <Typography
                                    margin={"1%"}
                                    fontWeight={"bold"}
                                    variant="dashed"
                                    sx={{ cursor: "pointer", display: "flex", justifycontent: "center", }}
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
                                <Button
                                    startIcon={<GavelIcon />}
                                    size="large"
                                    color="primary"
                                    variant="contained"
                                    // onClick={() => openDialog(product)}
                                    disabled={isLoading} // Disable the button when loading
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : "Đăng Kí Đấu Giá."}
                                </Button>
                            </Stack>
                            <Box
                                sx={{
                                    display: "flex",
                                    justifycontent: "flex-start",
                                    mt: 2,
                                    flexWrap: "wrap", // Add flex-wrap to handle wrapping descriptions
                                }}
                            >
                                {product.descriptions.map((description, index) => (
                                    <Typography
                                        key={index}
                                        margin={"1%"}
                                        variant="subtitle"
                                        sx={{ display: showDescriptions ? "block" : "none" }} // Show or hide the descriptions based on state
                                    >
                                        {description.description}: {description.detail}<br />
                                    </Typography>
                                ))}
                            </Box>
                            <Box
                                sx={{ mt: 4 }}
                                display="flex"
                                alignItems="center"
                                justifycontent="space-between"
                            >
                                <Button color="primary" variant="contained" onClick={handleAuctionButtonClick}>
                                    Đăng Kí Đấu Giá.
                                </Button>
                            </Box>

                        </ProductDetailInfoWrapper>
                    </ProductDetailWrapper>
                </DialogContent>
            </Dialog>
            <AuctionDetailDialog product={product} />
            <Dialog fullWidth maxWidth={maxWidth} open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Không Thể Tham Gia Đấu Giá</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn cần đăng nhập trước để đăng kí tham gia đấu giá.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        Hủy Bỏ
                    </Button>
                    <Button onClick={handleLogin} color="primary" autoFocus>
                        Đăng Nhập
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth maxWidth={maxWidth} open={isSuccessDialogOpen} onClose={() => setIsSuccessDialogOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Thành Công</DialogTitle>
                <DialogContent>
                    <DialogContentText align="center">
                        {successgMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsSuccessDialogOpen(false)} color="primary">
                        OK
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog fullWidth maxWidth={maxWidth} open={isErrorDialogOpen} onClose={() => setIsErrorDialogOpen(false)}>
                <DialogTitle sx={{ textAlign: 'center' }}>
                    <ErrorOutlineOutlinedIcon style={styles.errorIcon} />
                </DialogTitle>
                <DialogTitle variant="h4" align="center">Thông Báo</DialogTitle>
                <DialogContent>
                    <DialogContentText align="center">
                        {dialogMessage}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    {/* <Button onClick={() => closeJonningDialog()} color="primary">
                        OK
                    </Button> */}
                </DialogActions>
            </Dialog>
            <Dialog fullWidth maxWidth={maxWidth} open={feeDialogOpen} onClose={closeDialog}>
                <DialogTitle variant="h4" align="center">Chi tiết đơn hàng</DialogTitle>
                <DialogContent>
                    {selectedItem && (
                        <>
                            <Grid marginTop={"50px"} marginBottom={"50px"} >
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Tham Gia Đấu Giá</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1">

                                    {formatToVND(
                                            Math.min(
                                                Math.max(product?.participationFee * product?.startingPrice, 10000),
                                                200000
                                            )
                                        )}                                   
                                    </Typography>
                                </Typography>
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Đặt Cọc</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1"> {selectedItem?.deposit ? (
                                        (selectedItem?.startingPrice * selectedItem?.depositFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })
                                    ) : (
                                        "--"
                                    )}</Typography>
                                </Typography>
                            </Grid>
                            <Divider variant="inset" />
                            <Typography marginTop={"50px"} marginBottom={"50px"}>

                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng phụ</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1">
                                    {product?.deposit ? (
                                        formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.startingPrice, 10000),
                                                200000
                                            ) + (selectedItem?.depositFee * selectedItem?.startingPrice)
                                        )
                                    ) : (
                                        formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.startingPrice, 10000),
                                                200000
                                            ) 
                                        )
                                    )}
                                    </Typography>
                                </Typography>
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Phí Vận Chuyển</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1"> -- </Typography>
                                </Typography>
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} align="inherit" variant="subtitle1">Thuế</Typography>
                                    <Typography margin={'1%'} align="right" variant="subtitle1"> -- </Typography>
                                </Typography>
                                <Typography sx={{ mt: 1, mb: 1, display: "flex", justifycontent: "space-between" }}>
                                    <Typography margin={'1%'} color={"#4688F4"} align="inherit" variant="subtitle1">Khuyến Mãi/ Mã Quà Tặng </Typography>
                                </Typography>
                            </Typography>

                            <Divider variant="inset" />
                            <Typography sx={{ display: "flex", justifycontent: "space-between" }}>
                                <Typography margin={'1%'} align="inherit" variant="subtitle1">Tổng tiền phải trả</Typography>
                                <Typography margin={'1%'} align="right" variant="h4">
                                    
                                {product?.deposit ? (
                                         formatToVND(
                                            Math.min(
                                                Math.max(product?.participationFee * product?.startingPrice, 10000),
                                                200000
                                            ) + (selectedItem?.depositFee * selectedItem?.startingPrice)
                                        )
                                    ) : (
                                        formatToVND(
                                            Math.min(
                                                Math.max(product.participationFee * product.startingPrice, 10000),
                                                200000
                                            )
                                        )
                                    )}
                                    
                                    
                                        </Typography>
                            </Typography>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">
                        Thoát
                    </Button>
                    {/* <Button onClick={handlePayment} color="primary">
                        Thanh toán bằng PayPal
                    </Button> */}
                </DialogActions>
            </Dialog>
        </>
    );
}