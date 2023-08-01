import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Logo from "../components/Logo";
import useAuth from "../hooks/useAuth";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { Menu, MenuItem, Typography } from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

function MainHeader() {
  const { user, logout } = useAuth();
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" color="inherit">
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
          {user.role !== "admin" && (
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
                <ShoppingCartOutlinedIcon />
              </IconButton>
            </RouterLink>
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
          {
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
                {user.name.toUpperCase()}
              </Typography>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
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
          }
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MainHeader;
