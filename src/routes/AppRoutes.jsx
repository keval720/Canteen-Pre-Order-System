import { Route, Routes } from "react-router-dom";
import UserLogin from "../pages/auth/UserLogin";
import AdminLogin from "../pages/auth/AdminLogin";
import ResetPass from "../pages/auth/ResetPass";
import Dashboard from "../pages/admin/Dashboard";
import RoleSelection from "../pages/RoleSelection";
import ManageOrders from "../pages/admin/ManageOrders";
import Report from "../pages/admin/Report";
import Profile from "../pages/admin/Profile";
import ManageMenu from "../pages/admin/ManageMenu";
import AddDish from "../pages/admin/AddDish";
import Home from "../pages/user/Home";
import Menu from "../pages/user/Menu";
import Favourites from "../pages/user/Favourites";
import Feedback from "../pages/admin/Feedback";
import OrderHistory from "../pages/user/OrderHistory";
import EditDish from "../pages/admin/EditDish";
import UserRegister from "../pages/auth/UserRegister";
import ProtectedRoute from "./ProtectedRoute";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Payment from "../pages/user/Payment";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<RoleSelection />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/resetPass" element={<ResetPass />} />
        {/* User */}
        <Route path="/user/register" element={<UserRegister />} />
        <Route element={<ProtectedRoute />}>
        <Route path="/user/home" element={<Home />} />
        <Route path="/user/menu" element={<Menu />} />
        <Route path="/user/favourites" element={<Favourites />} />
        <Route path="/user/cart" element={<Cart />} />
        <Route path="/user/checkout" element={<Checkout />} />
        <Route path="/user/payment" element={<Payment />} />
        <Route path="/user/order-history" element={<OrderHistory />} />
        </Route>
        {/* Admin */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/managemenu" element={<ManageMenu />} />
        <Route path="/admin/manageorders" element={<ManageOrders />} />
        <Route path="/admin/report" element={<Report />} />
        <Route path="/admin/profile" element={<Profile />} />
        <Route path="/admin/managemenu/add-dish" element={<AddDish />} />
        <Route path="/admin/managemenu/edit-dish/:id" element={<EditDish />} />
        <Route path="/admin/report/feedbacks" element={<Feedback />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
