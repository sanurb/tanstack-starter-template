import { json } from '@tanstack/react-start';
import { createAPIFileRoute } from '@tanstack/react-start/api';

const startTime = Date.now();

export const APIRoute = createAPIFileRoute('/api/health')({
  GET: () => {
    const uptime = (Date.now() - startTime) / 1000; // in seconds

    const healthPayload = {
      status: 'ok',
      uptime,
      timestamp: new Date().toISOString(),
    };

    const headers = new Headers();
    headers.set('Cache-Control', 'no-cache');

    return json(healthPayload, { status: 200, headers });
  },
});
