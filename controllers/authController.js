const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const logger = require("../middlewares/winston");

module.exports.connection = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};

module.exports.translate = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/translate/trad.html"));
};

module.exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Vérifier si tous les champs sont remplis
    if (!username || !password) {
      logger.warn("Erreur d'inscription: Champs manquants");
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      logger.warn(`Erreur d'inscription: ${username} existe déjà`);
      return res.status(400).json({ error: "Le nom d'utilisateur existe déjà." });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

    //Créer un nouvel utilisateur
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    // Sauvegarder dans la base de données
    await newUser.save();

    logger.info(`Utilisateur ${username} créer avec succès`);
    res.status(201).json({success: true});
  } catch (error) {
    logger.error("Erreur durant l'inscription", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur." });
  }
};

module.exports.login = async (req, res) => {
  //VERIFIER SI L'utillisateur existe
  const { username, password } = req.body;
  const existingUser = await User.findOne({ username: req.body.username });
  if (!existingUser) {
    logger.warn(`Echec login: Nom d'utilisateur ${username} introuvable`);
    return res
      .status(400)
      .json({ error: "Le nom d'utilisateur ou mot de passe incorrecte." });
  }

  //verifier si le mot de passe est correcte
  const passwordCorrect = await bcrypt.compare(
    req.body.password,
    existingUser.password
  );
  if (!passwordCorrect) {
    logger.warn(
      `Erreur login: Mot de passe incorrecte pour l'utilisateur ${username}`
    );
    return res
      .status(400)
      .json({ error: "Le nom d'utilisateur ou mot de passe incorrecte." });
  }

  //Créer et assigner un token
  const token = jwt.sign({ _id: existingUser._id }, process.env.TOKEN_SECRET);
  res.cookie("auth-token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).json({success: true});
  logger.info(`L'utilisateur ${username} connecté avec succès`);
  
};

module.exports.logout = (req, res) => {
  res.cookie("auth-token", "", { maxAge: 1 });
  res.redirect("/");
};
