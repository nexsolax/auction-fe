import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
  Button
} from '@mui/material';
import { Link } from 'react-router-dom';
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import HistoryIcon from '@mui/icons-material/History';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import axios from 'axios';
import NotificationsUserPopover from '../../layouts/dashboard/header/NotificationsUserPopover';
import LogoutFuncion from '../../services/LogoutFunction';
import {
  MyList,
  ActionIconsContainerMobile,
  ActionIconsContainerDesktop,
} from '../../style/appbar';
import { Colors } from '../../style/theme';
import { useUIContext } from '../../context/ui';
import { jwtDecode } from 'jwt-decode';
import { useNavigate} from 'react-router-dom';

export default function Actions({ matches }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const logout = LogoutFuncion();
  const open = Boolean(anchorEl);

  const [profileData, setProfileData] = useState({});
  const user = localStorage.getItem('loginUser');
  const jsonUser = JSON.parse(user);
  const userName = !!jsonUser && !!jsonUser.userName;
  const role = jsonUser?.Role;
  const { cart, setShowCart } = useUIContext();
  const [sessionData, setSessionData] = useState([]);
  const token = localStorage.getItem('token');

  let decoded;
  if (token) {
    decoded = jwtDecode(token);
  }
  const apiProfile = `https://reasapiv2.azurewebsites.net/api/User/${jsonUser?.id}`;
  const apiSession = `https://reasapiv2.azurewebsites.net/api/User?id=${jsonUser?.id}`;

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(apiProfile, {
        headers: { Authorization: `Bearer ${decoded}` },
      });
      setProfileData(response.data);
    } catch (error) {
      console.log('Error fetching profile data:', error);
    }
  };
  const isLoggedIn = !!jsonUser?.unique_name;
  const fetchSessionData = () => {
    axios
      .get(apiSession, { headers: { Authorization: `Bearer ${decoded}` } })
      .then((response) => {
        setSessionData(response.data);
      })
      .catch((error) => {
        console.error('Error fetching session data:', error);
      });
  };

  useEffect(() => {
    fetchProfileData();
    fetchSessionData();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  // const navigate = useNavigate();
  const handleLogoutClick = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const Component = matches
    ? ActionIconsContainerMobile
    : ActionIconsContainerDesktop;

  return (
    <Component>
      <MyList type='row'>
        <Divider orientation='vertical' flexItem />

        {userName ? (
          <>
            <ListItemButton sx={{ justifycontent: 'center' }}>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifycontent: 'center',
                  color: matches && Colors.white,
                }}
              >
                <Badge
                  badgeContent={sessionData && sessionData.length}
                  color='secondary'
                >
                  <ShoppingCartIcon onClick={() => setShowCart(true)} />
                </Badge>
              </ListItemIcon>
            </ListItemButton>
            <Divider orientation='vertical' flexItem />
            <ListItemButton sx={{ justifycontent: 'center' }}>
              <ListItemIcon
                sx={{
                  display: 'flex',
                  justifycontent: 'center',
                  color: matches && Colors.white,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                  }}
                >
                  <NotificationsUserPopover />
                  <Tooltip title='Account settings'>
                    <IconButton
                      onClick={handleClick}
                      size='small'
                      sx={{ ml: 2 }}
                      aria-controls={open ? 'account-menu' : undefined}
                      aria-haspopup='true'
                      aria-expanded={open ? 'true' : undefined}
                    >
                      <Avatar
                        sx={{ width: 40, height: 40 }}
                        src={profileData?.avatar}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  id='account-menu'
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {role === 'Member' ? (
                    <>
                      <MenuItem
                        onClick={handleClose}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Avatar src={profileData.avatar} />
                        <Link
                          to='/profile'
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography sx={{ marginLeft: 1 }}>
                            {jsonUser.unique_name}
                          </Typography>
                        </Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem
                        onClick={handleClose}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Inventory2OutlinedIcon />
                        <Link
                          to='/mysession'
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography sx={{ marginLeft: 1 }}>
                            Phiên đấu giá của tôi
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <HistoryIcon />
                        <Link
                          to='/payment-history'
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography sx={{ marginLeft: 1 }}>
                            Lịch Sử Giao Dịch
                          </Typography>
                        </Link>
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <Settings fontSize='small' />
                        </ListItemIcon>
                        Cài Đặt
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize='small' />
                        </ListItemIcon>
                        Đăng Xuất
                      </MenuItem>
                    </>
                  ) : (
                    <>
                      <MenuItem
                        onClick={handleClose}
                        sx={{ display: 'flex', alignItems: 'center' }}
                      >
                        <Avatar />
                        <Link
                          to='/profile'
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <Typography sx={{ marginLeft: 1 }}>
                            Hồ Sơ Cá Nhân
                          </Typography>
                        </Link>
                      </MenuItem>
                      <Divider />
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <AlternateEmailIcon fontSize='small' />
                        </ListItemIcon>
                        {/* {jsonUser.unique_name} */}
                      </MenuItem>
                      <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                          <Settings fontSize='small' />
                        </ListItemIcon>
                        Cài Đặt
                      </MenuItem>
                      <MenuItem onClick={logout}>
                        <ListItemIcon>
                          <Logout fontSize='small' />
                        </ListItemIcon>
                        Đăng Xuất
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </ListItemIcon>
            </ListItemButton>
          </>
        ) : (
          <Link
            to={isLoggedIn ? '/profile' : '/login'}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <Typography
              variant='button'
              sx={{
                display: 'flex',
                justifyContent: 'center',
                color: matches && Colors.white,
              }}
            >
              {isLoggedIn ? (
                <>
                  <div>{jsonUser.unique_name}</div>
                  <Button variant="contained" onClick={handleLogoutClick}>Đăng Xuất</Button>
                </>
              ) : (
                'Đăng Nhập'
              )}
            </Typography>
          </Link>
        )}
        <Divider orientation='vertical' flexItem />
      </MyList>
    </Component>
  );
}
