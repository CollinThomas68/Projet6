const mongoose = require ('mongoose');
const uniqueValidator = require('mongoose-unique-validator');//Plugin pour prévenir la réutilisation d'une adresse déjà existante dans la base de données

const userSchema = mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String ,required: true},
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User',userSchema);