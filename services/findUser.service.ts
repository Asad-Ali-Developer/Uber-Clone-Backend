import { userModel } from "../models";

const throwError = (message: string) => {
  throw new Error(message);
};

const findUserById = async (id: string) => {
  const user = await userModel.findById(id).select("-password");
  if (!user) throwError("User not found");
  return user;
};

const findUserByEmail = async (email: string) => {
  const user = await userModel.findOne({ email });
  if (!user) throwError("User not found");
  return user;
};

export { findUserById, findUserByEmail };
