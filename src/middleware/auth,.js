const JWT = require("jsonwebtoken");
const { serverConfig } = require("../config/index");
dotenv.config();
const { UserModel } = require("../models/index");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorisation").replace("Bearer", "");
    if (!token) {
      return res.status(401).json({
        success: true,
        message: "token is missing",
        publisher: `Published by karan`,
      });
    }
    try {
      const decode = await JWT.verify(token, serverConfig.JWT_SECRET);
      console.log(decode);
      req.user = decode;
    } catch (error) {
      res.status(401).json({
        success: false,
        message: "token is invalid",
        publisher: `Published by karan`,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "somthign went wrong while valdiation",
      publisher: `Published by karan`,
    });
  }
};

const isStudent = async (req, res, next) => {
  try {
    if(req.user.role!=="Student"){
        res.status(401).json({
            success:false,
            message:`This is protected route for student only`,
            
        })
    }
    next()
  } catch (error) {
    res.status(500).json({
        success:false,
        message:`User not verifed for this route`,
        
    })

    
  }
};


const isAdmin = async (req, res, next) => {
    try {
      if(req.user.role!=="Admin"){
          res.status(401).json({
              success:false,
              message:`This is protected route for Admin only`,
              
          })
      }
      next()
    } catch (error) {
      res.status(500).json({
          success:false,
          message:`User not verifed for this route`,
          
      })
  
      
    }
  };
  
  
const isInstructor = async (req, res, next) => {
    try {
      if(req.user.role!=="Instructor"){
          res.status(401).json({
              success:false,
              message:`This is protected route for Instructor only`,
              
          })
      }
      next()
    } catch (error) {
      res.status(500).json({
          success:false,
          message:`User not verifed for this route`,
          
      })
  
      
    }
  };


  