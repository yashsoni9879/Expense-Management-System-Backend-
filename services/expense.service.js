const Expense = require("../models/expense.model.js");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getAll = async (req, res) => {
  try {
    console.log("get all expense api called");
    const expense = await Expense.find();
    res.json({ message: "expense fetched successfully", allexpense: expense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const getByID = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense fetched successfully", expense: expense });
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
    console.log("insert expense api called with data:", req.body);

    const { expenseDate, peopleId, amount, userId } = req.body;

    const newexpense = await Expense.create({
      expenseDate,
      peopleId,
      amount,
      userId,
    });

    res.json({ message: "expense created successfully", expense: newexpense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const update = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense updated successfully", expense: expense });
  } catch (err) {
    res.status(500).send(err);
  }
};

const remove = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: "expense not found" });
    }
    res.json({ message: "expense deleted successfully", expense: expense });
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
