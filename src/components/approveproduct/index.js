import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

import { useTheme } from "@mui/material/styles";
import {
  Button,
  Chip,
} from "@mui/material";
import axios from "axios";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ApproveProductForm = () => {
  // const [realEstateId, setRealEstateId] = useState("");
  const [RealEstates, setRealEstates] = useState("");
  const [dataList, setDataList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successDialogOpen, setSuccessDialogOpen] = useState(false);
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("loginUser");
  const jsonUser = JSON.parse(user);
  const theme = useTheme();
  const MySwal = withReactContent(Swal)


 useEffect(() => {
    axios
      .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
        headers: { Authorization: `Bearer ${token}` },
        params:{'PageSize' : 100 , 'PageIndex': 1 }
      })
      .then((response) => {
        if (response.data && Array.isArray(response.data.data.pagingData)) {
         setDataList(response.data.data.pagingData);
          // const estateData = response.data.data.pagingData.reduce(
          //   (acc, realEstate) => {
          //     if (realEstate.id && realEstate.name) {
          //       acc[realEstate.id] = realEstate.name;
          //     } else {
          //       console.error("Invalid realEstate data:", realEstate);
          //     }
          //     return acc;
          //   },
          //   {}
          // );
          // setRealEstates(estateData);
        } else {
          console.error("Invalid response data format:", response.data);
          setError("Invalid response data format. Please try again later.");
        }
      })
      .catch((error) => {
        console.error("Error fetching realEstates:", error);
        setError("Error fetching realEstates. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);
  function getReload () {
    axios
    .get("https://reasapiv2.azurewebsites.net/api/RealEstate", {
      headers: { Authorization: `Bearer ${token}` },
      params:{'PageSize' : 100 , 'PageIndex': 1 }
    })
    .then((response) => {
      if (response.data && Array.isArray(response.data.data.pagingData)) {
       setDataList(response.data.data.pagingData);
        // const estateData = response.data.data.pagingData.reduce(
        //   (acc, realEstate) => {
        //     if (realEstate.id && realEstate.name) {
        //       acc[realEstate.id] = realEstate.name;
        //     } else {
        //       console.error("Invalid realEstate data:", realEstate);
        //     }
        //     return acc;
        //   },
        //   {}
        // );
        // setRealEstates(estateData);
      } else {
        console.error("Invalid response data format:", response.data);
        setError("Invalid response data format. Please try again later.");
      }
    })
    .catch((error) => {
      console.error("Error fetching realEstates:", error);
      setError("Error fetching realEstates. Please try again later.");
    })
    .finally(() => setLoading(false));
  }
    
  
  // const handleEstateChange = (event) => {
  //   setRealEstateId(event.target.value);
  // };

  const handleSubmit = (realEstateId) => {
    // event.preventDefault();
    setLoading(true);
    const formData = {
      isApproved: true
    };
    axios
    ({
      method: "put",
      url: `https://reasapiv2.azurewebsites.net/api/RealEstate/${realEstateId}/approve`,
      data: formData,
      headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
    })
      .then((response) => {
        window.location.reload();
         return  Swal.fire({
          position: "center",
          icon: "success",
          title: "Thay đổi trạng thái thành công",
          showConfirmButton: false,
          timer: 1500
        });
        
      })
      .catch((error) => {
        return  Swal.fire({
          position: 'center',
          icon: 'error',
          title: `${error.response.data.message}`,
          showConfirmButton: false,
          timer: 1500
        });
        // return MySwal.fire(error.response.data.message)
        // setError(error.response.data.message || "An error occurred");
        // setErrorDialogOpen(true);
      
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const handleSuccessDialogClose = () => {
  //   setSuccessDialogOpen(false);
  //   // Reset form fields after successful submission if needed
  //   setRealEstateId("");   
  // };

  // const handleErrorDialogClose = () => {
  //   setErrorDialogOpen(false);
  // };
  console.log(`real data:${dataList.length} `)
  return (
   
  //  <Box
  //     component="form"
  //     sx={{
  //       display: "flex",
  //       flexDirection: "column",
  //       alignItems: "center",
  //       width: "65%",
  //       height: "100%",
  //       margin: "auto",
  //       padding: "20px",
  //       border: "1px solid #ccc",
  //       borderRadius: "4px",
  //       [theme.breakpoints.down("md")]: {
  //         width: "100%",
  //       },
  //     }}
  //     onSubmit={handleSubmit}
  //   >
      
  //     <FormControl fullWidth required margin="normal">
  //       <InputLabel>RealEstate</InputLabel>
  //       <Select value={realEstateId} onChange={handleEstateChange}>
  //         {Object.keys(RealEstates).length > 0 ? (
  //           Object.keys(RealEstates).map((realEstateId) => (
  //             <MenuItem key={realEstateId} value={realEstateId}>
  //               {RealEstates[realEstateId]} {/* Displaying estate name */}
  //             </MenuItem>
  //           ))
  //         ) : (
  //           <MenuItem disabled>Loading...</MenuItem>
  //         )}
  //       </Select>
  //     </FormControl>

      
  //     <Button
  //       variant="contained"
  //       color="primary"
  //       fullWidth
  //       type="submit"
  //       sx={{ display: "block", mx: "auto", mt: 4 }}
  //       disabled={loading}
  //     >
  //       {loading ? (
  //         <CircularProgress color="inherit" size={24} />
  //       ) : (
  //         "Approve estate"
  //       )}
  //     </Button>
  //     <Dialog open={successDialogOpen} onClose={handleSuccessDialogClose}>
  //       <DialogTitle>
  //         <TaskAltIcon />
  //       </DialogTitle>
  //       <DialogTitle variant="h3" align="center">
  //         Product Approved Successfully
  //       </DialogTitle>
  //       <DialogContent>
  //         <Typography align="center" variant="subtitle2">
  //           Your product has been successfully approved.
  //         </Typography>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleSuccessDialogClose}>OK</Button>
  //       </DialogActions>
  //     </Dialog>
  //     <Dialog
  //       fullWidth
  //       maxWidth="sm"
  //       open={errorDialogOpen}
  //       onClose={handleErrorDialogClose}
  //     >
  //       <DialogTitle>
  //         <ErrorOutlineOutlinedIcon />
  //       </DialogTitle>
  //       <DialogTitle variant="h3" align="center">
  //         An Error Occurred
  //       </DialogTitle>
  //       <DialogContent>
  //         <Typography variant="subtitle2" align="center">
  //           {error}
  //         </Typography>
  //       </DialogContent>
  //       <DialogActions>
  //         <Button onClick={handleErrorDialogClose}>OK</Button>
  //       </DialogActions>
  //     </Dialog>
  //   </Box>

  <TableContainer component={Paper}>
  <Table  sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell align="left">Tên nhà đất</TableCell>
        <TableCell >Trạng thái</TableCell>
        <TableCell align="right">Hành động </TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {dataList.map((row) => (
        <TableRow
           key={row.id}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          <TableCell component="th" scope="row">
           {row.name}
          </TableCell>
          <TableCell component="th" scope="row">
         
           <Chip label={row.status} color={row.status === 'Pending' ? 'warning' : 'info' } />

          </TableCell>
          <TableCell align="right">
          
          <Button variant="contained" 
          disabled={row.status === 'Pending' ?  false : true}
           onClick={() => handleSubmit(row.id)}  > { `${row.status === 'Pending' ? 'Xác nhận':'Đã xác nhận'}`}   </Button>
          </TableCell>
         
        </TableRow>
      ) 
      )}
    </TableBody>
  </Table>
</TableContainer>
 );
};

export default ApproveProductForm;
