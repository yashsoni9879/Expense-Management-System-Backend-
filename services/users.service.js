const User = require("../models/user.model.js");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  try {
    console.log("get all users api called");
    const users = await User.find();
    res.json({ message: "users fetched successfully", allusers: users });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "user fetched successfully", user: user });
  } catch (err) {
    res.status(500).send(err);
  }
};
async function checkLogin(formData) {
  try {
    const user = await getByUserName(formData.userName);

    if (!user) {
      return {
        error: true,
        message: "UserName/Password does not match",
      };
    }

    // Check if password is bcrypt hashed or plaintext
    let isMatch = false;
    const storedPassword = user.password || '';
    const isBcryptHash = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$');

    if (isBcryptHash) {
      // Use bcrypt comparison for hashed passwords
      isMatch = await bcrypt.compare(formData.password, storedPassword);
    } else {
      // Direct comparison for plaintext passwords (legacy)
      isMatch = formData.password === storedPassword;
      if (isMatch) {
        // Auto-rehash plaintext password and update DB
        try {
          const hashed = await bcrypt.hash(formData.password, 10);
          await User.findByIdAndUpdate(user._id, { password: hashed });
        } catch (err) {
          console.error('Error rehashing password:', err);
        }
      }
    }

    if (!isMatch) {
      return {
        error: true,
        message: "UserName/Password does not match",
      };
    }

    if (!process.env.JWT_SECRET) {
      return {
        error: true,
        message: "Server configuration error",
      };
    }

    const token = jwt.sign(
      { id: user._id, userName: user.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    return {
      error: false,
      data: token,
      message: "Login successful",
    };
  } catch (err) {
    console.error("Login error:", err);
    return {
      
      error: true,
      message: "Something went wrong",
      errorDetails: err.message
    };
  }
}

async function getByUserName(un) {
  try {
    // mongoose query; return the document or null
    return await User.findOne({ userName: un }).exec();
  } catch (err) {
    console.error("Error fetching user by name", err);
    return null;
  }
}

const insert = async (req, res) => {
  try {
    console.log("insert user api called with data:", req.body);

    const { userName, emailAddress, password, mobileNo, profileImage } =
      req.body;

    // hash password before saving
    const hashed = await bcrypt.hash(password, 10);

    const newuser = await User.create({
      userName,
      emailAddress,
      password: hashed,
      mobileNo,
      profileImage,
    });

    res.json({ message: "user created successfully", user: newuser });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "user updated successfully", user: user });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "user deleted successfully", user: user });
  } catch (err) {
    res.status(500).send(err);
  }
};

const register = async (req, res) => {
  try {
    const { userName, emailAddress, password, mobileNo, profileImage } = req.body;

    if (!userName || !emailAddress || !password) {
      return res.status(400).json({ error: true, message: "userName, emailAddress and password are required" });
    }

    // Check for duplicate userName
    const existingUserName = await User.findOne({ userName }).exec();
    if (existingUserName) {
      return res.status(409).json({ error: true, message: "Username already taken" });
    }

    // Check for duplicate emailAddress
    const existingEmail = await User.findOne({ emailAddress }).exec();
    if (existingEmail) {
      return res.status(409).json({ error: true, message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      emailAddress,
      password: hashed,
      mobileNo,
      profileImage,
    });

    // Auto-login: return a JWT so the user is immediately authenticated
    const token = jwt.sign(
      { id: newUser._id, userName: newUser.userName },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(201).json({
      error: false,
      data: token,
      message: "Registration successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: true, message: err.message || "Registration failed" });
  }
};

module.exports = { getAll, getByID, insert, update, remove, checkLogin, register };
