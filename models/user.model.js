const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
    username: {
        type: String,
        require: true,
    },
    password: {
        type: String,
        require: true,
    }
});

const Utilisateur = mongoose.model('Utilisateur', userSchema);
module.exports = Utilisateur;