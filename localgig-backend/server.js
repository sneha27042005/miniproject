const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const gigRoutes = require("./routes/gigRoutes");
const applicationRoutes = require("./routes/applications");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/admin");

const db = require("./config/db");

const app = express();




app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LocalGig Backend Running");
});

app.use("/api/users", userRoutes);

app.use("/api/gigs", gigRoutes);

app.use("/api/applications", applicationRoutes);

app.use("/api/reviews", reviewRoutes);

app.use("/api/admin", adminRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

