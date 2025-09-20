const userModel = require("../models/users");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const CloudinaryService = require("../services/cloudinaryService");

let showUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      category,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = {};
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { profileName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (role) {
      query.role = role;
    }

    if (category) {
      query.category = category;
    }

    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await userModel.find(query)
      .populate('category', 'name')
      .populate('skills', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await userModel.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({ 
      success: true,
      message: "Users retrieved successfully", 
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalUsers: total,
        usersPerPage: parseInt(limit)
      },
      filters: {
        search,
        role,
        category,
        location,
        sortBy,
        sortOrder
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: err.message
    });
  }
};

const getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    
    if (!role || (role !== 'freelancer' && role !== 'client')) {
      return res.status(400).json({ message: 'Invalid role specified. Use "freelancer" or "client".' });
    }

    const users = await userModel.find({ role: role });

    if(role === 'client'){
      res.json({clients:users});
    }else{
      res.json({freelancers:users});
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};



let getUserByEmail = async (req, res, next) => {
  let { email } = req.body;
  console.log(email);
  try{
  let user = await userModel.findOne({ email: email });

  res.status(200).json({ message: "success", user });
} catch (err) {
  next(err);
}
};

let getUserByID = async (req, res, next) => {
  let { id } = req.params;

  let user = await userModel.findById(id).populate('category').populate('skills').populate('portfolio') .populate({
    path: 'proposals',
    populate: {
      path: 'project',
      populate: {
        path: 'client',
      }
    }
  });

  try {
    if (user) {
      res.status(200).json({ Message: "User found", data: user });
    }
  } catch (err) {
   next(err);
  }
};

let saveUser = async (req, res) => {

  console.log("Asas");
  console.log(req.body);
  try {
    let newUser = req.body;

    const existingUser = await userModel.findOne({ email: newUser.email });

    if (existingUser) {
      return res.status(200).json({ message: "Email already exists" });
    }
    
    
       const user = await userModel.create(newUser);

    res.status(200).json({ message: "user saved successfully" , user});

  } catch (err) {
    console.log(err);
    res.status(404).json({ message: "failed to save user" });
  }
};

let deleteUser = async (req, res) => {
  let { id } = req.params;
  try {
    const user = await userModel.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    if (user.profilePicturePublicId) {
      await CloudinaryService.deleteImage(user.profilePicturePublicId);
    }

    await userModel.findByIdAndDelete(id);

    res.status(200).json({ 
      success: true,
      message: "User deleted successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Error deleting user", 
      error: err.message 
    });
  }
};

let updateUser = async (req, res, next) => {
  try {
    let updates = req.body;
    
    if (updates.profilePicture && updates.profilePicture.startsWith('data:image')) {
      const currentUser = await userModel.findById(req.params.id);
      
      if (currentUser && currentUser.profilePicturePublicId) {
        await CloudinaryService.deleteImage(currentUser.profilePicturePublicId);
      }
      
      const uploadResult = await CloudinaryService.uploadFromBase64(updates.profilePicture, {
        folder: 'mostaqel/users',
        transformation: [
          { width: 300, height: 300, crop: 'fill', gravity: 'face' },
          { quality: 'auto' }
        ]
      });
      
      if (uploadResult.success) {
        updates.profilePicture = uploadResult.url;
        updates.profilePicturePublicId = uploadResult.public_id;
      } else {
        return res.status(400).json({ 
          success: false,
          message: "Failed to upload image", 
          error: uploadResult.error 
        });
      }
    }
    
    if (updates.skills) {
      updates.skills = JSON.parse(updates.skills);
    }

    let user = await userModel.findByIdAndUpdate(req.params.id, updates, { new: true });
    
    res.status(200).json({ 
      success: true,
      message: "User was edited successfully", 
      user: user 
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(400).json({ 
        success: false,
        message: "Validation Error", 
        error: err.message 
      });
    } else {
      res.status(500).json({ 
        success: false,
        message: "Error updating user", 
        error: err.message 
      });
    }
  }
};

let Login = async (req, res) => {
  
  console.log(req.body);
  let { email, password } = req.body;
  console.log(password);
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide email and password" });
  }
  let user = await userModel.findOne({ email: email });
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  let isvalid = await bcrypt.compare(password, user.password);
  console.log(isvalid);
  
  if (!isvalid) {
    return res.status(401).json({ message: "Invalid email or password" });
  }


  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );
console.log(token);
  res.status(200).json({token });
};


let updatePassword = async (req, res) => {
  console.log("ss");
  
  let { currentPassword, password } = req.body;
  if (!currentPassword || !password) {
    return res
      .status(400)
      .json({ message: "Please provide current password and new password" });
  }

  let user = await userModel.findById(req.id);
  console.log(user);

  let isvalid = await bcrypt.compare(currentPassword, user.password);
  if (!isvalid) {
    return res.status(400).json({ message: "incorrect password" });
  }

  user.password = password;
  await user.save();

  res.status(200).json({ message: "Password updated successfully" });

  let token = jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.SECRET
  );

  res.status(200).json({ token: token });
};

const getFreelancers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      skills,
      minRating,
      maxRating,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { role: 'freelancer' };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { profileName: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } }
      ];
    }

 category
    if (category) {
      query.category = category;
    }

 skills
    if (skills) {
      const skillArray = Array.isArray(skills) ? skills : skills.split(',');
      query.skills = { $in: skillArray };
    }

 rating range
    if (minRating || maxRating) {
      query.averageRating = {};
      if (minRating) query.averageRating.$gte = parseFloat(minRating);
      if (maxRating) query.averageRating.$lte = parseFloat(maxRating);
    }

 location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const users = await userModel.find(query)
      .populate('category', 'name')
      .populate('skills', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await userModel.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({ 
      success: true,
      message: "Freelancers retrieved successfully", 
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalFreelancers: total,
        freelancersPerPage: parseInt(limit)
      },
      filters: {
        search,
        category,
        skills,
        minRating,
        maxRating,
        location,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching freelancers', 
      error: error.message 
    });
  }
};


const getClients = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    let query = { role: 'client' };
    
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { profileName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

 location
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const clients = await userModel.find(query)
      .populate('category', 'name')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await userModel.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      message: "Clients retrieved successfully",
      clients,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalClients: total,
        clientsPerPage: parseInt(limit)
      },
      filters: {
        search,
        location,
        sortBy,
        sortOrder
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching clients', 
      error: error.message 
    });
  }
};

module.exports = {
  saveUser,
  showUsers,
  getUserByID,
  deleteUser,
  updateUser,
  Login,
  updatePassword,
  getUserByEmail,
  getUsersByRole,
  getFreelancers,
  getClients
};
