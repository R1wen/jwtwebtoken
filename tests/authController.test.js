const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const { errorHandler } = require("../middlewares/errorHandler");
const { checkPermissions } = require("../middlewares/permissions");
const User = require("../models/user.model");

dotenv.config({ path: ".env.test" });

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use(checkPermissions);
app.use(errorHandler);

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mockedToken"),
  verify: jest.fn().mockReturnValue({ _id: "mockedUserId" }),
}));

jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword"),
  compare: jest.fn().mockResolvedValue(true),
}));

// jest.mock("mongoose", () => ({
//   connect: jest.fn().mockResolvedValue("Connexion simulée"),
//   connection: {
//     close: jest.fn().mockResolvedValue("Déconnection simulée"),
//   },
//   Schema: class {},
//   model: jest.fn().mockImplementation((name, schema) => {
//     const Model = function (data) {
//       this.username = data.username;
//       this.password = data.password;
//       this.save = jest.fn().mockResolvedValue(this);
//     };
//     Model.findOne = jest.fn().mockResolvedValue(null);
//     return Model;
//   }),
// }));

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe("POST /signup", () => {
    afterEach(async () => {
      await User.deleteOne({ username: "testuser" });
      await User.deleteOne({ username: "testuser1" });
    });

    it("should create a new user", async () => {
      const response = await request(app).post("/signup").send({
        username: "testuser1",
        password: "testpassword",
      });

      expect(response.status).toBe(201);
    });

    it("should return 400 if username or password is missing", async () => {
      const response = await request(app).post("/signup").send({
        username: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Tous les champs sont obligatoires.");
    });

    it("should return 400 if username already exists", async () => {
      // const User = mongoose.model("User", new mongoose.Schema());
      // User.findOne = jest.fn().mockResolvedValue({ username: "testuser" });
      await request(app).post("/signup").send({
        username: "testuser",
        password: "testpassword",
      });

      const response = await request(app).post("/signup").send({
        username: "testuser",
        password: "testpassword",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Le nom d'utilisateur existe déjà.");
    });
  });

  describe("POST /login", () => {
    it("should connect the user", async () => {
      // const User = mongoose.model("User", new mongoose.Schema());
      // User.findOne.mockResolvedValueOnce({
      //   username: "erwin",
      //   password: "erwin",
      // });

      const response = await request(app).post("/login").send({
        username: "erwin",
        password: "erwin",
      });

      expect(response.status).toBe(200);
    });

    it("should return 400 if username or password incorrect", async () => {
      const response = await request(app).post("/login").send({
        username: "",
        password: "",
      });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe(
        "Le nom d'utilisateur ou mot de passe incorrecte."
      );
    });
  });
});
