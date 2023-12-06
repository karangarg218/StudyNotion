const { UserModel } = require("../models/index");
const { MailSender } = require("../utils/index");
const bcrypt = require("bcrypt");
const resetPasswordToken = async (req, res) => {
  try {
    const email = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: `Email is not registered with us`,
      });
    }
    const token = crypto.randomUUID();
    console.log(`genereated token ${token}`);
    const filter = {
      email: email,
    };
    const update = {
      resetToken: token,
      resetTokenExpiration: Date.now() + 10 * 60 * 1000,
    };
    //return a new updated record
    const tempUrl = `http://localhost:3000/update-password/${token}`;
    const updatedInfo = UserModel.findOneAndUpdate(filter, update, {
      new: true,
    });
    MailSender(
      email,
      "Reset link for password",
      `password reset link is ${tempUrl}`
    );
    return res.status(200).json({
      error: {},
      success: true,
      message: `Successfully sent the mail please check your mail`,
    });
  } catch (error) {
    console.log(`something went wrong in resetPassword`);
    return res.status(500).json({
      error: error,
      success: false,
      message: `somethign went wrong in resetPassword`,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, confirmPassword, token } = req.body;
    if (password != confirmPassword) {
      return res.status(400).json({
        message: `ConfirmPassword not equal to password`,
        error: `password doest not matched`,
        success: false,
      });
    }
    const userDetails = await UserModel.findOne({ token: token });

    //check for the token if not found
    if (!userDetails) {
      return res.status(401).json({
        message: `token is invalid`,
        success: false,
      });
    }
    //check for token expiry
    if (userDetails.resetTokenExpiration > Date.now()) {
      return res.json(401).json({
        success: false,
        message: `token is expired please regenerate it`,
      });
    }

    hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.findOneAndUpdate(
      { token: token },
      { password: hashedPassword },
      { new: true }
    );
    return res.status(200).json({
      message: `Successfully updated the password`,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: error,
      success: false,
      message: `somthing went wrong while reseting the password`,
    });
  }
};
