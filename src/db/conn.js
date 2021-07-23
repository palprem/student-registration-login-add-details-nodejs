const mongoose = require('mongoose');
const dbUrl = 'mongodb+srv://palprem:prem@123@cluster0.llozo.mongodb.net/node-tuts?retryWrites=true&w=majority'
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(res=>console.log("DB Connected!"))
.catch(err=>console.log("DB Connection Failed!"))