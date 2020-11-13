import { FastifyInstance } from 'fastify';
import { readFile } from 'fs/promises';
import { google } from 'googleapis';

const TOKENS_PATH = async function googleAuth(app: FastifyInstance) {
  const credFile = await readFile(
    process.env.GOOGLE_CREDENTIALS_PATH || 'google-credentials.json',
    'utf8',
  );
  const credentials = JSON.parse(credFile);

  const oAuth2Client = new google.auth.OAuth2(
    credentials.web.client_id,
    credentials.web.client_secret,
    'http://raspberrypi.local:3000/oauth2callback',
  );

  oAuth2Client.on('tokens', (tokens) => {
    if (tokens.refresh_token) {
    }
  });

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
    async handler(request, reply) {
      const { code } = request.query;

      reply.send('Authentication successful! Please return to the console.');

      const r = await oAuth2Client.getToken(code);
      oAuth2Client.setCredentials(r.tokens);
    },
  });

  app.log.info(`Authenticate with Google: ${authorizeUrl}`);
};
