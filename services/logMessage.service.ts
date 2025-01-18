import { green, yellow, white } from "colorette";
import dayjs from "dayjs";

// Custom logger function to mimic NestJS-style logs
const logMessage = (message: string, type: string = "LOG") => {
  const timestamp = dayjs().format("MM/DD/YYYY, hh:mm:ss A");
  const pid = process.pid; // Process ID for the application

  // Format specific parts of the message
  const formattedTimestamp = white(timestamp); // Timestamp in white
  const formattedPrefix = green(`[Uber] ${pid}`); // Prefix in green
  const formattedType = type === "LOG" ? green(type) : yellow(type); // Log type dynamically colored

  // Format the message: Highlight "[RouterExplorer]", "[MongoDB]", and "[UberApplication]" in yellow while keeping the rest green
  const formattedMessage = message
    .split(/(\[RouterExplorer\]|\[MongoDB\]|\[UberApplication\])/g) // Split on either "[RouterExplorer]", "[MongoDB]" or "[UberApplication]"
    .map((part) => {
      if (
        part === "[RouterExplorer]" ||
        part === "[MongoDB]" ||
        part === "[UberApplication]"
      ) {
        return yellow(part); // Highlight these parts in yellow
      } else {
        return green(part); // Keep the rest of the message in green
      }
    })
    .join("");

  // Combine all components
  const finalMessage = `${formattedPrefix}  -  ${formattedTimestamp}   ${formattedType} ${formattedMessage}`;

  // Output the log
  console.log(finalMessage);
};

export default logMessage;
