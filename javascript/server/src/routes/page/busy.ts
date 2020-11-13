import { google } from 'googleapis';
import { Temporal } from 'proposal-temporal';
import { calendars } from '../../static';
import { RouteOptions } from '../register';

const calendarApi = google.calendar('v3');

interface BusyParams {
  person: keyof typeof calendars;
}

export const pageText: RouteOptions<{
  Params: BusyParams;
}> = {
  method: 'GET',
  url: '/page/text/:person',
  async handler(request, reply) {
    const { person } = request.params;
    const today = Temporal.now.zonedDateTimeISO('UTC').startOfDay();
    const nextWeek = today.add({ days: 5 });
    const toStringOptions = {
      timeZoneName: 'never',
      smallestUnit: 'second',
    } as const;

    const res = await calendarApi.freebusy.query({
      requestBody: {
        timeMin: today.toString(toStringOptions),
        timeMax: nextWeek.toString(toStringOptions),
        items: [{ id: calendars[person].calendar }],
      },
    });
    const { errors, busy } = Object.values(res.data.calendars!)[0];

    if (errors && errors.length > 0) {
      reply.status(500).send({ error: 'API call failed', data: errors });
      return;
    }

    reply.type('text/html').send(`
      <link rel="stylesheet" href="/assets/css/base.css" />
      <script type="module">
        import { isBusyInterval } from '/assets/js/range.js';
        const ranges = JSON.parse('${JSON.stringify(busy)}');
        const h1 = document.querySelector('h1');
        isBusyInterval(ranges, (isBusy) => {
          if (isBusy) {
            document.body.className = 'busy';
            h1.textContent = 'Busy';
          } else {
            document.body.className = 'free';
            h1.textContent = 'Free';
          }
        });
      </script>
      <style>
        body {
          display: flex;
        }
        .profile {
          display: block;
          border-radius: 50%;
        }
        .free { background: #262626; }
        .busy { background: #D87220; }
      </style>
      <body class="free">
        <img class="profile" alt="${person}" src="${calendars[person].image}" />
        <h1 class="headline-1">Free</h1>
      </body>
    `);
  },
};
