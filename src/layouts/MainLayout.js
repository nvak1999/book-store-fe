import { Outlet } from "react-router-dom";
import { Box, Stack } from "@mui/material";
import MainFooter from "./MainFooter";
import AlertMsg from "../components/AlertMsg";
import MainHeader from "./MainHeader";

function MainLayout() {
  return (
    <Stack>
      <MainHeader />
      <AlertMsg />

      <Outlet />

      <Box sx={{ flexGrow: 1 }} />

      <MainFooter />
    </Stack>
  );
}

export default MainLayout;
