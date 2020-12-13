import { RouteOptions } from '../register';
import code from '@cell-wall/remote';

export const controllerHome: RouteOptions = {
  method: 'GET',
  url: '/controller',
  async handler(_request, reply) {
    const devices = Array.from(this.cells.values());
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
          <title>CellWall Remote</title>
          <link
            rel="stylesheet"
            href="https://jenil.github.io/bulmaswatch/darkly/bulmaswatch.min.css" />
          <link rel="stylesheet" href="/assets/css/base.css" />
          <link rel="icon" type="image/png" href="/assets/logo.png" sizes="192x192" />
          <link rel="manifest" href="/assets/manifest.webmanifest" />
          <script>
            window.devices = JSON.parse('${JSON.stringify(devices)}')
          </script>
          <style>
            input[type="color"] {
              padding: 0;
              width: 6rem;
            }
          </style>
          <script async defer src="/controller/script.js"></script>
        </head>
        <body></body>
      </html>
    `);
  },
};

export const controllerScript: RouteOptions = {
  method: 'GET',
  url: '/controller/script.js',
  async handler(_request, reply) {
    reply.type('text/javascript').send(code);
  },
};
