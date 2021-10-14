import type { FastifyInstance } from 'fastify';
import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';
import { repo } from '../../../lib/repository';

export default async function (fastify: FastifyInstance): Promise<void> {
	fastify.route<{
		Reply: readonly calendar_v3.Schema$TimePeriod[] | Error;
	}>({
		method: 'GET',
		url: '/api/third_party/freebusy',
		/**
		 * Query the Google Calendar Free/Busy API
		 */
		async handler(request, reply) {
			const { client } = await repo.googleApi();
			const requestBody =
				request.body instanceof URLSearchParams ? Object.fromEntries(request.body) : request.body;

			const api = google.calendar({ version: 'v3', auth: client });

			const res = await api.freebusy.query({
				requestBody: requestBody as calendar_v3.Schema$FreeBusyRequest
			});

			if (res.status < 200 || res.status >= 300) {
				reply.status(res.status).send(new Error(`Could not load calendar, ${res.statusText}`));
				return;
			}

			const { errors = [], busy = [] } = Object.values(res.data.calendars!)[0];
			if (errors.length > 0) {
				reply.status(500).send(new Error(errors.map((error) => error.reason).join()));
				return;
			}

			reply.status(res.status).header('content-type', 'application/json').send(busy);
		}
	});
}
