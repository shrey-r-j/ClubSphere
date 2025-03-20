import jwt from "jsonwebtoken";
const JWT_KEY = "123";

export function auth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    // console.log(authHeader);
    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, JWT_KEY);
    req.rollNo = decode.rollNo;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}

export function auth2(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_KEY);

    req.clubName = decoded.clubName;
    console.log(decoded);
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token" });
  }
}