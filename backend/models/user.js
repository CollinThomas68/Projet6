const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//Plugin pour prévenir la réutilisation d'une adresse déjà existante dans la base de données

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},//le parametre unique permet de faire la vérif des adresses dans la base
    password: {type: String ,required: true},
});

userSchema.plugin(uniqueValidator);//On appelle la méthode plugin pour vérifier l'adresse mail saisie par l'utilisateur

module.exports = mongoose.model('User',userSchema);