const {razorPay} = require('../config/index');
const {CourseModel,UserModel} = require('../models/index');
const {MailSender} = require('../utils/index');
const courseEnrollmentEmail = require('../mail/templates');
const mongoose = require('mongoose')
const capturePayment = async (req,res)=>{
    try{
        //get course and courseId
        const {course_id} = req.body;
        const userId = req.user.id;

        //validation
        if(!course_id){
            return res.status(400).json({
                success:false,
                message:"please provide valid course Id"
            });
        };
        //valid courseId
        let course;
            course = await CourseModel.findById(course_id);
            if(!course){
                return res.status(400).json({
                    success:false,
                    message:"could not find the course"
                })
            }
            //user already pay for the course
            const uid = new mongoose.Types.ObjectId(userId);
            //check if this id is already exists in the course
            //
            if(course.studentsEnrolled.includes(uid)){
                return res.status(409).json({
                    message:"student is already enrolled",
                    data:{},
                    success:false
                })
            }

            //creation of order
            const amount = course.price;
            const currency = "INR";

            const options = {
                amount : amount * 100,
                currency,
                receipt : Math.random(Date.now()).toString(),
                notes:{
                    courseId:course_id,
                    userId
                }
            }
            //initilization of the payment
            const paymentResponse = await razorPay.orders.create(options);
            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                amount:paymentResponse.amount,
                currency:paymentResponse.currency,
                orderId:paymentResponse.id
            })

        }catch(error){
            console.log("error in the capture payemnt ");
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message,
                data:{}
            })
            
        }
    
}



module.exports = {
    capturePayment
}



