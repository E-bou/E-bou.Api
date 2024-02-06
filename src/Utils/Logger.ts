import fs from 'fs';
import DateManager from './DateManager';

const LOGS_PATH = process.env.LOGS_PATH || 'logs';

export default class Logger {
  static getLogMessage(message: string): string {
    return `[${DateManager.getFullDate()} ${DateManager.getFullHour()}] ${message}`;
  }

  static appendLog(msg: string, path: string, filename: string) {
    try {
      const logMessage = `${this.getLogMessage(msg)}\n`;
      const filepath = `${path}/${filename}`;

      if (!fs.existsSync(path)) {
        fs.mkdirSync(path, { recursive: true });
        fs.writeFileSync(filepath, logMessage);
        return;
      }

      fs.appendFileSync(filepath, logMessage);
    } catch (error) {
      Logger.error('Une erreur est survenue lors de l\'écriture du log', error);
    }
  }

  static writeLog(message: string) {
    const YEAR = DateManager.getYear();
    const MONTH = DateManager.getMonth();
    const DAY = DateManager.getDay();

    this.appendLog(message, `${LOGS_PATH}/${YEAR}/${MONTH}`, `${DAY}.log`);
  }

  static log(message: string): void {
    const logMessage = this.getLogMessage(message);
    console.info(logMessage);
    this.writeLog(message);
  }

  static warn(message: string): void {
    const logMessage = this.getLogMessage(message);
    console.warn(logMessage);
    this.writeLog(message);
  }

  static error(message: string, err: any): void {
    const logMessage = this.getLogMessage(message);
    console.error(logMessage, err);
    this.writeLog(message);
  }
}
