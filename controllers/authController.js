const bcrypt = require("bcrypt");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

module.exports.connection = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/index.html"));
};

module.exports.private = (req, res) => {
  res.sendFile(path.join(__dirname, "../views/translate/trad.html"));
};

module.exports.signup = async (req, res) => {
  try {
    const { username, password } = req.body;

    //Vérifier si tous les champs sont remplis
    if (!username || !password) {
      return res
        .status(400)
        .json({ error: "Tous les champs sont obligatoires." });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "Le nom d'utilisateur existe déjà." });
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

    res.status(201).send("Utilisateur créé avec succès.");
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Erreur lors de la création de l'utilisateur." });
  }
};

module.exports.login = async (req, res) => {
  //VERIFIER SI L'utillisateur existe
  const existingUser = await User.findOne({ username: req.body.username });
  if (!existingUser) {
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
    return res
      .status(400)
      .json({ error: "Le nom d'utilisateur ou mot de passe incorrecte." });
  }

  //Créer et assigner un token
  const token = jwt.sign({ _id: existingUser._id }, process.env.TOKEN_SECRET);
  res.cookie("auth-token", token, { httpOnly: true, maxAge: 3600000 });
  res.status(200).send("Connexion réussie");
};

module.exports.logout = (req, res) => {
  res.cookie("auth-token", "", { maxAge: 1 });
  res.redirect("/");
};
