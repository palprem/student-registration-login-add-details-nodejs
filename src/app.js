require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
var cookie = require('cookie');

//password in/cr ption 
const bcrypt= require('bcryptjs');
const hasPassword=(passowrd)=>{
    var hash = bcrypt.hashSync(passowrd, 10)
    return hash
}

const decriptPass=async function(relPass,hasPass){
    try{
        var relVal = bcrypt.compareSync(relPass, hasPass);
        return relVal;
    }catch(err){
        res.send("the error part is:", err);
        console.log("the error part is:", err);
}
}

//DB connection 
require("./db/conn");

//module
const Register = require('./models/registrer');
// const async = require('hbs/lib/async');
//port
const port  = process.env.PORT || 3000;
//path
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// use json
app.use(express.static(static_path));
app.use(express.urlencoded({extended:false}));
// all method
app.get("/", (req, res)=>{
    res.render("index");
});

app.get("/login", (req, res)=>{
    res.render("login");
});

app.post("/login", async(req, res)=>{
    try{
        const userDetaile= await Register.findOne({ email: req.body.email })
        console.log("<<<<<<<<<<",userDetaile.password)
        const loginBodyPassword  = req.body.password;
        const hashPassword = userDetaile.password;
        // decription of password
        const decri = await decriptPass(loginBodyPassword, hashPassword)
        //genrate token
        const token = await userDetaile.generateAuthToken();
        console.log("token")
        res.status(201).render("index");
    }
    catch{
        res.status(400).render("login");
    }
    // const userDtata= Register.findOne({ email: req.body.email })
    // .then((result)=>{
    //     if(result!=null){
    //         const relPass  = req.body.password;
    //         const hes = result.password;
    //         if(decriptPass(relPass, hes)){
    //             const token =  userEmail.generateAuthToken();
    //             console.log("token:-",token)
    //             res.status(201).render("index");
    //             //TODO: to set cookies
    //         }
    //         else{
    //         res.status(400).render("login");
    //         }
    //     }
    //     else{
    //         res.status(400).render("login");
    //     }
    // }).catch(err=>console.log("error:",err));

});

app.get("/register", (req, res)=>{
    res.render("register");
});
// for creation of database
app.post("/register", async(req, res)=>{
    const passwordHash = hasPassword(req.body.password)
    const data = new Register({
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        email:req.body.email,
        phone:req.body.phone,
        password:passwordHash,
        age:req.body.age,
        gender:req.body.gender,
    })

    const token = await data.generateAuthToken();
    console.log("token:-",token)

    // cookie
    // res.cookie("jwt", token,{
    //     expires:new Date(Date.now() + 30000),
    //     httpOnly:true
    // })
    // console.log(cookie);

    data.save()
    .then((result) => {
        res.status(201).render("index");
        console.log(result)
    }).catch((error)=>{
        res.status(400).send(error);
    });
});

app.get("/logout", (req, res)=>{
    res.render("index");
});

// const jwt = require('jsonwebtoken');
// const createToken = ()=>{
//     const token = jwt.sign({_id:"sdvnsvkjsvkc57s4446464"}, "pregmkdklndfvndfjvndfjndfvnfjvdvsvd");
//     console.log(token);
// }
// createToken()

app.listen(port, ()=>{
    console.log(`server is running at PORT : ${port}`)
});