import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Menu, Badge, MenuItem, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../features/user/userSlice";
import { getCart } from "../features/cart/cartSlice";

function MainHeader() {
  let { user: authUser } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);
  let { user, logout, isAuthenticated } = useAuth();
  const [cartItemCount, setCartItemCount] = useState(0);

  const dispatch = useDispatch();

  useEffect(() => {
    if (user._id) {
      dispatch(getCart(user._id));
    } else if (authUser._id) {
      dispatch(getCart(authUser._id));
    }
  }, [dispatch, user, authUser]);

  console.log("asd", cart);

  useEffect(() => {
    if (user._id) {
      dispatch(getUser(user._id));
    }
  }, [dispatch, user]);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = async () => {
    try {
      handleClose();
      await logout(() => {
        navigate("/login");
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (cart) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      setCartItemCount(totalItems);
    }
  }, [cart]);
  if (!user) {
    user = {
      role: "",
      name: "",
    };
  }

  return (
    <Box>
      <AppBar
        sx={{ width: "100%", margin: "0 auto" }}
        position="static"
        color="inherit"
      >
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <Logo />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />

          {(user.role !== "admin") & isAuthenticated ? (
            <RouterLink
              to={`cart/${user._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <Badge badgeContent={cartItemCount} color="primary">
                  <ShoppingCartOutlinedIcon />
                </Badge>
              </IconButton>
            </RouterLink>
          ) : (
            ""
          )}

          {user.role === "admin" && (
            <RouterLink
              to={`admin/${user._id}`}
              style={{ textDecoration: "none", color: "black" }}
            >
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <SupervisorAccountIcon />
              </IconButton>
            </RouterLink>
          )}
          {!isAuthenticated ? (
            <Typography
              component={RouterLink}
              variant="h6"
              to="/login"
              onClick={() => navigate("/login")}
              style={{ textDecoration: "none", color: "black" }}
            >
              LOGIN
            </Typography>
          ) : (
            <div>
              <Typography
                onClick={handleMenu}
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontFamily: "Arial",
                  fontSize: "18px",
                  fontWeight: "bold",
                  "&:hover": {
                    opacity: 0.8,
                    cursor: "pointer",
                  },
                }}
              >
                {authUser.name
                  ? authUser.name.toUpperCase()
                  : user.name.toUpperCase()}
              </Typography>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{ mr: 0 }}
              >
                {user.role !== "admin" && (
                  <MenuItem
                    to={`order/${user._id}`}
                    component={RouterLink}
                    onClick={handleClose}
                  >
                    Order
                  </MenuItem>
                )}
                {user.role !== "admin" && (
                  <MenuItem
                    to={`user/${user._id}`}
                    component={RouterLink}
                    onClick={handleClose}
                  >
                    Profile
                  </MenuItem>
                )}

                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
