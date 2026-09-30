import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';

const port = 3001;
const clients = new Set();
let heartbeatSequence = 0;

function send(response, event) {
  response.write(`id: ${event.id}\n`);
  response.write(`data: ${JSON.stringify(event)}\n\n`);
}

function createEvent(type, source, payload) {
  return {
    id: randomUUID(),
    type,
    source,
    timestamp: new Date().toISOString(),
    payload,
  };
}

function broadcast(event) {
  for (const client of clients) {
    send(client, event);
  }
}

function writeJson(response, status, body) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json',
  });
  response.end(JSON.stringify(body));
}

const server = createServer((request, response) => {
  if (request.method === 'OPTIONS') {
    response.writeHead(204, {
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Origin': '*',
    });
    response.end();
    return;
  }

  if (request.method === 'GET' && request.url === '/events') {
    response.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
      'X-Accel-Buffering': 'no',
    });
    response.flushHeaders();
    clients.add(response);
    send(
      response,
      createEvent('system.connected', 'sse-server', {
        message: 'Le shell est abonné au flux inter-MFE.',
      }),
    );

    request.on('close', () => clients.delete(response));
    return;
  }

  if (request.method === 'POST' && request.url === '/events') {
    let body = '';
    request.setEncoding('utf8');
    request.on('data', (chunk) => {
      body += chunk;
    });
    request.on('end', () => {
      try {
        const input = JSON.parse(body);
        if (
          typeof input !== 'object' ||
          input === null ||
          typeof input.type !== 'string' ||
          typeof input.source !== 'string'
        ) {
          writeJson(response, 400, { error: 'type and source are required strings.' });
          return;
        }

        const event = createEvent(input.type, input.source, input.payload ?? null);
        broadcast(event);
        writeJson(response, 202, event);
      } catch (error) {
        writeJson(response, 400, {
          error: error instanceof Error ? error.message : 'Invalid JSON body.',
        });
      }
    });
    return;
  }

  writeJson(response, 404, { error: 'Not found.' });
});

const heartbeat = setInterval(() => {
  heartbeatSequence += 1;
  broadcast(
    createEvent('system.message', 'sse-server', {
      message: `Message SSE numéro ${heartbeatSequence}, diffusé toutes les 5 secondes.`,
      sequence: heartbeatSequence,
      subscribers: clients.size,
    }),
  );
}, 5_000);

server.listen(port, () => {
  console.log(`SSE server listening on http://localhost:${port}/events`);
  console.log(`Publish events with POST http://localhost:${port}/events`);
});

function shutdown() {
  clearInterval(heartbeat);
  for (const client of clients) {
    client.end();
  }
  server.close();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
