import { google, Auth } from 'googleapis';
import type { Repository } from './repository';

export interface GoogleClient {
	authorizeUrl?: string;
	googleAuth?: Auth.OAuth2Client;
}

export async function initializeGoogle(
	repo: Pick<Repository, 'getTokens'>,
	googleClientId: string | undefined,
	googleClientServer: string | undefined
): Promise<GoogleClient> {
	if (!googleClientId || !googleClientServer) {
		return {};
	}

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
	repo: Pick<Repository, 'insertTokens'>,
	code: string
): Promise<void> {
	const res = await googleAuth.getToken(code);

	googleAuth.setCredentials(res.tokens);
	await repo.insertTokens(res.tokens);
}
