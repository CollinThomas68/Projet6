
const jwt = require('jsonwebtoken');

//Code permettant de vérfier la validité du token d'authentification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];//On récupère le token sans tenir compte du mot clé Bearer
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');//On decode le token
    const userId = decodedToken.userId;//On récupère le userId qui y était stocké
    if (req.body.userId && req.body.userId !== userId) {//Si dans la requète il y a un UserId et que ce UserId est différent du UserId qui était stocké dans le token
      throw 'Invalid user ID';// Alors on au ra une erreur
    } else {
      next();//Le UserId de la requète est le même UserId que celui stocké dans le token, donc on autorise la requète
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};