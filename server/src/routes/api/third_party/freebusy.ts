import { repo } from '$lib/repository';
import type { RequestHandler } from '@sveltejs/kit';
import { google } from 'googleapis';

/**
 * Query the Google Calendar Free/Busy API
 */
export const post: RequestHandler = async function post({ body }) {
	const { googleAuth } = await repo.googleAuth();

	if (!googleAuth) {
		return {
			status: 503,
			error: `Google Auth not set up`
		};
	} else if (typeof body !== 'string') {
		return {
			status: 400,
			error: `Request body should be JSON`
		};
	}

	const api = google.calendar({ version: 'v3', auth: googleAuth });

	const res = await api.freebusy.query({
		requestBody: JSON.parse(body)
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
