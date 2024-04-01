import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './components/scroll-to-top';
import React, { useState, useEffect, Suspense } from 'react';

// ----------------------------------------------------------------------

export default function App() {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);

  // useEffect(() => {
  //   const checkLoginStatus = () => {
  //     // Kiểm tra xem đã lưu token đăng nhập trong local storage chưa
  //     const storedToken = localStorage.getItem('loginUser');
  //     if (storedToken) {
  //       setIsLoggedIn(true);
  //     }
  //   };

  //   // Kiểm tra trạng thái đăng nhập khi component được load
  //   checkLoginStatus();

  //   const handleBeforeUnload = () => {
  //     // Nếu đăng nhập thành công và người dùng đang tắt trang, thì xóa token và đăng xuất
  //     if (isLoggedIn) {
  //       localStorage.removeItem('loginUser');
  //       setIsLoggedIn(false);
  //     }
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, [isLoggedIn]);

  // Hàm xử lý logout
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HelmetProvider>
      <BrowserRouter>
        <ThemeProvider>
          <ScrollToTop />
          
          <Router />
        </ThemeProvider>
      </BrowserRouter>
    </HelmetProvider>
    </Suspense>
  );
}
