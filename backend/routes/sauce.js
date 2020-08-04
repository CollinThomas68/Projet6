const express = require('express');
const router = express.Router();
//lien vers le controller sauce
const sauceCtrl = require('../controllers/sauce');
//lien vers les middlewares
const auth = require('../middleware/auth');//lien avec le token d'identification
const multer = require('../middleware/multer-config');//gestion des images provenant des utilisateurs


router.post('/', auth, multer, sauceCtrl.createSauce);// auth est placée avant multer pour être certain que la requète est bien liée à un token d'identification
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like',auth,sauceCtrl.likeDislikeSauce);
module.exports = router;