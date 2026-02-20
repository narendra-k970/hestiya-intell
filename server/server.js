const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoute = require("./routes/authRoute");
const irecRoutes = require("./routes/irecRoutes");
const pricingRoute = require("./routes/pricingRoute");
const userRoute = require("./routes/userRoute");

require("./jobs/cronJob");
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(cors());

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
// ------------------------

app.use("/user/auth", authRoute);
app.use("/api/irec", irecRoutes);
app.use("/api/pricing", pricingRoute);
app.use("/api/user", userRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
