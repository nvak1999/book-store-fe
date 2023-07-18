import React, { useState } from "react";
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
import useAuth from "../../hooks/useAuth";

function UserProfile() {
  const { user } = useAuth();
  const [userData, setUserData] = useState(user);

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
    console.log(userData);
  };

  return (
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
          value={userData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={userData.email}
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
            value={userData.gender}
            onChange={handleChange}
          >
            <MenuItem value="male">Male</MenuItem>
            <MenuItem value="female">Female</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Birthday"
          name="birthday"
          type="date"
          value={userData.birthday}
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
          value={userData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="City"
          name="city"
          value={userData.city}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="State"
          name="state"
          value={userData.state}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Zipcode"
          name="zipcode"
          value={userData.zipcode}
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
  );
}

export default UserProfile;
