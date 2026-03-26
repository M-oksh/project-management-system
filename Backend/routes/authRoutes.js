const express = require("express");
const router = express.Router();

const User = require("../models/user");

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.json({
                message: "User already exists"
            });
        }

        const newUser = new User({
            name,
            email,
            password
        });

        await newUser.save();

        res.json({
            message: "User registered successfully"
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.json({
                message: "User not found"
            });
        }

        if (user.password !== password) {
            return res.json({
                message: "Invalid password"
            });
        }

        res.json({
            message: "Login successful",
            user
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            message: "Server error"
        });

    }

});

router.post("/find-user", async (req, res) => {

  try {

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    res.json({ user });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }

});

module.exports = router;