const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const { errorHandler } = require("./middlewares/errorHandler");
const { checkPermissions } = require("./middlewares/permissions");
const logger = require("./middlewares/winston");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "views")));
app.use(cookieParser());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

//route get pour afficher la page de connexion/inscription
app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    logger.info("Connected to MongoDB");
    app.listen(3000, () => {
      logger.info("Server is running on port 3000");
    });
  })
  .catch((err) => {
    logger.error("Failed to connect to MongoDB", err);
  });

//routes
app.use("/", authRoutes);
app.use(checkPermissions);
app.use(errorHandler);