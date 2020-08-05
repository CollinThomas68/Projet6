const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const hapivalidation = require('../middleware/hapi-validation');



//Code pour l'inscription d'un nouvel utilisateur
exports.signup = (req,res,next)=>{
  //Code pour la validation de la saisie basée sur le middleware hapi-validation
  const{ error } = hapivalidation.register(req.body)
  console.log(error);
 
  if(error){
    return res.status(400).json({message : 'Problème de saisie ! Merci de renseigner une adresse mail valide ainsi qu\'un mot de passe de 8 caractères minimum contenant au moins une majuscule, une minuscule et un chiffre.'})
  }
    //utilisation de bcrypt pour générer un hash du mot de passe saisi par l'utilisateur
    bcrypt.hash(req.body.password, 10)//On fait 10 cycles
    .then(hash=>{
      const user = new User({//On crée un nouveau User
        email:req.body.email,//On récupère l'email contenu dans la requète
        password:hash//On récupère le hash du mot de passe obtenu grâce à bcrypt
      });
      user.save()//On sauvegarde l'utilisateur dans la base de données
        .then(() => res.status(201).json({message : 'Utilisateur créé !'}))
        .catch(error=> res.status(400).json({ error }));
    })
    .catch(error=> res.status(500).send({ error}));
};

//Code pour la connexion d'un utilisateur existant
exports.login = (req,res,next)=>{
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
          return res.status(401).json({error : 'Utilisateur non trouvé'});//Erreur si l'adresse mail n'existe pas
      }
      bcrypt.compare(req.body.password,user.password)//On compare le hash du password saisi par l'utilisateur et celui stocké dans la base
      .then(valid=>{
          if(!valid){
            return res.status(401).json({error:'Mot de passe incorrect'});//erreur si les hash ne correspondent pas
          }
          res.status(200).json({//Si le password est ok on renvoie l'userId et le token d'authentification 
              userId:user._id,
              token: jwt.sign(
                { userId: user._id },
                'RANDOM_TOKEN_SECRET',
                { expiresIn: '24h' }
              )
          });
      })
      .catch(error=> res.status(500).json({ error}));
    })
    .catch(error=> res.status(500).json({ error}));
};