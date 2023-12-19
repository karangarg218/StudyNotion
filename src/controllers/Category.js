const {CategoryModel} = require('../models')
//controller to create the category
const createCategory = async (req,res)=>{
    try{
        const {name,description} = req.body;
        if(!name||!description){
            return res.status(400).json({
                success:false,
                message:`All field are required`
            })
        }
        
        const CategoryDetails=await CategoryModel.create({
            name:name,
            description:description
        });

        console.log(CategoryDetails);

        return res.status(200).json({
            success:true,
            message:`Successfully created the category`
        })

    }catch(err){
        return res.status(500).json({
            success:false,
            message:err.message
        })
    }
}

//get all tag from the database
const showAllCategory = async (req,res)=>{
    try{
        console.log(`inside the show category controller`);
        const allCategory = await CategoryModel.find({});
        res.status(200).json({
            success:true,
            message:`Successfully fetched all category`,
            data:allCategory
        })
    }catch(error){
        console.log(`error in the show all category`);
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message
        })
    }
}
module.exports={
    createCategory,
    showAllCategory
}
