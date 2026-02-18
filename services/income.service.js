const Income = require("../models/income.model.js");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  try {
    console.log("get all income api called");
    const incomes = await Income.find();
    res.json({ message: "income fetched successfully", allincomes: incomes });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const income = await Income.findById(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "income not found" });
    }
    res.json({ message: "income fetched successfully", income: income });
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
    console.log("insert income api called with data:", req.body);

    const { incomeDate, peopleId, amount, userId } = req.body;

    const newincome = await Income.create({
      incomeDate,
      peopleId,
      amount,
      userId,
    });

    res.json({ message: "user created successfully", income: newincome });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const income = await Income.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!income) {
      return res.status(404).json({ message: "income not found" });
    }
    res.json({ message: "income updated successfully", income: income });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const income = await Income.findByIdAndDelete(req.params.id);
    if (!income) {
      return res.status(404).json({ message: "Income not found" });
    }
    res.json({ message: "income deleted successfully", income: income });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  getAll,
  getByID,
  insert,
  update,
  remove,
  checkLogin,
  getByUserName,
};
