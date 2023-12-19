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



module.exports = {
  createSubSection,
};
