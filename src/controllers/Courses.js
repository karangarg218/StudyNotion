const {CourseModel , TagModel,UserModel} = require('../models')
const {ImageUploader} = require('../utils')

const createCourse = async (req,res) =>{
    try{
        //fetch data
        const { courseName, courseDescription, whatYouWillLearn,price,tag} = req.body;
        //get thumbnail
        const thumbnail = req.files.thumbnailImage;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag){
            return res.status(400).json({
                success:false,
                message:`All field are required`
            })
        }
        //check for the instructor
        const userId =  req.user.id;
        const InstructorDetails = await UserModel.findById(userId);
        if(!InstructorDetails){
            return res.status(404).json({
                success:false,
                message:`Instructor detials not found`
            })
        }

        //check for tag details
        const TagDetails = await TagModel.findById(tag);
        
        if(!TagDetails){
            return res.status(404).json({
                success:false,
                message:`Tags detials not found`
            })
        }
        const thumbnailImage  = await ImageUploader.uploadImage(thumbnail,'CODEHELP');
        const newCourse  = await CourseModel.create({
            courseName,
            courseDescription,
            instructor:InstructorDetails._id,
            price,
            tag:TagDetails._id,
            thumbnail:thumbnailImage.secure_url
        })
        // add this course to the instructor
        await UserModel.findByIdAndUpdate({_id:InstructorDetails._id},{
            $push:{
                courses:newCourse._id
            },
            
        },{
            new:true
        })

        return res.status(200).json({
            success:true,
            message:"Course Created Successfully",
            data:newCourse
        })
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            data:{},
            error:error,
            message:`Failed to create the course`
        })
    }
}

const getAllCourses = async (req,res)=>{
    try{
        const allCourses = await CourseModel.find({})
    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            data:{},
            error:error,
            message:`Cannot fetch the course details`
        })
    }
}

module.exports={
 createCourse   
}