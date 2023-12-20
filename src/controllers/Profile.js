const {ProfileModel,UserModel} = require('../models/index');

const updateProfile = async (req,res)=>{
    try{
        const {gender,dateOfBirth,about,contactNumber}=req.body;
        //assume that id will be recvieed in the parm
        const userId = req.id;
        //validation
        if(!contactNumber||!about||!dateOfBirth||!gender){
            res.status(400).json({
                message:"All details are mandatory",
                data:{},
                success:false
            })
        }
        //get the object id of profile ref in the user model
        const userDetails = await UserModel.findById(userId);
        const profileId = userDetails.additionalDetails;
        const profile = await ProfileModel.findById(profileId);
       
        profile.gender = gender;
        profile.dateOfBirth = dateOfBirth;
        profile.about = about;
        profile.contactNumber = contactNumber;
       
        //update the user profile;
       
        await profile.save();
        return res.status(200).json({
            success:true,
            message:'Profile updated',
            profile
        });
    }catch(error){
        res.status(500).json({
           error:error,
           data:{},
           message:"Internal error while updating the profile" 
        })
    }
}
//delete account

const deleteAccount = async (req,res)=>{
    try{
        //get the id which you want to delete
        const id=req.id;
        console.log(id);
        const user = UserModel.findById({_id:id});
        if(!user){
            return res.status(404).json({
                success:false,
                message:"User not found"
            })
        }
        await ProfileModel.findByIdAndDelete({_id:user.additionalDetails});
        await UserModel.findByIdAndDelete({_id:id});
        //return response 
        res.status(200).json({
            success:true,
            message:"user deleted successfully",
            data:{},
            error:{}
        })
    }catch(error){
        res.status(500).json({
            error:error,
            data:{},
            message:"Internal error while deleting the profile" 
         })
    }
}
const getAllUserDetails = async (req,res)=>{
    try{
        const id = req.user.id;
        const userDetails = await UserModel.findById({_id:id}).populate("additionalDetails").exec();
        return res.status(200).json({
            success:true,
            data:userDetails,
            error:{}
        })
    }catch(error){
        res.status(500).json({
            error:error,
            data:{},
            message:"Internal error while fetching the userDetails" 
         })
    }
}
module.exports={
    updateProfile,
    deleteAccount,
    getAllUserDetails
}