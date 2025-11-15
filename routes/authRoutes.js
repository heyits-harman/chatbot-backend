import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

const router = express.Router();

// REGISTER
router.post('/register', async (req, res) => {
  try{
    const {username, password} = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser){
      return res.status(400).json({error:"Username already exists!"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({username, password: hashedPassword});

    res.status(201).json({message:"User registered successfully", user: newUser});
  }
  catch(err){
    console.error("Registration Error: ", err.message);
    res.status(500),json({error:"Server error during registration"});
  }
});

//LOGIN
router.post('/login', async(req, res) => {
  try{
    const {username, password} = req.body;
    const user = await User.findOne({username});

    if(!user){
      res.status(400).json({error: "User is not registered!"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      res.status(400).json({error: "Invalid password!"});
    }

    const token = jwt.sign({userId: user._id}, process.env.ACCESS_TOKEN, {expiresIn: "1d"});
    res.json({message: 'Login Succesfully', token});
  }
  catch(err){
    console.error("Login Error: ", err.message);
    res.status(500).json({error: "Server error during login"});
  }
});

export default router;
