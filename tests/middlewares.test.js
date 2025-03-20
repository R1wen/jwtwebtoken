const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const { errorHandler } = require("../middlewares/errorHandler");
const { checkPermissions } = require("../middlewares/permissions");

const app = express();
app.use(cookieParser());

dotenv.config({ path: ".env.test" });
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use(checkPermissions);
app.use(errorHandler);

describe("Middleware", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("GET /translate", () => {
    it("should return 401 if token not found", async () => {
      const response = await request(app).get("/translate");

      expect(response.status).toBe(401);
    });

    it("should allow connection to authentificated user", async () => {
      const token = jwt.sign({ _id: "erwin" }, process.env.TOKEN_SECRET);
      const response = await request(app)
        .get("/translate")
        .set("Cookie", [`auth-token=${token}`]);

      expect(response.status).toBe(200);
    });
  });
});
