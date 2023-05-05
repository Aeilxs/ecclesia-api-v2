import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

const isEmpty = (obj) => JSON.stringify(obj) === '{}';
const ___ = '===============================================================';
const white = '\x1b[37m';
const cyan = '\x1b[36m';

@Injectable()
export class HttpLoggerMiddleware implements NestMiddleware {
  logger: Logger;
  constructor() {
    this.logger = new Logger('HttpLoggerMiddleware');
  }

  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    const { body, params, query } = req;
    const requestUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

    this.logger.log(cyan + ___);
    this.logger.log(`${cyan}METHOD: ${white}${req.method}`);
    this.logger.log(`${cyan}REQ URL: ${white}${requestUrl}`);

    if (body && !isEmpty(body)) {
      this.logger.log(`${cyan}REQ BODY: ${white}${JSON.stringify(body)}`);
    }

    if (query && !isEmpty(query)) {
      this.logger.log(`${cyan}REQ QUERY: ${white}${JSON.stringify(query)}`);
    }

    if (params && !isEmpty(params)) {
      this.logger.log(`${cyan}REQ PARAMS: ${white}${JSON.stringify(params)}`);
    }

    this.logger.log(cyan + ___ + '\n');

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('Content-Length');
      const responseTime = Date.now() - start;
      this.logger.log(cyan + ___);
      this.logger.log(`${cyan}STATUS: ${white}${statusCode}`);
      this.logger.log(`${cyan}TIME: ${white}${responseTime}ms`);
      this.logger.log(`${cyan}RESPONSE SIZE: ${white}${contentLength} octets`);
      this.logger.log(cyan + ___ + '\n');
    });

    next();
  }
}
