const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const Invitation = require('../models/invitation')

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("Destination folder: imageUploads");
    cb(null, 'imageUploads'); // Specify the destination folder for storing images
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    console.log("Original filename:", file.originalname);
    console.log("Generated filename:", `${uniqueSuffix}-${file.originalname}`);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Generate a unique filename for the uploaded image
  },
});

const upload = multer({ storage }).single('image');

async function handleUpload(req, res) {
  return new Promise((resolve, reject) => {
    upload(req, res, function (err) {
      if (err) {
        console.error("Error uploading image file:", err);
        reject(new Error("Error uploading image file"));
      } else {
        console.log("Image file uploaded successfully");
        console.log("Uploaded file details:", req.file);
        resolve(req.file);
      }
    });
  });
}

module.exports.addImage = async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find user by primary key
    const user = await User.findByPk(user_id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found by id."
      });
    }

    // Handle file upload
    const file = await handleUpload(req, res);
    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File upload failed."
      });
    }

    // Update user with image details
    user.imageType = file.mimetype;
    user.imageName = file.filename;
    user.imageData = file.path; // Store the path of the uploaded image
    await user.save();

    res.status(200).json({
      success: true,
      message: "Image uploaded and user updated successfully.",
      user,
    });
  } catch (error) {
    console.error("Error in addImage:", error);
    res.status(500).json({
      success: false,
      errorMessage: error.message,
    });
  }
};


module.exports.register = async (req, res) => {
  const { token, firstName, lastName, userName, password } = req.body;

  try {
    const invitation = await Invitation.findOne({ where: { token, status: 'pending' } });

    if (!invitation || new Date() > invitation.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired invitation token' });
    }
        const hashedPassword = await bcrypt.hash(password, 10);

    await handleUpload(req, res);
    const imageType = req.file ? req.file.mimetype : null;
    const imageName = req.file ? req.file.originalname : null;
    const imageData = req.file ? req.file.buffer : null;
    
    const user = await User.create({
      firstName,
      lastName,
      userName,
      role: "Employer",
      password: hashedPassword, 
      imageType,
      imageName,
      imageData,
      company_id: invitation.company_id,
    });
    invitation.status = 'accepted';
    await invitation.save();
    res.status(201).json({
      success: true,
      data: user,
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.login = async (req, res) => {
  const { userName, password } = req.body;
  try {
    // Find the user by their userName
    const user = await User.findOne({ where: { userName } });

    if (!user) {
      throw new Error("User not found");
    }
    
    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Incorrect password");
    }

    // Generate JWT token
    const token = jwt.sign({ user_id: user.user_id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    res
      .cookie("token", token, {
        path: "/",
        domain: "localhost",
        httpOnly: true,
        secure: false,
        sameSite: "None",
      })
      .status(200)
      .json({
        success: true,
        message: "Login successful",
        data: { user, token },
      });
  } catch (error) {
    res.status(401).json({
      success: false,
      errorMessage: error.message,
    });
  }
};

module.exports.getUserData = async (req, res) => {
  const { user_id } = req.params;
  // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  try {
    const users = await User.findAll({
      where: {
        user_id: user_id,
      },
    });
    if (users.length == 0) {
      res.status(400).json({
        success: false,
        message: "User Does not exist",
      });
      return;
    }
    res.status(201).json({
      ...users[0].dataValues,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
