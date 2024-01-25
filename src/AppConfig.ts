import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import Logger from './Utils/Logger';

export default class AppConfig {
  private readonly expressApp: Express;

  private readonly imagePath = process.env.IMAGE_PATH || 'img';

  constructor(expressApp: Express) {
    this.expressApp = expressApp;
  }

  async setup(): Promise<void> {
    if (!fs.existsSync(this.imagePath)) {
      fs.mkdirSync(this.imagePath);
    }
    this.logRequests();
    await this.setupRoutes();
  }


  private logRequests(): void {
    this.expressApp.use((req: Request, res: Response, next) => {
      const referer = req.get('Referrer') || '-';
      const userAgent = req.get('User-Agent') || 'N/A';
      const statusCode = res.statusCode || 0;
      const httpVersion = req.httpVersion || 'N/A';

      Logger.log(`"${req.method} ${req.path} HTTP/${httpVersion}" ${statusCode} "${referer}" "${userAgent}"`);
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    this.expressApp.use('/img', express.static(this.imagePath));
  }
}
