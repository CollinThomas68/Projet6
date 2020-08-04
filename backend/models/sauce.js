const mongoose = require ('mongoose');

//Définition du schéma modèle pour la création de sauce
const sauceSchema = mongoose.Schema({
    userId: {type:String, required: true},
    name: {type: String, required: true},
    manufacturer: {type: String, required: true},
    description: {type: String, required: true},
    mainPepper: {type: String, required:true},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type:Number, required: true, default:0},//valeur par défaut à 0
    dislikes: {type:Number, required: true, default:0},//valeur par défaut à 0
    usersLiked:{type:[String], required: false},
    usersDisliked: {type:[String], required: false},
});

module.exports = mongoose.model('Sauce',sauceSchema);