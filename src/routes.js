import { Navigate, useRoutes, Route } from "react-router-dom";
import { Suspense } from "react";
// layouts
import DashboardLayout from "./layouts/dashboard";
import SimpleLayout from "./layouts/simple";
//
import UserPage from "./pages/UserPage";
import LoginPage from "./pages/LoginPage";
import Page404 from "./pages/Page404";
import ProductsPage from "./pages/ProductsPage";
import DashboardAppPage from "./pages/DashboardAppPage";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import AddProduct from "./pages/AddProduct";
import AuctionPage from "./pages/AuctionPage";
import Profile from "./pages/Profile";
import PrepareSession from "./pages/PrepareSession";
import InstageSession from "./pages/InstageSession";
// import StaffPage from './pages/StaffPage';
import StaffPage from "./pages/StaffPage";
import { RolesAuthRoute } from "./context/RolesAuthRoute";
import UserWaitingApprove from "./pages/UserWaitingApprove";
import UserBan from "./pages/UserBan";
import UserDetail from "./sections/@dashboard/user/UserDetail";
import UserWaitingDetail from "./sections/@dashboard/user/UserWaitingDetail";
import { StaffCreateNew } from "./sections/staff";
import Test from "./pages/test";
import StaffProfile from "./sections/staff/StaffProfile";
import AddAuction from "./pages/AddAuction";
import ApproveProduct from "./pages/ApproveProduct";
import ApproveAuction from "./pages/ApproveAuction";
import AutionDetail from "./pages/dev/AutionDetail";
import OpenAuction from "./pages/OpenAuction";
import CloseAuction from "./pages/CloseAuction";
import ViewEstate from "./pages/ViewEstate";
import ViewAuction from "./pages/ViewAuctionOwn";

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    // { path: 'home', element: (
    //   // <Suspense>
    //   //   <RolesAuthRoute roles={['Admin', 'Staff', 'Member']}>
    //   //     <HomePage />
    //   //   </RolesAuthRoute>
    //   // </Suspense>
    // ), },
    {
      path: "auction/:sessionId",
      element: (
        <Suspense>
          <RolesAuthRoute roles={["Admin", "Staff", "Member"]}>
            <AuctionPage />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    { path: "signup", element: <SignUp /> },
    { path: "additem", element: <AddProduct /> },
    {
      path: "viewitem",
      element: (
        <Suspense>
          <RolesAuthRoute roles={["Member"]}>
            <ViewEstate />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    {
      path: "viewauction",
      element: (
        <Suspense>
          <RolesAuthRoute roles={["Member"]}>
            <ViewAuction />
          </RolesAuthRoute>
        </Suspense>
      ),
    },

    //  (
    //   <Suspense>
    //     <RolesAuthRoute roles={['User']}>
    //       <AddProduct />
    //     </RolesAuthRoute>
    //   </Suspense>
    // ), },
    {
      path: "profile",
      element: (
        <Suspense>
          {/* <Profile /> */}
          <RolesAuthRoute roles={["Member", "Staff", "Admin"]}>
            <Profile />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    {
      path: "approve-product",
      element: (
        <Suspense>
          {/* <Profile /> */}
          <RolesAuthRoute roles={["Member", "Staff", "Admin"]}>
            <ApproveProduct />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    {
      path: "approve-auction",
      element: (
        <Suspense>
          {/* <Profile /> */}
          <RolesAuthRoute roles={["Member", "Staff", "Admin"]}>
            <ApproveAuction />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    {
      path: "open-auction",
      element: (
        <Suspense>
          {/* <Profile /> */}
          <RolesAuthRoute roles={["Member", "Staff", "Admin"]}>
            <OpenAuction />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    {
      path: "close-auction",
      element: (
        <Suspense>
          {/* <Profile /> */}
          <RolesAuthRoute roles={["Member", "Staff", "Admin"]}>
            <CloseAuction />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    { path: "home", element: <HomePage /> },
    { path: "prepare", element: <PrepareSession /> },
    { path: "instage", element: <InstageSession /> },
    // {
    //   path: 'instage',
    //   element: (
    //     <Suspense>
    //       {/* <InstageSession /> */}
    //       <RolesAuthRoute roles={['Member']}>
    //         <InstageSession />
    //       </RolesAuthRoute>
    //     </Suspense>
    //   ),
    // },

    { path: "test", element: <Test /> },
    {
      path: "createauction",
      element: (
        <Suspense>
          <RolesAuthRoute roles={["Admin", "Staff", "Member"]}>
            <AddAuction />
          </RolesAuthRoute>
        </Suspense>
      ),
    },
    { path: "test", element: <Test /> },
    {
      path: "aution-detail/:autionId",
      element: (
        <Suspense>
          {/* <RolesAuthRoute roles={['Admin', 'Staff', 'Member']}> */}
          <AutionDetail />
          {/* </RolesAuthRoute> */}
        </Suspense>
      ),
    },
    // { path: 'aution-detail/:autionId', element: <AutionDetail /> },

    {
      path: "/dashboard",
      element: (
        <Suspense>
          {/* <DashboardLayout /> */}
          {/* <RolesAuthRoute roles={['Admin', 'Staff', 'Member']}> */}
          <DashboardLayout />
          {/* </RolesAuthRoute> */}
        </Suspense>
      ),
      children: [
        { element: <Navigate to="/dashboard/app" />, index: true },

        { path: "app", element: <DashboardAppPage /> },
        {
          path: "user",
          element: <UserPage />,
        },
        { path: "user-waiting", element: <UserWaitingApprove /> },
        { path: "user-ban", element: <UserBan /> },
        { path: "user-detail/:userId", element: <UserDetail /> },
        { path: "user-waiting-detail/:userId", element: <UserWaitingDetail /> },
        { path: "staff-profile", element: <StaffProfile /> },
        { path: "products", element: <ProductsPage /> },
        {
          path: "staff",
          element: (
            <Suspense>
              <RolesAuthRoute roles={["Admin"]}>
                <StaffPage />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
        {
          path: "staff-create",
          element: (
            <Suspense>
              <RolesAuthRoute roles={["Admin"]}>
                <StaffCreateNew />
              </RolesAuthRoute>
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      element: <SimpleLayout />,
      children: [
        { element: <Navigate to="/home" />, index: true },
        { path: "404", element: <Page404 /> },
        { path: "*", element: <Navigate to="/404" /> },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}

// const withAuth = (Component) => {
//   const AuthenticatedComponent = (props) => {
//     const token = localStorage.getItem('token');

//     if (!token) {
//       // Redirect to login page if token is not present
//       return <Navigate to="/login" />;
//     }

//     try {
//       // Verify the token's validity
//       jwt.verify(token, 'secret_key');
//       // Render the protected component if the token is valid
//       return <Component {...props} />;
//     } catch (error) {
//       // Redirect to login page if token is invalid or expired
//       return <Navigate to="/login" />;
//     }
//   };

//   return AuthenticatedComponent;
// };

// const ProtectedRoute = withAuth(({ component: Component, ...rest }) => {
//   return <Route {...rest} render={(props) => <Component {...props} />} />;
// });
