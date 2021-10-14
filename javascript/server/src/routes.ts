import type { FastifyInstance } from 'fastify';
import actionImageSerial from './routes/api/action/image/[serial]';
import actionImageIndex from './routes/api/action/image/index';
import actionInstall from './routes/api/action/install';
import actionRefresh from './routes/api/action/refresh';
import devicePowerSerial from './routes/api/device/power/[serial]';
import devicePowerIndex from './routes/api/device/power/index';
import deviceStateSerial from './routes/api/device/state/[serial]';
import deviceStateIndex from './routes/api/device/state/index';
import deviceStatePreset from './routes/api/device/state/preset';
import deviceSerial from './routes/api/device/[serial]';
import deviceIndex from './routes/api/device/index';
import freebusy from './routes/api/third_party/freebusy';
import cellwallVersion from './routes/api/cellwall-version';
import oauth2callback from './routes/oauth2callback';

export async function routesSubsystem(fastify: FastifyInstance): Promise<void> {
	fastify
		.register(actionImageSerial)
		.register(actionImageIndex)
		.register(actionInstall)
		.register(actionRefresh)
		.register(devicePowerSerial)
		.register(devicePowerIndex)
		.register(deviceStateSerial)
		.register(deviceStateIndex)
		.register(deviceStatePreset)
		.register(deviceSerial)
		.register(deviceIndex)
		.register(freebusy)
		.register(cellwallVersion)
		.register(oauth2callback);
}
