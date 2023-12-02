const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
exports.connect= async () =>{
  try {
    const status = await mongoose.connect(process.env.DBURL);
    console.log(status);
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
}