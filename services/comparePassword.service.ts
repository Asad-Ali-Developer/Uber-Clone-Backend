import bcrypt from "bcryptjs";

const comparePassword = async (bodyPassword: string, userPassword: string) => {
    const comparedPassword = await bcrypt.compare(bodyPassword, userPassword);
    return comparedPassword;
};

export default comparePassword;
