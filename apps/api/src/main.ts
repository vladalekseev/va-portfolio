import { createApiServer } from '@portfolio/api/server';

const port = Number(process.env['PORT'] ?? 3000);
const hostname = process.env['HOST'] ?? '127.0.0.1';

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be an integer between 1 and 65535.');
}

createApiServer().listen(port, hostname, () => {
  console.log(`tRPC API listening at http://${hostname}:${port}/api/trpc`);
});
