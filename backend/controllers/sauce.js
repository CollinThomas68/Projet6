const Sauce = require('../models/sauce');
const fs = require('fs');


//Code pour créer une sauce
exports.createSauce = (req,res,next)=>{
    const sauceObject = JSON.parse(req.body.sauce);//On récupère le corps de la requète
    delete sauceObject._id;
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    console.log(sauce);
    sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error}));
  };

  //Code pour modifier une sauce existante
  exports.modifySauce =(req,res,next)=>{

    if(req.file==undefined){
      const sauceObject = {...req.body};
      Sauce.updateOne({ _id:req.params.id},{...sauceObject, _id:req.params.id})
      .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
      .catch(error => res.status(404).json({ error }));
    }else if(req.file!=undefined){
      Sauce.findOne({ _id:req.params.id})
      .then(sauce=>{
        const filename=sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,()=>{
          const sauceObject =   {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
          };
          Sauce.updateOne({ _id:req.params.id},{...sauceObject, _id:req.params.id})
          .then(() => res.status(200).json({message: 'Sauce modifiée !'}))
          .catch(error => res.status(404).json({ error }));
        });
      })

        .catch(error => res.status(500).json({ error }));
    }
  };

//Code pour supprimer une sauce
exports.deleteSauce = (req,res,next)=>{
    Sauce.findOne({ _id:req.params.id})
      .then(sauce=>{
        const filename=sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`,()=>{
            Sauce.deleteOne({_id:req.params.id})
              .then(() => res.status(200).json({message: 'Sauce supprimée !'}))
              .catch(error => res.status(400).json({ error }));
        });
      })

        .catch(error => res.status(500).json({ error }));
  };

//Code pour afficher une sauce particulière
exports.getOneSauce = (req,res,next)=>{
    Sauce.findOne({ _id:req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };

//Code pour afficher toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error}));
    };


//Code pour la gestion des likes et dislikes
exports.likeDislikeSauce=(req,res,next)=>{
  console.log(req.params);
   console.log(req.body);
  switch(req.body.like){
     //1er cas : utilisateur aime la sauce 
      case  1://la valeur de req.body.like sera de 1
        Sauce.updateOne({_id:req.params.id},{$inc:{likes:1},$push:{usersLiked:req.body.userId}, _id:req.params.id})//On ajoute 1 au champ like de la sauce concernée et on ajoute l'id de l'utilisateur au tableau usersLiked
        .then(() => res.status(200).json({ message: 'Ton avis a été pris en compte !'}))//Si tout va bien on envoie la réponse
        .catch(error => res.status(400).json({ error }));//Sinon on renvoie une erreur
      break;
     //2ème cas : utilisateur n'aime pas la sauce
      case -1://la valeur de req.body.like sera de -1
        Sauce.updateOne({_id:req.params.id},{$inc:{dislikes:1},$push:{usersDisliked:req.body.userId}, _id:req.params.id})//On ajoute 1 à la valeur stockée dans le champ dsilikes de la sauce concernée et on ajoute l'id de l'utilisateur au tableau usersDisliked
        .then(()=>res.status(200).json({message:'Ton avis a bien été pris en compte !'}))//Si tout va bien on envoie la réponse
        .catch(error => res.status(400).json({ error}));//Sinon on renvoie une erreur
      break;
     //3ème cas possible : utilisateur reclique sur son choix pour annuler sa sélection
      case 0://la valeur de req.body.like sera de 0
       Sauce.findOne({_id:req.params.id})
        .then((sauce)=>{
         if(sauce.usersLiked.find((user) => user === req.body.userId)){//On vérifie si le userId de la requète se trouve dans le tableau des usersLiked
           Sauce.updateOne({_id:req.params.id},{$inc:{likes:-1},$pull:{usersLiked:req.body.userId}, _id:req.params.id})//On ajoute -1 à la valeur stockée dans le champ likes de la sauce concernée et on supprime l'id de l'utilisateur dans le tableau usersLiked
           .then(()=>res.status(200).json({message:'Ton avis a bien été pris en compte !'}))//Si tout va bien on envoie la réponse
           .catch(error => res.status(400).json({ error}));//Sinon on renvoie une erreur
         }
         if(sauce.usersDisliked.find((user) => user === req.body.userId)){//On vérifie si le userId de la requète se trouve dans le tableau des usersDisliked
           Sauce.updateOne({_id:req.params.id},{$inc:{dislikes:-1},$pull:{usersDisliked:req.body.userId}, _id:req.params.id})//On ajoute -1 à la valeur stockée dans le champ dislikes de la sauce concernée et on supprime l'id de l'utilisateur dans le tableau usersDisliked
           .then(()=>res.status(200).json({message:'Ton avis a bien été pris en compte !'}))//Si tout va bien on envoie la réponse
           .catch(error => res.status(400).json({ error}));//Sinon on renvoie une erreur
         }
       })
       .catch(error => res.status(400).json({ error }));//Sinon on renvoie une erreur
      break;
     //Message par défaut 
     default:
      console.log(`Il y a un problème avec votre demande !`);

  }
 };