const jwt = require('jsonwebtoken');
const Register = require('../models/registrer');

const auth  = async(req, res, next)=>{
    try{
        const token = req.cookies.jwt;
        const verfyUser = jwt.verify(token, process.env.SECRET_KEY);
        console.log(verfyUser);

        const userData = await Register.findOne({_id:verfyUser._id});
        console.log(userData);

        req.token = token;
        req.userData = userData;

        next();
    } catch(error){
        res.status(401).send(error)
    }
}

module.exports = auth;