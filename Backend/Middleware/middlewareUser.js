import jwt from "jsonwebtoken";

// SECRET = secret key for signing;
export const SECRET = process.env.JWT_SECRET || "jdfhhak";

export function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Missing or invalid authorization header" });
  }
  const token = auth.split(" ")[1];
  try {
    const payload = jwt.verify(token, SECRET);
    req.user = { id: payload.id };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
