import { useMediaQuery, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { BannerContainer, BannerContent, BannerDescription, BannerShopButton, BannerTitle, Bannerimage } from "../../style/banner";

export default function Banner() {
    const theme = useTheme();
    const matches = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <BannerContainer>
            <Bannerimage  src="assets/images/banner/banner.jpg"/>
            <BannerContent>
                <Typography varriant="h6"> Chào mừng tới hệ thống đấu giá bất động sản - REAS</Typography>
                <BannerTitle variant="h2">Nền tảng đấu giá trực tuyến tại Việt Nam</BannerTitle>
                <BannerDescription variant="subtitle">Là một trong những nhà đấu giá tại Việt Nam, REAS là đơn vị tiên phong ứng dụng công nghệ thông tin vào hoạt động đấu giá.
                REAS là đơn vị tổ chức cuộc đấu giá trực tuyến chính thống tại Việt Nam.
                </BannerDescription>
                <BannerShopButton href="/prepare" color="black">Khám Phá</BannerShopButton>
            </BannerContent>
        </BannerContainer>

    );
}