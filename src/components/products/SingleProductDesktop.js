import { useEffect, useState } from "react";

import { Stack, Tooltip, Typography } from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import FitScreenIcon from "@mui/icons-material/FitScreen";
import useDialogModal from "../../hooks/useDialogModal";
import ProductDetail from "../productdetail";
import ProductMeta from "./ProductMeta";
import {
  Product,
  ProductActionButton,
  ProductActionsWrapper,
  ProductAddToCart,
  ProductImage,
  ProductMetaWrapper,
} from "../../style/Products";
import { useNavigate } from "react-router-dom";

const defaultImageSource = "/assets/images/covers/auction-hammer.jpg";
export default function SingleProductDesktop({
  products,
  id,
  status,
  productName,
  productImage,
  endDate,
  startDate,
  startingPrice,
  matches,
}) {
  const navigation = useNavigate();
  const [ProductDetailDialog, showProductDetailDialog, closeProductDialog] =
    useDialogModal(ProductDetail);
  const [showOptions, setShowOptions] = useState(false);

  const handleMouseEnter = () => {
    setShowOptions(true);
  };
  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handleClick = () => {
    console.log("Product clicked", id);
    navigation(`/aution-detail/${id}`);
  };

  useEffect(() => {
    console.log("Status changed:", status);
  }, [status]);
  function formatDate(dateString) {
    const date = new Date(dateString);

    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    return formattedDate;
  }

  return (
    <>
      <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ProductImage src={productImage} />
        Tên tài sản: {productName}
        <br />
        Ngày bắt đầu đấu giá: {formatDate(startDate)} <br />
        Ngày kết thúc đấu giá: {formatDate(endDate)}
        <br />
        Giá khởi điểm: {startingPrice}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          {status === "Completed" && (
            <span
              style={{
                borderColor: "red",
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              Đã hoàn thành
            </span>
          )}
            {status === "OnGoing" && (
            <span
              style={{
                borderColor: "red",
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              Đang diễn ra
            </span>
          )}
            {status === "Approved" && (
            <span
              style={{
                borderColor: "red",
                padding: 5,
                borderRadius: 5,
                borderWidth: 1,
                borderStyle: "solid",
              }}
            >
              Bắt đầu đăng ký
            </span>
          )}
        </div>
        {(showOptions || matches) && (
          <ProductAddToCart
            onClick={handleClick}
            show={showOptions}
            variant="contained"
            product={products}
          >
            Thông tin sản phẩm
          </ProductAddToCart>
        )}
      </Product>
      <ProductMetaWrapper>
        <ProductMeta product={products} />{" "}
        {/* Pass selected product to ProductMeta */}
      </ProductMetaWrapper>

      <ProductDetailDialog product={products} />
    </>
  );
}
