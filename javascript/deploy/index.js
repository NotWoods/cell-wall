import server from '@cell-wall/server';

server.options = {
  caseSensitive: false,
  ignoreTrailingSlash: true,
};

export default server;
