import { RequestHandler } from 'express';
import * as url from 'url';

export const TEST_HOOKS_FILE_NAME = require.resolve('./testHooksForStryker');

export default class TestHooksMiddleware {

  private constructor() {
    this.handler = this.handler.bind(this);
  }

  private static _instance: TestHooksMiddleware;
  static get instance(): TestHooksMiddleware {
    if (!this._instance) {
      this._instance = new TestHooksMiddleware();
    }
    return this._instance;
  }

  public currentTestHooks: string = '';

  handler: RequestHandler = (request, response, next) => {
    const path = url.parse(request.url).pathname;
    if (path && path.endsWith(TEST_HOOKS_FILE_NAME)) {
      response.writeHead(200, {
        'Content-Type': 'application/javascript',
        'Cache-Control': 'no-cache'
      });
      response.end(this.currentTestHooks);
    } else {
      next();
    }
  }
}