import { Status } from '@reflet/http';
import { json } from '@tanstack/react-start';
import { createAPIFileRoute } from '@tanstack/react-start/api';
import { setHeaders } from '@tanstack/react-start/server';
import { getUptimeInfo } from '~/lib/uptime';

export const APIRoute = createAPIFileRoute('/api/health')({
  GET: () => {
    const { uptime, timestamp } = getUptimeInfo();

    const healthPayload = {
      status: 'ok',
      uptime,
      timestamp,
    };

    setHeaders({
      'Cache-Control': 'no-cache',
    });
    return json(healthPayload, { status: Status.Ok });
  },
});
