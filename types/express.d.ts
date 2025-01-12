// Extend Express Request interface to include custom properties for user and captain
// Ensure paths to models are accurate based on your project structure
import { CaptainDocument } from "../models/captainModel";
import { UserDocument } from "../models/userModel";

// Declare global namespace augmentation for Express
declare global {
  namespace Express {
    interface Request {
      /**
       * Property for authenticated captain
       * Based on the schema of CaptainModel (CaptainDocument)
       */
      captain?: CaptainDocument;
      captainId?: string
      /**
       * Property for authenticated user
       * Based on the schema of UserModel (UserDocument)
       */
      user?: UserDocument;
      userId?: string
    }
  }
}
