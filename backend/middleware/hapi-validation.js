const Joi = require('@hapi/joi');

exports.register = function registerValidation (data) {
const schema = Joi.object({
    email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net','fr'] } }),//l'adresse mail devra finir par un domaine en .fr . com ou .net

    password: Joi.string()
        .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]{8,}$'))//le password devra avoir 8 caractère minimum contenant au moins 1 majuscule, 1 minuscule et un chiffre !

});
return schema.validate(data)
}