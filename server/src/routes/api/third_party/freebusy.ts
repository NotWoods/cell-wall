import type { RequestHandler } from '@sveltejs/kit';
import type { calendar_v3 } from 'googleapis';
import { google } from 'googleapis';
import { bodyAsJson } from '$lib/body';
import { repo } from '$lib/repository';

/**
 * Query the Google Calendar Free/Busy API
 */
export const post: RequestHandler = async function post(input) {
	const { client } = await repo.googleApi();
	const requestBody = bodyAsJson(input);

	if (!requestBody) {
		return {
			status: 400,
			error: `Request body should be JSON`
		};
	}

	const api = google.calendar({ version: 'v3', auth: client });

	const res = await api.freebusy.query({
		requestBody: requestBody as calendar_v3.Schema$FreeBusyRequest
	});

	if (res.status < 200 || res.status >= 300) {
		return {
			status: res.status,
			error: new Error(`Could not load calendar, ${res.statusText}`)
		};
	}

	const { errors, busy } = Object.values(res.data.calendars!)[0];
	if (errors && errors.length > 0) {
		return {
			status: 500,
			error: new Error(errors.map((error) => error.reason).join())
		};
	}

	return {
		status: res.status,
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(busy)
	};
};
