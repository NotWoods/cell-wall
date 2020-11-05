import { RouteOptions } from 'fastify';

interface TextQuery {
  text?: string;
  backgroundColor?: string;
}

export const pageText: RouteOptions = {
  method: 'GET',
  url: '/page/text',
  async handler(request, reply) {
    const {
      text = 'CellWall',
      backgroundColor = '#429A46',
    } = request.query as TextQuery;
    reply.type('text/html').send(`
      <link rel="stylesheet" href="/assets/css/base.css" />
      <style>
        body {
          display: flex;
          align-items: center;
          color: white;
          background: ${backgroundColor};
        }
      </style>
      <h1 class="headline-1">${text}</h1>
    `);
  },
};
