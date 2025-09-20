const adminModel = require('./../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

// Generate JWT token
let generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// Register a new admin
const addAdmin = async (req, res) => {
  const { password, email } = req.body;

  try {
    const adminExists = await adminModel.findOne({ email });

    if (adminExists) {
      return res.status(400).json({ error: 'Admin already exists' });
    }

    const admin = new adminModel({
      password,
      email
    });

    console.log(admin);

    await admin.save();

    let responseData = {
      _id: admin._id,
      email: admin.email,
    };

    try {
      responseData.token = generateToken(admin._id);
    } catch (tokenError) {
      console.error('Error generating token:', tokenError);
      // Token generation failed, but admin was still created
    }

    res.status(201).json(responseData);
  } catch (err) {
    console.error('Error adding admin:', err);
    res.status(400).json({ error: err.message });
  }
};

// Login an admin
let loginAdmin = async (req, res) => {
  let { email, password } = req.body;
  console.log({email , password});
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  let user = await adminModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  let isvalid = await bcrypt.compare(password, user.password);
  if (!isvalid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );

  res.status(200).json({token });
};


// Get all admins
let getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get a single admin by ID
let getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update an admin
let updateAdmin = async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    admin.username = username || admin.username;
    admin.email = email || admin.email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash(password, salt);
    }

    await admin.save();
    res.status(200).json(admin);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete an admin
let deleteAdmin = async (req, res) => {
  try {
    const admin = await Admin.findByIdAndDelete(req.params.id);
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json({ message: 'Admin deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
module.exports={getAdmins  , getAdminById , updateAdmin , deleteAdmin , addAdmin , loginAdmin }