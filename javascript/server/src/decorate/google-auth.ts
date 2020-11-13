import { FastifyInstance } from 'fastify';
import { readFile } from 'fs/promises';
import { google } from 'googleapis';
import { Repository } from '@cell-wall/storage';

export type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export async function googleAuth(
  app: FastifyInstance,
  repo: Repository,
): Promise<OAuth2Client> {
  const credFile = await readFile(
    process.env.GOOGLE_CREDENTIALS_PATH || 'google-credentials.json',
    'utf8',
  );
  const credentials = JSON.parse(credFile);

  const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    'https://cellwall.tigeroakes.com/oauth2callback',
  );

  const tokens = await repo.getTokens();
  if (tokens) {
    console.log('Loading Google authentication from storage');
    oAuth2Client.setCredentials(tokens);
    return oAuth2Client;
  }

  // Generate the url that will be used for the consent dialog.
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.readonly'],
  });

  app.route<{
    Querystring: { code: string };
  }>({
    method: 'GET',
    url: '/oauth2callback',
    schema: {
      querystring: {
        type: 'object',
        properties: {
          code: { type: 'string' },
        },
        required: ['code'],
      },
    },
    async handler(request, reply) {
      const { code } = request.query;

      reply.send('Authentication successful! Please return to the console.');

      const r = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(r.tokens);
      await repo.insertTokens(r.tokens);
    },
  });

  console.log(`\n---\nAuthenticate with Google:\n${authorizeUrl}\n---\n`);
  return oAuth2Client;
}
