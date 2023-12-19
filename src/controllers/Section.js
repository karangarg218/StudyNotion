const { SectionModel } = require("../models/index");
const { CourseModel } = require("../models/index");

const createSection = async (req, res) => {
  try {
    //fetching the data
    const { sectionName, courseId } = req.body;
    //create the section
    if (!sectionName || !courseId) {
      res.status(400).json({
        success: false,
        message: `missing properties`,
      });
    }
    //create section
    const newSection = await SectionModel.create({ sectionName });
    //update course with section object Id;
    const updatedCourse = await CourseModel.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    ).populate({
        path:"courseContent",
        populate:{
            path:"subSection"
        }
    }).exec()
    ;
    return res.status(200).json({
        success:true,
        message:`section created succeffuly`,
        data:updatedCourse
    })


  } catch (error) {
    res.status(500).json({
        success: false,
        message: "Internal server error",
        error: error.message,
    });
  }
};

/******to update the section**********/
const updatedSection = async (req,res)=>{
    try{
        const {sectionName,sectionId}= req.body;
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success:false,
                message:`missing properties`
            })
        }
        const section = await SectionModel.findByIdAndUpdate(sectionId,{
            sectionName
        },{new:true});

        return res.status(200).json({
            success:true,
            message:`section updated successfully`
        })

    }catch(error){
        res.status(500).json({
            error:error,
            data:{},
            messsage:`try again something went wrong while updating`
        });
    }
}

const deleteSection = async (req,res)=>{
    try{
    // we assumes that id comes in parameter
    const sectionId = req.params;
    await SectionModel.findByIdAndDelete(sectionId);
    
    return res.status(200).json({
        success:true,
        message:`Section delete successfully`,
        data:{},
        error:{}
    })
    }catch(err){
        res.status(500).json({
            error:error,
            data:{},
            messsage:`try again something went wrong while deleting`
        });
    }
}

module.exports={
    createSection,
    deleteSection,
    updatedSection
}