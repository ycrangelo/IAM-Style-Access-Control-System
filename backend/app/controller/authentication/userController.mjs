import pkg from '../../generated/prisma/index.js';
const { PrismaClient } = pkg;
import bcrypt from 'bcryptjs';
import 'dotenv/config'; 
import jwt from 'jsonwebtoken';


const prisma = new PrismaClient();

export async function register(req,res) {
 const { username, password } = req.body;
 
 if (!username || !password) {
   res.status(500).json({ error: "missing username or password" });
 }
 try {
   // Hash password
   const hashedPassword = await bcrypt.hash(password, 10);
   const newUser = await prisma.user.create({
  data: {
   username,
   passwordHash:hashedPassword
    }
    
   })
  res.status(201).json({ data: newUser });
 } catch (e) {
   res.status(500).json({ error: "error at creating user",details:e });
 }
}

export async function login(req, res) {
  const { username, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!username || !password) {
    return res.status(400).json({ error: "Missing username or password" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed", details: error.message });
  }
}



