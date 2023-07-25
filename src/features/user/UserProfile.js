import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { getUser, updateUser } from "./userSlice";
import { useParams } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import { toast } from "react-toastify";

function UserProfile() {
  let { user, isLoading } = useSelector((state) => state.user);
  const [userData, setUserData] = useState({});

  const dispatch = useDispatch();
  const { userId } = useParams();
  useEffect(() => {
    dispatch(getUser(userId));
  }, [dispatch, userId]);

  useEffect(() => {
    setUserData(user);
    console.log(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "birthday") {
      const formattedDate = new Date(value).toISOString().split("T")[0];
      setUserData((prevData) => ({
        ...prevData,
        [name]: formattedDate,
      }));
    } else {
      setUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const requiredFields = [
      "name",
      "email",
      "address",
      "city",
      "state",
      "zipcode",
    ];
    const missingFields = requiredFields.filter((field) => !userData[field]);

    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields.");
      return;
    }

    dispatch(updateUser(userData, userId));
  };

  return (
    <div>
      {isLoading ? (
        <LoadingScreen />
      ) : (
        <div>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              maxWidth: 500,
              margin: "0 auto",
              padding: "20px",
            }}
          >
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 4, textAlign: "center" }}
            >
              User Profile
            </Typography>
            <form onSubmit={handleSubmit} style={{ width: "100%" }}>
              <TextField
                label="Name"
                name="name"
                value={userData.name || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                name="email"
                value={userData.email || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender-select"
                  name="gender"
                  value={userData.gender || ""}
                  onChange={handleChange}
                >
                  <MenuItem value="male">male</MenuItem>
                  <MenuItem value="female">female</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Birthday"
                name="birthday"
                type="date"
                value={userData.birthday || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                label="Address"
                name="address"
                value={userData.address || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="City"
                name="city"
                value={userData.city || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="State"
                name="state"
                value={userData.state || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Zipcode"
                name="zipcode"
                value={userData.zipcode || ""}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <Box
                sx={{
                  m: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  style={{ alignSelf: "center", width: 150 }}
                >
                  Save
                </Button>
              </Box>
            </form>
          </Box>
        </div>
      )}
    </div>
  );
}

export default UserProfile;
