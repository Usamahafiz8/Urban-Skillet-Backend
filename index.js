const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("dotenv").config();
require("./db/connect");
const swaggerUi = require("swagger-ui-express");
const specs = require("./swaggerConfig");

const app = express();
const port = process.env.PORT || 4000;
const locationsRoutes = require("./routes/locationRoutes");
const catalogRoutes = require("./routes/catalogRoutes");
const itemsRoutes = require("./routes/itemRoutes");
const ordresRoutes = require("./routes/orderRoutes");
const customerRoute = require("./routes/customerRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");

// Middleware to parse JSON bodies
app.use(express.json());

// Use routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/locations", locationsRoutes);
app.use("/catalog", catalogRoutes);
app.use("/items", itemsRoutes);
app.use("/orders", ordresRoutes);
app.use("/customers", customerRoute);
app.use("/forgotpassword", forgotPasswordRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
