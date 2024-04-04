import { Typography } from "@mui/material";

import moment from "moment";
import { ProductMetaWrapper } from "../../style/Products";

export default function ProductMeta({ productName,
  endDate,
  startDate,
  startingPrice, matches }) {

  // console.log(product);
  // const formatCreateDate = (startDate) => {
  //   return product.startDate.format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
  // };
  return (
    <ProductMetaWrapper>

      <Typography variant={matches} lineHeight={2}>
        {productName}
      </Typography>
      <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : {startingPrice}
      </Typography>
      <Typography variant={matches ? "caption" : "body1"}>
        Thời Gian Bắt Đầu :  {new Date(startDate).toLocaleString()}
      </Typography>
      <Typography variant={matches ? "caption" : "body1"}>
        Thời Gian Kết Thúc :  {new Date(endDate).toLocaleString()}
      </Typography>
    </ProductMetaWrapper>
  );
}