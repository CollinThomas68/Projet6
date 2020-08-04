const multer = require('multer');
//mise en place du catalogue gérant les extensions de fichier acceptées
const MIME_TYPES= {
    'image/jpg' : 'jpg',
    'image/jpeg' : 'jpg',
    'image/png' : 'png'
};
const storage = multer.diskStorage({
    //code définissant l'emplacement de stockage des images
    destination:(req,file,callback)=>{
        callback(null,'images');
    },
    //code définissant le nom des images provenant de l'utilisateur
    filename: (req,file,callback)=>{
        const name = file.originalname.split(' ').join('_');// code remplaçant les espaces dans le nom original du fichier par _ pour obtenir le nouveau nom temporaire du fichier
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now()+ '.' + extension);//code rendant unique le nom de l'image  : nom temporaire du fichier + un timestamp + l'extension 
    }
});

module.exports = multer({ storage: storage }).single('image');