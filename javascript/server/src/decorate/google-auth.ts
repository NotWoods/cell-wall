import { Repository } from '@cell-wall/storage';
import { FastifyInstance } from 'fastify';
import { google } from 'googleapis';
import { googleClientId, googleClientServer } from '../env';

export type OAuth2Client = InstanceType<typeof google.auth.OAuth2>;

export async function googleAuth(
  app: FastifyInstance,
  repo: Repository,
): Promise<OAuth2Client> {
  const oAuth2Client = new google.auth.OAuth2(
    googleClientId,
    googleClientServer,
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
