import { RouteOptions } from '../register.js';

interface TextQuery {
  text?: string;
  backgroundColor?: string;
}

export const pageText: RouteOptions<{
  Querystring: TextQuery;
}> = {
  method: 'GET',
  url: '/page/text',
  async handler(request, reply) {
    const { text = 'CellWall', backgroundColor = '#429A46' } = request.query;
    reply.type('text/html').send(`
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
      <link rel="stylesheet" href="/assets/css/base.css" />
      <style>
        body {
          display: flex;
          background: ${backgroundColor};
        }
        h1 {
          margin: 8px;
        }
      </style>
      <h1 class="headline-1">${text}</h1>
    `);
  },
};
