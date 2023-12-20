const RazorPay = require('razorpay');
const dotenv = require('dotenv');
dotenv.config();
const instance = new RazorPay({
    key_id:process.env.RAZORPAY_KEY,
    key_secret:process.env.RAZORPAY_SECRET
})
module.exports=instance;
