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
    title: 'Xem danh sách tài sản',
    path: '/viewitem',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Xác nhận tài sản',
    path: '/approve-product',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Xem danh sách đấu giá',
    path: '/viewauction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff', 'Member'],
  },
  {
    title: 'Xác nhận đấu giá',
    path: '/approve-auction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff'],
  },
  {
    title: 'Mở/ Đóng đấu giá',
    path: '/open-auction',
    icon: icon('ic_analytics'),
    role: ['Admin', 'Staff'],
  },
  // {
  //   title: 'Đóng đấu giá',
  //   path: '/close-auction',
  //   icon: icon('ic_analytics'),
  //   role: ['Admin', 'Staff'],
  // },
  // {
  //   title: 'Người dùng',
  //   path: '/dashboard/user',
  //   icon: <AccountCircleTwoToneIcon />,
  //   role: ['Admin', 'Staff'],
  //   items: [
  //     {
  //       title: 'Đang chờ duyệt',
  //       path: '/dashboard/user-waiting',
  //       icon: <AccountCircleTwoToneIcon />,
  //     },
  //     {
  //       title: 'Đang hoạt động',
  //       path: '/dashboard/user',
  //       icon: <AccountCircleTwoToneIcon />,
  //     },
  //     {
  //       title: 'Bị Cấm',
  //       path: '/dashboard/user-ban',
  //       icon: <AccountCircleTwoToneIcon />,
  //     },
  //   ],
  // },
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
