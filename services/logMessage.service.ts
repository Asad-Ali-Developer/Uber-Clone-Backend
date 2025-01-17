import { blue, gray, green, yellow } from "colorette";
import dayjs from "dayjs";

// Custom logger function to mimic NestJS-style logs
const logMessage = (message: string, type: string = "LOG") => {
  const timestamp = dayjs().format("MM/DD/YYYY, hh:mm:ss A");
  const pid = process.pid; // process id for the application
  const formattedMessage = `[Uber] ${pid}  - ${timestamp}   ${type} ${message}`;

  // Color coded output
  if (type === "LOG") {
    console.log(green(formattedMessage)); // Gray for generic logs
  } else if (type === "INFO") {
    console.log(blue(formattedMessage)); // Blue for info messages
  } else if (type === "WARN") {
    console.log(yellow(formattedMessage)); // Yellow for warnings
  } else {
    console.log(green(formattedMessage)); // Green for success
  }
};

export default logMessage;
