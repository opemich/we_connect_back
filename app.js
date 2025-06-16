const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
dotenv.config();
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
const cors = require("cors");
app.use(cors());
app.use(morgan('dev'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Load environment variables from .env file
// Set the port from environment variables or default to 5000

const port = process.env.PORT || 5000;
// Middleware to handle CORS

// Connect to MongoDB
mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Connected Successfully");
  })
  .catch((err) => {
    console.error("Connecting error:", err);
  });

const authRoutes = require("./routes/auth.route");
const registerRoutes = require("./routes/register.route");
const loginRoutes = require("./routes/login.route");
const userRoutes = require("./routes/user.route");
const dataRoutes = require("./routes/data.route");
const settingsRoutes = require("./routes/setting.route");

// app.use(authRoutes);
// app.use(registerRoutes);
// app.use(loginRoutes);

app.use('/api', authRoutes);
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api/data', dataRoutes);
app.use('/api', settingsRoutes);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
