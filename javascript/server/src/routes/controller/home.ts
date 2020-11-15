import { RouteOptions } from '../register';
import code from '@cell-wall/controller';

export const controllerHome: RouteOptions = {
  method: 'GET',
  url: '/controller',
  async handler(_request, reply) {
    const devices = Array.from(this.cells.values());
    reply.type('text/html').send(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.9.1/css/bulma.min.css">
          <link rel="stylesheet" href="/assets/css/base.css" />
          <style>
            body { background: #1b5e20 }
          </style>
          <script>
            window.devices = JSON.parse("${JSON.stringify(devices)}")
          </script>
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
