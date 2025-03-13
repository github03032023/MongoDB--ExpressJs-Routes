const mongoose = require('mongoose');
const mongoDBUriString = process.env.MONGODB_URI_STRING;
mongoose.connect(mongoDBUriString).
then((response) =>{
    console.log('State-District Database Connected')
}).catch((err)=>{
    console.log('Connection Error : ', err);
})