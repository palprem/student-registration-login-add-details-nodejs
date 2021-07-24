require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
var cookie = require('cookie');
const cookieParser = require('cookie-parser');
const auth = require('./middleware/auth')

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


app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// use json
app.use(express.static(static_path));
app.use(express.urlencoded({extended:false}));
app.use(cookieParser());

// all method
app.get("/",auth, async(req, res)=>{
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

        // create cookie 
        res.cookie("jwt", token,{
            // expires:new Date(Date.now() + 60000),
            httpOnly:true
        })
        res.status(201).render("index");
    }
    catch{
        res.status(400).render("login");
    }
});

//logout
app.get("/logout",auth, async(req, res)=>{
    try {
        console.log(req.userData);
        
        req.userData.tokens = req.userData.tokens.filter((currentElement)=>{
            return currentElement.token !==req.token
        });

        res.clearCookie("jwt");
        console.log("logout sucessfully");

        await req.userData.save();
        res.render("login");
    } catch (error) {
        res.status(500).send(error);
    }
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

    // create cookie 
    res.cookie("jwt", token,{
        // expires:new Date(Date.now() + 30000),
        httpOnly:true
    })

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


app.listen(port, ()=>{
    console.log(`server is running at PORT : ${port}`)
});