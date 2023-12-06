const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    firstName:{
        type:String,
        require:true,
        trim:true
    },
    lastName:
    {
        type:String,
        require:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trime:true
    },
    password:{
        type:String,
        required:true 
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        require:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile"
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
           
            ref:"Course"
        }
    ],
    image:{
        type:String,
        required:true,

    },
    courseProgress:[
        {
            type:mongoose.Schema.types.ObjectId,
            ref:"CourseProgress"
        }
    ]
});
module.exports = mongoose.model("User",userSchema);