const express = require("express");
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const multer = require("multer");

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);

// Configure Multer Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });


// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find();  
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


router.get("/profile", protect, getUserProfile); 

// PUT user profile + file upload
router.put("/profile", protect, upload.single("profilePic"), updateUserProfile);



module.exports = router;
