import { Typography } from "@mui/material";

import moment from "moment";
import { ProductMetaWrapper } from "../../style/Products";

export default function ProductMeta({ product, matches,productName, startDate, endDate, startingPrice }) {

 console.log(product);
  const formatCreateDate = (startDate) => {
    return product.startDate.format('YYYY-MM-DD HH:mm:ss'); // Adjust the format as per your requirement
  };
    return (
      <ProductMetaWrapper>
        
        {/* <Typography variant={matches } lineHeight={2}>
          {productName}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : 
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Thời Gian Bắt Đầu :  {formatCreateDate}
        </Typography> */}
      </ProductMetaWrapper>
    );
}