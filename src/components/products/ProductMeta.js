import { Typography } from "@mui/material";

import moment from "moment";
import { ProductMetaWrapper } from "../../style/Products";

export default function ProductMeta({ product, matches }) {

  // function formatToVND(price) {
  //   return price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  // };
  const formatCreateDate = (createDate) => {
    return moment(createDate).format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
  };
    return (
      <ProductMetaWrapper>
        
        {/* <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          {product.name}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : {product.startingPrice}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Thời Gian Bắt Đầu :  {formatCreateDate(product.startDate)}
        </Typography> */}
      </ProductMetaWrapper>
    );
}