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

    this.expressApp.disable('x-powered-by');
    this.logRequests();
    await this.setupRoutes();
  }

  private logRequests(): void {
    this.expressApp.use((req: Request, res: Response, next) => {
      const referer = req.get('Referrer') || 'N/A';
      const userAgent = req.get('User-Agent') || 'N/A';
      const httpVersion = req.httpVersion || 'N/A';

      res.on('finish', () => {
        const statusCode = res.statusCode || 0;
        const statusMessage = res.statusMessage || 'N/A';
        Logger.log(`"${req.method} ${req.path} HTTP/${httpVersion}" "${statusCode}:${statusMessage}" "${referer}" "${userAgent}"`);
      });
      next();
    });
  }

  private async setupRoutes(): Promise<void> {
    this.expressApp.use('/img', express.static(this.imagePath));
  }
}
