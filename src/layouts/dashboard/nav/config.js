// component
import AccountCircleTwoToneIcon from '@mui/icons-material/AccountCircleTwoTone';
import { Icon } from '@iconify/react';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const navConfig = [
  {
    title: 'Tổng quan',
    path: '/dashboard/app',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Xem tài sản',
    path: '/viewitem',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Xác nhân tài sản',
    path: '/approve-product',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Tạo đấu giá',
    path: '/createauction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Xác nhận đấu giá',
    path: '/approve-auction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Mở đấu giá',
    path: '/open-auction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Đóng đấu giá',
    path: '/close-auction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },

  {
    title: 'Nhân viên',
    path: '/dashboard/staff',
    icon: icon('ic_staff'),
    role: ['Admin'],
  },

  {
    title: 'Đăng nhập',
    path: '/login',
    icon: icon('ic_lock'),
  },
  {
    title: 'Not found',
    path: '/404',
    icon: icon('ic_disabled'),
  },
];

export default navConfig;
