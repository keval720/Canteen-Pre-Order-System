import { AnimatePresence, motion } from "motion/react";
import { Route, Routes, useLocation } from "react-router-dom";

import UserLogin from "../pages/auth/UserLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import UserProfile from "../pages/user/UserProfile";
import ResetPass from "../pages/auth/ResetPass";

import Dashboard from "../pages/admin/Dashboard";
import RoleSelection from "../pages/RoleSelection";
import ManageOrders from "../pages/admin/ManageOrders";
import Report from "../pages/admin/Report";
import Profile from "../pages/admin/Profile";
import ManageMenu from "../pages/admin/ManageMenu";
import AddDish from "../pages/admin/AddDish";
import EditDish from "../pages/admin/EditDish";
import Feedback from "../pages/admin/Feedback";

import Home from "../pages/user/Home";
import Menu from "../pages/user/Menu";
import Favourites from "../pages/user/Favourites";
import OrderHistory from "../pages/user/OrderHistory";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Payment from "../pages/user/Payment";
import OrderSuccess from "../pages/user/OrderSuccess";

import UserRegister from "../pages/auth/UserRegister";

import ProtectedRoute from "./ProtectedRoute";
import FeedbackForm from "../components/user/FeedbackForm";

import AdminRoute from "./AdminRoute";

const AppRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -8,
        }}
        transition={{
          duration: 0.2,
          ease: "easeOut",
        }}
      >
        <Routes location={location}>
          {/* Auth */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/resetPass" element={<ResetPass />} />
          <Route path="/user/register" element={<UserRegister />} />

          {/* User */}
          <Route element={<ProtectedRoute />}>
            <Route path="/user/home" element={<Home />} />
            <Route path="/user/menu" element={<Menu />} />
            <Route path="/user/favourites" element={<Favourites />} />
            <Route path="/user/cart" element={<Cart />} />
            <Route path="/user/userprofile" element={<UserProfile />} />
            <Route path="/user/checkout" element={<Checkout />} />
            <Route path="/user/payment" element={<Payment />} />
            <Route path="/user/order-success" element={<OrderSuccess />} />
            <Route path="/user/order-history" element={<OrderHistory />} />
            <Route
              path="/user/order-history/feedback-form"
              element={<FeedbackForm />}
            />
          </Route>

          {/* Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/managemenu" element={<ManageMenu />} />
            <Route path="/admin/manageorders" element={<ManageOrders />} />
            <Route path="/admin/report" element={<Report />} />
            <Route path="/admin/profile" element={<Profile />} />
            <Route path="/admin/managemenu/add-dish" element={<AddDish />} />
            <Route
              path="/admin/managemenu/edit-dish/:id"
              element={<EditDish />}
            />
            <Route path="/admin/report/feedbacks" element={<Feedback />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default AppRoutes;
