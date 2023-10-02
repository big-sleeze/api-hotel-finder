import chalk from "chalk";
import fs from "fs";

export default class Logging {
  private static logToFile = (fileName: string, args: any) => {
    const formattedArgs =
      typeof args === "string" ? args : JSON.stringify(args);
    fs.appendFileSync(
      fileName,
      `[${new Date().toLocaleString()}] ${formattedArgs}\n`
    );
  };
  public static log = (args: any) => {
    this.info(args);
    this.logToFile("app.log", args);
  };
  public static info = (args: any) =>
    console.log(
      chalk.blue(`[${new Date().toLocaleString()}] [INFO]`),
      typeof args === "string" ? chalk.blueBright(args) : args,
      this.logToFile("app.log", args)
    );
  public static warning = (args: any) =>
    console.log(
      chalk.yellow(`[${new Date().toLocaleString()}] [WARN]`),
      typeof args === "string" ? chalk.yellowBright(args) : args,
      this.logToFile("app.log", args)
    );
  public static error = (args: any) => {
    console.log(
      chalk.red(`[${new Date().toLocaleString()}] [ERROR]`),
      typeof args === "string" ? chalk.redBright(args) : args
    );
    if (args instanceof Error) {
      console.log(chalk.redBright(args.stack));
      this.logToFile("./error.log", args.stack);
    }
    this.logToFile("./error.log", args);
  };
}
