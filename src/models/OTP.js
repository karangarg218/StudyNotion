const mongoose = require('mongoose');
const {MailSender} = require('../utils/index')
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60
    }
});

async function sendMail(email,otp){
    try{
    const response = await MailSender(email,'Otp verification mail',`your verification otp is ${otp}`);
    console.log(response);

    }catch(error){
        console.log(error);
        throw error;
    }
}
OTPSchema.pre("save",async function(next){
    await sendMail(this.email,this.otp);
    next();
});
module.exports= mongoose.model("OTP",OTPSchema);