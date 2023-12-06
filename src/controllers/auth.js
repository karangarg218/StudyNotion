const {UserModel,OtpModel,ProfileModel} = require('../models/index')
const otpGenerator = require('otp-generator')
const bcrypt = require('bcrypt')
const jsonWebToken = require('jsonwebtoken')
const {serverConfig} = require('../config/index')

const sendOTP = async (req,res)=>{
    //fetching the email from the body
    try{
    const {email} =req.body;
    //check if user already exist
    const checkUserPresent = await UserModel.findOne({email});
    //if it exist
    if(checkUserPresent){
        return res.status(401).json({
            success:true,
            message:'user already registered' ,
            developed_by:`karan garg`
        })
    }

    var otp = otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,   
        specialChars:false
    })
    console.log(`otp generated is ${otp}`);
    const result = OtpModel.findOne({otp:otp});
 
    while(result){
        otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        result = OtpModel.findOne({otp:otp});
    }
 
    const otpPayload = {email,otp};
    const otpBody = await OtpModel.create(otpPayload);
 
    console.log(otpBody);
 
    res.status(200).json({
        success:true,
        message:'otp sent Succesfully',
        otp,
        developed_by:`karan garg`
    });
}catch(error){
    console.log(error);
    return res.status(500).json({
        success:false,
        message:error.message,
        developed_by:`karan garg`
    })
}
};




const signUp = async(req,res)=>{
 try{
    const{
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        accountType,
        contactNumber,
        otp
    }=req.body;
    
    //validating the request
    if(!firstname ||!lastName||!email||!password||!confirmPassword||!otp)
    {   
        return res.status(403).json({
            success:false,
            message:`All fields are required`,
            developed_by:`karan garg`
        })
    }   

    if(password!==confirmPassword){
        return res.status(400).json({
            success:false,
            message:`Password and confirmPassword value doest not matching please try again`

        })
    }

    //check user already exist or not
    const checkForExisting = await UserModel.findOne({email});
    if(checkForExisting){
        return res.status(400).json({
            success:false,
            message:`User is already registered`,
            developed_by:`karan garg`
        })
    }

    const recentOtp = await OtpModel.find({email}).sort({createdAt:-1}).limit(1);
    if(recentOtp.length==0){
        res.status(400).json({
            success:false,
            message:`otp not found`
            ,developed_by:`karan garg`
        })
    }else if(otp!==recentOtp.otp){
        res.status(400).json({
            success:false,
            message:`Entered Otp is incorrect`,
            developed_by:`karan garg`
        });
    }

    // Hash password
    const hashedPassword =await bcrypt.hash(password,10);
    //creating profile
    const profile = await ProfileModel.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null
    })
 
    const user = UserModel.create({
        firstName,
        lastName,
        email,
        password:hashedPassword,
        contactNumber,
        accountType,
        image:`https://api.dicebear.com/7.x/initials/svg?scale=50&&seed=${firstName} ${lastname}&&radius=50`,
        additionalDetails:profile._id
    })

    res.status(200).json({
        success:true,
        message:`user is regsitered successfully`,
        data:user,
        developed_by:`karan garg`
    })
}catch(error){
    res.status(500).json({
        success:false,
        data:{},
        message:`user cannot be created`,
        err:error,
        developed_by:`karan garg`
    })
}

}
const login = async(req,res)=>{
    try{
        const {email,password}= req.body;
        if(!email ||!password){
            return res.status(403).json({
                success:false,
                message:`all fields are mandatory ,please fill all the field`,
                developed_by:`karan garg`
            })                
        }
        const user = await UserModel.findOne({email}).populate("additionalDetails");
        if(!user){
            return res.status(401).json({
                success:false,
                message:`user is not registered please register the user first`
            });

        }
        if(await bcrypt.compare(password,user.password)){
            const tokenPayload ={
                email:user.email,
                id:user._id,
                role:user.role
            }
            const token= jsonWebToken.sign(tokenPayload,serverConfig.JWT_SECRET,{
                expiresIn:'3h'
            })
            user.token = token;
            
        }
    }catch(error){

    }
}