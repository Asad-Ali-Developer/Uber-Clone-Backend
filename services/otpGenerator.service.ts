const otpGenerator = (length: number): string => {
    if (length <= 0) {
      throw new Error("OTP length must be a positive number");
    }
  
    const otpArray = new Uint8Array(length);
    crypto.getRandomValues(otpArray); // Generate cryptographically secure random values
  
    const otp = Array.from(otpArray, (num) => num % 10).join(""); // Map to digits (0-9) and join into a string
  
    return otp;
  };
  
  export default otpGenerator;
  