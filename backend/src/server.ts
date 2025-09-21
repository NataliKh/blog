import http from 'http';
import { createApp } from './app';
import { env } from './config/env';
import { connectDatabase } from './config/database';
import { bootstrap } from './services/bootstrap.service';

const start = async () => {
  await connectDatabase();
  await bootstrap();

  const app = createApp();
  const server = http.createServer(app);

  server.listen(env.PORT, () => {
    console.log(`Server is running on port ${env.PORT}`);
  });
};

void start().catch((error) => {
  console.error('Failed to start the server', error);
  process.exit(1);
});
