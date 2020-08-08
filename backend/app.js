const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const sauceRoutes= require('./routes/sauce');
const userRoutes = require('./routes/user');

require('dotenv').config()

//Code pour la connexion à la base de données
mongoose.connect('mongodb+srv://'+process.env.DB_USER+':'+process.env.DB_PASS+'@cluster0.miaiw.mongodb.net/'+process.env.DB_NAME+'?retryWrites=true&w=majority',//LectureContenu:OpenclassroomLecture

  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

// Mise en place de la const app
const app = express();
app.use(helmet());
//Mise en place du CORS pour éviter les erreurs en cas de serveurs différents
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  //code permettant de récupérer le contenu de la requète
app.use(bodyParser.json());

//Code pour indiquer l'emplacement de stockage des images
app.use('/images',express.static(path.join(__dirname,'images')));

//Lien vers les routes
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
module.exports = app;
