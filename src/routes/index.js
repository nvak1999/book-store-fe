import * as React from "react";
import { Routes, Route } from "react-router-dom";
import BlankLayout from "../layouts/BlankLayout";
import MainLayout from "../layouts/MainLayout";
import HomePage from "../pages/HomePage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";
import AuthRequire from "./AuthRequire";
import UserProfilePage from "../pages/UserProfilePage";
import SingleBookPage from "../pages/SingleBookPage";
import CartPage from "../pages/CartPage";
import OrderPage from "../pages/OrderPage";
import AdminPage from "../pages/AdminPage";

function Router() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route element={<BlankLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      <Route
        path="/"
        element={
          <AuthRequire>
            <MainLayout />
          </AuthRequire>
        }
      >
        <Route path="user/:userId" element={<UserProfilePage />} />
        <Route path="book/:bookId" element={<SingleBookPage />} />
        <Route path="cart/:userId" element={<CartPage />} />
        <Route path="order/:userId" element={<OrderPage />} />
        <Route path="admin/:userId" element={<AdminPage />} />
      </Route>
    </Routes>
  );
}

export default Router;
