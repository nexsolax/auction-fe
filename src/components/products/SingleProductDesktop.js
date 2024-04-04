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

  const statusMapping = {
    'Completed': 'Hoàn thành',
    'OnGoing': 'Đang diễn ra',
    'Approved': 'Đang mở đăng ký',
    'Pending': 'Chờ duyệt',
  };

  const statusInVietnamese = statusMapping[status] || status;


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


        <ProductMetaWrapper>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >

          <span
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: status === 'Completed' ? 'green' : status === 'OnGoing' ? 'blue' : status === 'Approved' ? 'blue' : 'gray',
              backgroundColor: status === 'Completed' ? '#c6f6d5' : status === 'OnGoing' ? '#bee3f8' : status === 'Approved' ? '#bee3f8' : '#edf2f7',
              color: status === 'Completed' ? 'green' : status === 'OnGoing' ? 'blue' : status === 'Approved' ? 'blue' : 'gray',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.125rem',
              fontWeight: 'bold',
            }}
          >
            {statusInVietnamese}
          </span>
        </div>
        </ProductMetaWrapper>
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
        <ProductActionsWrapper show={showOptions || matches}>
          <Stack direction={matches ? 'row' : 'column'}>
            <ProductActionButton>
              <Tooltip placement='left' title='share this product'>
                <ShareIcon color='primary' />
              </Tooltip>
            </ProductActionButton>
            <ProductActionButton onClick={() => showProductDetailDialog()}>
              <Tooltip placement='left' title='Full view'>
                <FitScreenIcon color='primary' />
              </Tooltip>
            </ProductActionButton>
          </Stack>
        </ProductActionsWrapper>
        <ProductMetaWrapper>
          <ProductMeta
            productName={productName}
            endDate={endDate}
            startDate={startDate}
            startingPrice={startingPrice} />
        </ProductMetaWrapper>
      </Product>


      <ProductDetailDialog product={products} />
    </>
  );
}
