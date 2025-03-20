const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoutes = require("../routes/authRoutes");
const { errorHandler } = require("../middlewares/errorHandler");
const { checkPermissions } = require("../middlewares/permissions");

dotenv.config({ path: ".env.test" });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", authRoutes);
app.use(checkPermissions);
app.use(errorHandler);

describe("Auth Routes", () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

    describe("POST /signup", () => {
      it("should create a new user", async () => {
        const response = await request(app).post("/signup").send({
          username: "testuser1",
          password: "testpassword",
        });

        expect(response.status).toBe(201);
        expect(response.text).toBe("Utilisateur créé avec succès.");
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
      const response = await request(app).post("/login").send({
        username: "erwin",
        password: "erwin",
      });

      expect(response.status).toBe(200);
      expect(response.text).toBe("Connexion réussie");
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
