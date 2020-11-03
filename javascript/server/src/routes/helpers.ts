import { DeviceManager, DeviceMap } from '@cell-wall/android-bridge';
import {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  HTTPMethods,
  RawReplyDefaultExpression,
  RawRequestDefaultExpression,
  RawServerBase,
  RawServerDefault,
  RouteHandlerMethod,
  RouteShorthandOptions,
} from 'fastify';
import { RouteGenericInterface, RouteOptions } from 'fastify/types/route';

export interface SerialParams {
  serial?: string;
}

export interface MultiRouteOptions<
  RawServer extends RawServerBase = RawServerDefault,
  RawRequest extends RawRequestDefaultExpression<
    RawServer
  > = RawRequestDefaultExpression<RawServer>,
  RawReply extends RawReplyDefaultExpression<
    RawServer
  > = RawReplyDefaultExpression<RawServer>,
  RouteGeneric extends RouteGenericInterface = RouteGenericInterface,
  ContextConfig = ContextConfigDefault
> extends RouteShorthandOptions<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig
  > {
  method: HTTPMethods | HTTPMethods[];
  url: string[];
  handler: RouteHandlerMethod<
    RawServer,
    RawRequest,
    RawReply,
    RouteGeneric,
    ContextConfig
  >;
}

export const errorSchema = {
  type: 'object',
  properties: {
    error: { type: 'string' },
  },
};

export function filterDevices(
  deviceManager: DeviceManager,
  reply: FastifyReply,
  serial: string | undefined,
): DeviceMap | undefined {
  if (serial) {
    const device = deviceManager.devices.get(serial);
    if (device) {
      return new Map().set(serial, device);
    } else {
      reply.status(404).send({ error: `Could not find device ${serial}` });
      return undefined;
    }
  } else {
    return deviceManager.devices;
  }
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
