import type { Auth, calendar_v3 } from 'googleapis';
import { google } from 'googleapis';
import { Readable, Writable, writable } from 'svelte/store';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from '../../env';
import type { Database } from '../database';

export class GoogleClient {
	private readonly client: Auth.OAuth2Client;
	private readonly authUrl: Writable<string | undefined>;

	/**
	 * Set up Google API client
	 * @param credentials Saved Google credentials, if any
	 */
	private constructor(private readonly db: Database, credentials: Auth.Credentials | undefined) {
		this.client = new google.auth.OAuth2(
			GOOGLE_CLIENT_ID,
			GOOGLE_CLIENT_SECRET,
			'https://cellwall.tigeroakes.com/oauth2callback'
		);

		if (credentials) {
			this.authUrl = writable(undefined);
			this.client.setCredentials(credentials);
		} else {
			// Generate the url that will be used for the consent dialog.
			const authorizeUrl = this.client.generateAuthUrl({
				access_type: 'offline',
				scope: ['https://www.googleapis.com/auth/calendar.readonly']
			});
			this.authUrl = writable(authorizeUrl);
		}
	}

	static async create(dbPromise: Promise<Database> | Database) {
		if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
			throw new Error(`Missing Google API keys`);
		}

		const db = await dbPromise;
		const credentials = await db.getGoogleCredentials();

		return new GoogleClient(db, credentials);
	}

	/**
	 * Returns undefined if the client is authorized
	 */
	get authorizeUrl(): Readable<string | undefined> {
		return this.authUrl;
	}

	/**
	 * Authenticate with Google using an auth code
	 */
	async authenticate(code: string): Promise<Auth.Credentials> {
		const res = await this.client.getToken(code);

		this.authUrl.set(undefined);
		this.client.setCredentials(res.tokens);

		try {
			await this.db.setGoogleCredentials(res.tokens);
		} catch {
			// swallow errors
		}

		return res.tokens;
	}

	/**
	 * Returns free/busy information for a set of calendars.
	 * @param params - Parameters for request
	 */
	async freebusy(params: calendar_v3.Params$Resource$Freebusy$Query) {
		const api = google.calendar({ version: 'v3', auth: this.client });
		return await api.freebusy.query(params);
	}
}
