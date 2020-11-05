import server from '@cell-wall/server';

server.options = {
  caseSensitive: false,
  ignoreTrailingSlash: true,
  trustProxy: true,
};

export default server;
