import EmblemRendererApp from 'emblemrenderer';
import { Request, Response } from 'express';

export default class EmblemRendererRoute {
  private readonly request: Request;

  private readonly response: Response;

  private readonly renderer: EmblemRendererApp;

  constructor(request: Request, response: Response, renderer: EmblemRendererApp) {
    this.request = request;
    this.response = response;
    this.renderer = renderer;
  }

  public async execute(): Promise<void> {
    try {
      if (!this.request.params.emblemType || !this.request.params.symbolIconId || !this.request.params.symbolColor || !this.request.params.backgroundIconId || !this.request.params.backgroundColor) {
        this.response.status(400).send('Bad Request (/emblem/:emblemType/:symbolIconId/:symbolColor/:backgroundIconId/:backgroundColor)');
        return;
      }

      const emblemType = this.request.params.emblemType as 'guild' | 'alliance';
      const symbolIconId = Number(this.request.params.symbolIconId);
      const symbolColor = '#' + this.request.params.symbolColor;
      const backgroundIconId = Number(this.request.params.backgroundIconId);
      const backgroundColor = '#' + this.request.params.backgroundColor;

      console.log({emblemType, symbolIconId, symbolColor, backgroundIconId, backgroundColor});

      if (!emblemType || !symbolIconId || !symbolColor || !backgroundIconId || !backgroundColor) {
        this.response.status(400).send('Bad Request (/emblem/:emblemType/:symbolIconId/:symbolColor/:backgroundIconId/:backgroundColor)');
        return;
      }

      if (['guild', 'alliance'].indexOf(emblemType) === -1) {
        this.response.status(400).send('Bad Request (emblemType must be "guild" or "alliance")');
        return;
      }

      if (isNaN(symbolIconId) || isNaN(backgroundIconId)) {
        this.response.status(400).send('Bad Request (symbolIconId and backgroundIconId must be numbers)');
        return;
      }

      const regex = new RegExp(/^#[0-9A-F]{6}$/i);
      if (!regex.test(symbolColor) || !regex.test(backgroundColor)) {
        this.response.status(400).send('Bad Request (symbolColor and backgroundColor must be valid hex colors, without the #)');
        return;
      }

      const emblem = await this.renderer.renderEmblem({ emblemType, symbolIconId, symbolColor, backgroundIconId, backgroundColor });
      this.response.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': emblem.length });
      this.response.end(emblem);
    } catch (error: any) {
      console.error(error);
      this.response.status(500).send(`Internal Server Error (${error?.message || 'Unknown error'})`);
    }
  }
}