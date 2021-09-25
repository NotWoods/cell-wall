import { google } from 'googleapis';
import type { Auth } from 'googleapis';

export interface GoogleClient {
	authorizeUrl?: string;
	client: Auth.OAuth2Client;
}

/**
 * Set up Google API client
 * @param credentials Saved Google credentials, if any
 * @param googleClientId Google API client ID
 * @param googleClientServer Google API client secret key
 */
export function initializeGoogle(
	credentials: Auth.Credentials | undefined,
	googleClientId: string,
	googleClientServer: string
): GoogleClient {
	const client = new google.auth.OAuth2(
		googleClientId,
		googleClientServer,
		'https://cellwall.tigeroakes.com/oauth2callback'
	);

	if (credentials) {
		console.log('Loading Google authentication from storage');
		client.setCredentials(credentials);
		return { client };
	}

	// Generate the url that will be used for the consent dialog.
	const authorizeUrl = client.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/calendar.readonly']
	});

	return { client, authorizeUrl };
}

export async function authenticateGoogle(
	client: Auth.OAuth2Client,
	code: string
): Promise<Auth.Credentials> {
	const res = await client.getToken(code);

	client.setCredentials(res.tokens);

	return res.tokens;
}
