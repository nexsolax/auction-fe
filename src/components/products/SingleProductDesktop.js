import { useEffect, useState } from 'react';

import { Stack, Tooltip, Typography } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import useDialogModal from '../../hooks/useDialogModal';
import ProductDetail from '../productdetail';
import ProductMeta from './ProductMeta';
import {
  Product,
  ProductActionButton,
  ProductActionsWrapper,
  ProductAddToCart,
  ProductImage,
  ProductMetaWrapper,
} from '../../style/Products';
import { useNavigate } from 'react-router-dom';

const defaultImageSource = '/assets/images/covers/auction-hammer.jpg';
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
  // const firstImageURL = product.images && product.images.length > 0 ? product.images[0].detail : null;
  // const imageSource = firstImageURL || defaultImageSource;

  const handleMouseEnter = () => {
    setShowOptions(true);
  };
  const handleMouseLeave = () => {
    setShowOptions(false);
  };

  const handleClick = () => {
    console.log('Product clicked', id);
    navigation(`/aution-detail/${id}`);
  };

  useEffect(() => {
    console.log('Status changed:', status);
  }, [status]);

  return (
    <>
      <Product onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <ProductImage src={productImage} />
        
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            width: '100%',
          }}
        >
          <span
            style={{
              borderColor: 'red',
              padding: 5,
              borderRadius: 5,
              borderWidth: 1,
              borderStyle: 'solid',
            }}
          >
            {status}
          </span>
        </div>
        {(showOptions || matches) && (
          <ProductAddToCart
            onClick={handleClick}
            show={showOptions}
            variant='contained'
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
        <ProductMeta product={products} />
        </ProductMetaWrapper>
      </Product>

      <ProductDetailDialog product={products} />
    </>
  );
}
