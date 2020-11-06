import test from 'ava';
import { registerRoutes, RouteOptions } from '../../src/routes/register';

test('registerRoutes', async (t) => {
  const routes: RouteOptions[] = [];
  const app: any = {
    route(httpRoute: RouteOptions) {
      routes.push(httpRoute);
    },
  };

  const noop = () => {};

  registerRoutes(app, [
    {
      method: 'GET',
      url: ['/one', '/two'],
      handler: noop,
    },
    {
      method: 'POST',
      url: 'three',
      handler: noop,
    },
  ]);

  t.deepEqual(routes, [
    {
      method: 'GET',
      url: '/one',
      handler: noop,
    },
    {
      method: 'GET',
      url: '/two',
      handler: noop,
    },
    {
      method: 'POST',
      url: 'three',
      handler: noop,
    },
  ]);
});
