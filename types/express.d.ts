import { CaptainDocument } from "../models/captainModel"; // Adjust the path as per your project structure
import { UserDocument } from "../models/userModel"; // Adjust the path as per your project structure

declare global {
  namespace Express {
    interface Request {
      captain?: CaptainDocument; // Include captain type based on your Captain schema
      user?: UserDocument; // Include user type based on your User schema
    }
  }
}
