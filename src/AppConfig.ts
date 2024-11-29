import express, { Express, Request, Response } from 'express';
import fs from 'fs';
import Logger from './Utils/Logger';
import EmblemRendererApp from 'emblemrenderer';
import EmblemRendererRoute from './Routes/EmblemRenderer';

export default class AppConfig {
  private readonly expressApp: Express;

  private readonly imagePath = process.env.IMAGE_PATH || '../E-bou.fr/Api/img';

  private readonly dataPath = process.env.DATA_PATH || '../DofusUnityData/Data';

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
      const start = performance.now();
      const userAgent = req.get('User-Agent') || 'N/A';
      next();

      res.on('finish', () => {
        Logger.log(`[${req.method} - ${res.statusCode} - ${userAgent}] ${req.originalUrl} executed in ${(performance.now() - start).toFixed(2)}ms`);
      });
    });
  }

  private async setupRoutes(): Promise<void> {
    const renderer = new EmblemRendererApp({ emblemsPath: `${this.imagePath}/unity/UI/emblems/big`, dataPath: this.dataPath, outputPath: `${this.imagePath}/emblems` });
    await renderer.init();

    this.expressApp.use('/img', express.static(this.imagePath));
    this.expressApp.get('/emblem/:emblemType/:symbolIconId/:symbolColor/:backgroundIconId/:backgroundColor', (req: Request, res: Response) => new EmblemRendererRoute(req, res, renderer).execute());
  }
}
