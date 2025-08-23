import { startServer } from './app';

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
