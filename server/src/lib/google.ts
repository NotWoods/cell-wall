import { google } from 'googleapis';
import type { Auth } from 'googleapis';
import type { Repository } from './database';

/** The Google API client ID for your application. */
const googleClientId = process.env['GOOGLE_CLIENT_ID'];

/** The Google API client secret for your application. */
const googleClientServer = process.env['GOOGLE_CLIENT_SECRET'];

export async function initializeGoogle(
	repo: Repository
): Promise<{ authorizeUrl?: string; googleAuth: Auth.OAuth2Client }> {
	const googleAuth = new google.auth.OAuth2(
		googleClientId,
		googleClientServer,
		'https://cellwall.tigeroakes.com/oauth2callback'
	);

	const tokens = await repo.getTokens();
	if (tokens) {
		console.log('Loading Google authentication from storage');
		googleAuth.setCredentials(tokens);
		return { googleAuth };
	}

	// Generate the url that will be used for the consent dialog.
	const authorizeUrl = googleAuth.generateAuthUrl({
		access_type: 'offline',
		scope: ['https://www.googleapis.com/auth/calendar.readonly']
	});

	console.log(`\n---\nAuthenticate with Google:\n${authorizeUrl}\n---\n`);
	return { googleAuth, authorizeUrl };
}

export async function authenticateGoogle(
	googleAuth: Auth.OAuth2Client,
	repo: Repository,
	code: string
): Promise<void> {
	const res = await googleAuth.getToken(code);

	googleAuth.setCredentials(res.tokens);
	await repo.insertTokens(res.tokens);
}
