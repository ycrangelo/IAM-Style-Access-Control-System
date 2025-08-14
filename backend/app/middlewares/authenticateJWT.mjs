import jwt from 'jsonwebtoken';
const JWT_SECRET = "your_super_secret_key"; // same as login

export function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing Authorization header" });

  const token = authHeader.split(" ")[1]; // Bearer <token>
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // attach user info to request
    next();
  } catch {
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
