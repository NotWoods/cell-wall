import {
  ContextConfigDefault,
  FastifyInstance,
  HTTPMethods,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerDefault,
  RouteShorthandOptionsWithHandler,
} from 'fastify';
import { RouteGenericInterface } from 'fastify/types/route';

export type RawRequestDefault = RawRequestDefaultExpression<RawServerDefault>;
export type RawReplyDefault = RawReplyDefaultExpression<RawServerDefault>;
export type RouteOptions<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface
> = import('fastify').RouteOptions<
  RawServerDefault,
  RawRequestDefault,
  RawReplyDefault,
  RouteGeneric,
  ContextConfigDefault
>;
export interface MultiRouteOptions<
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface
> extends RouteShorthandOptionsWithHandler<
    RawServerDefault,
    RawRequestDefault,
    RawReplyDefault,
    RouteGeneric,
    ContextConfigDefault
  > {
  method: HTTPMethods | HTTPMethods[];
  url: string[];
}

export function registerRoutes(
  app: FastifyInstance,
  routes: Iterable<RouteOptions | MultiRouteOptions>,
) {
  for (const route of routes) {
    if (Array.isArray(route.url)) {
      for (const url of route.url) {
        app.route({ ...route, url });
      }
    } else {
      app.route(route as RouteOptions);
    }
  }
}
