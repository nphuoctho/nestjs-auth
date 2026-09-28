import type { SwaggerCustomOptions } from '@nestjs/swagger';
import { swaggerCustomCss } from './swagger-custom.css.js';
import { swaggerDarkModeScript } from './swagger-dark-mode.script.js';

export const swaggerCustomOptions: SwaggerCustomOptions = {
  customSiteTitle: 'NestJS Auth API — Docs',
  customCss: swaggerCustomCss,
  customJsStr: swaggerDarkModeScript,
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
    filter: true,
  },
};
