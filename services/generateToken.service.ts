import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (_id: string, email: string): string => {
  const payload = { id: _id, email: email };
  const secret = process.env.JWT_SECRET!;
  const options = { expiresIn: "1d" };

  return jwt.sign(payload, secret, options);
};

export default generateToken;
