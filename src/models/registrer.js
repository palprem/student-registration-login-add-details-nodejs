const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const empSchema = new mongoose.Schema({
    firstName :{
        type:String,
        require:true
    },
    lastName:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    phone:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    age:{
        type:String,
        require:true
    },
    gender:{
        type:String,
        require:true
    },
    tokens:[{
        token:{
            type:String,
            // require:true
        }
    }]
})

//genrating tokens
empSchema.methods.generateAuthToken = async function(){
    try{
        const token = jwt.sign({_id:this._id.toString()}, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token
    }catch(err){
        res.send("the error part is:", err);
        console.log("the error part is:", err);
    }
}

module.exports  = new mongoose.model("Register", empSchema);