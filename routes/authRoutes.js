const { Router } = require("express");
const authController = require("../controllers/authController");
const verify = require("../routes/verifyToken");

const router = Router();

router.get("/connection", (req, res) => authController.connection(req, res));
router.get("/translate", verify, (req, res) =>
  authController.translate(req, res)
);
router.post("/signup", (req, res) => authController.signup(req, res));
router.post("/login", (req, res) => authController.login(req, res));

module.exports = router;
