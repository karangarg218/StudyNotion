const { SubSectionModel, SectionModel } = require("../models/index");
const { ImageUploader } = require("../utils/index");
const { serverConfig } = require("../config/index");

const createSubSection = async (req, res) => {
  try {
    const { title, timeDuration, sectionId, description } = req.body;
    const video = req.files.videoFile;

    if (!title || !timeDuration || !sectionId || !description) {
      res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const uploadDetails = await ImageUploader.uploadImage(
      video,
      serverConfig.ImageFolder
    );
    const SubSectionDetails = await SubSectionModel.create({
      title,
      timeDuration,
      description,
      videoUrl: uploadDetails.secure_url,
    });
    const SectionDetails = await SectionModel.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: SubSectionDetails._id,
        },
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Sub section created Succesfuly",
      data: SectionDetails,
    });
  } catch (error) {
    return res.status(500).json({
      error: error,
      success: false,
      message: `internal error while create the subsection details`,
    });
  }
};

//update sub section
exports.updateSubSection = async (req, res) => {
  try {
    const { sectionId, subSectionId, title, description } = req.body
    const subSection = await SubSectionModel.findById(subSectionId)

    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "SubSection not found",
      })
    }

    if (title !== undefined) {
      subSection.title = title
    }

    if (description !== undefined) {
      subSection.description = description
    }
    if (req.files && req.files.video !== undefined) {
      const video = req.files.video
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      )
      subSection.videoUrl = uploadDetails.secure_url
      subSection.timeDuration = `${uploadDetails.duration}`
    }

    await subSection.save()

    // find updated section and return it
    const updatedSection = await SectionModel.findById(sectionId).populate(
      "subSection"
    )

    console.log("updated section", updatedSection)

    return res.json({
      success: true,
      message: "Section updated successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the section",
    })
  }
}


module.exports = {
  createSubSection,
};
