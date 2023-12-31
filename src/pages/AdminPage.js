import * as React from "react";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";
import BookForm from "../features/admin/BookForm";
import ManagerOrder from "../features/admin/ManagerOrder";
// import Books_Import from "../features/admin/Books_Import";
import OrderChart from "../features/admin/OrderChart";
function AdminPage() {
  const [value, setValue] = React.useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", typography: "body1" }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <TabList
            sx={{ ml: 3 }}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab label="Add Book" value="1" />
            <Tab label="Order Manager " value="2" />
            {/* <Tab label="Import Books " value="3" /> */}
            <Tab label="Chart " value="3" />
          </TabList>
        </Box>
        <TabPanel value="1">
          <BookForm book isUpdate={false} />
        </TabPanel>
        <TabPanel value="2">
          <ManagerOrder />
        </TabPanel>
        <TabPanel value="3">
          {/* <Books_Import /> */}
          <OrderChart />
        </TabPanel>
      </TabContext>
    </Box>
  );
}

export default AdminPage;
