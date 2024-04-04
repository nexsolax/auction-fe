import { Typography } from "@mui/material";
import moment from "moment";
import { ProductMetaWrapper } from "../../style/Products";


export default function StageProductMeta({ product, matches }) {


    return (
      <ProductMetaWrapper>
        
        <Typography variant={matches ? "h6" : "h5"} lineHeight={2}>
          {}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Giá khởi Điểm : {}
        </Typography>
        <Typography variant={matches ? "caption" : "body1"}>
        Thời Gian Bắt Đầu : {}
        </Typography>
      </ProductMetaWrapper>
    );
}