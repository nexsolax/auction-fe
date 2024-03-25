import { Box, Container, Link, Paper, Typography } from "@mui/material";
import Appbar from '../components/appbar';
import Footer from "../components/footer";
import { UIProvider } from '../context/ui';
import AppDrawer from "../components/drawer";
import SearchBox from "../components/search";
import ApproveAuctionForm from "../components/approveauction";
import OpenAuctionForm from './OpenAuctionForm';



export default function OpenAuction(){
    return (
      <Container
        maxWidth='xl'
        sx={{
          background: '#fff',
        }}
      >
        <UIProvider>
          <Appbar />
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems='center'
            justifycontent={'center'}
            sx={{ p: 4 }}
          >
            <Typography variant='h4'>Mở đấu giá </Typography>
          </Box>
          {/* <ApproveAuctionForm/> */}
          <OpenAuctionForm />
          <Box display={'flex'} justifycontent={'center'} sx={{ p: 0.5 }}>
            <Typography variant='h7'> </Typography>
          </Box>
          <Footer />
          <AppDrawer />
          <SearchBox />
        </UIProvider>
      </Container>
    );
}