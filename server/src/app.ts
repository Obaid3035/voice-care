import path from 'node:path';
import formbody from '@fastify/formbody';
import helmet from '@fastify/helmet';
import multipart from '@fastify/multipart';
import fastifyStatic from '@fastify/static';
import websocket from '@fastify/websocket';
import fastify, { type FastifyInstance } from 'fastify';
import type pino from 'pino';
import { env } from './config/env.config';
import { STANDARD } from './constants/request';
import { audioContentRouter } from './features/audio-content';
import { cameraRouter } from './features/camera';
import { provisioningRouter } from './features/provisioning';
import { userRouter } from './features/user';
import { voiceRouter } from './features/voice';

export interface AppOptions {
  logger?: pino.Logger;
}

export async function createApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const server = fastify({
    logger: {
      level: options.logger?.level || env.LOG_LEVEL,
    },
    disableRequestLogging: false,
  });

  const isProd = env.NODE_ENV === 'production';

  if (isProd) {
    const SUPABASE_URL = env.SUPABASE_URL;
    const supabaseUrl = new URL(SUPABASE_URL);
    const supabaseOrigin = `${supabaseUrl.protocol}//${supabaseUrl.host}`;
    const supabaseWsOrigin = supabaseOrigin.replace('https://', 'wss://');

    await server.register(helmet, {
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          connectSrc: ["'self'", supabaseOrigin, supabaseWsOrigin],
          imgSrc: ["'self'", 'data:', 'blob:'],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          fontSrc: ["'self'", 'https:', 'data:'],
          frameSrc: ["'self'", supabaseOrigin],
          mediaSrc: ["'self'", supabaseOrigin, 'blob:', 'data:'],
        },
      },
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: 'same-origin-allow-popups' },
    });

    server.addHook('onSend', (_request, reply, _payload, next) => {
      const ct = String(reply.getHeader('content-type') || '');
      if (!ct.includes('text/html')) reply.removeHeader('content-security-policy');
      next();
    });

    server.register(fastifyStatic, {
      root: path.join(__dirname, '../../client/dist'),
      prefix: '/',
    });

    server.setNotFoundHandler((request, reply) => {
      if (request.raw.method === 'GET' && !request.raw.url?.startsWith('/api')) {
        return reply.sendFile('index.html');
      }

      reply.code(STANDARD.NOT_FOUND).send({
        success: false,
        error: {
          message: `Route ${request.method} ${request.url} not found`,
          statusCode: STANDARD.NOT_FOUND,
        },
      });
    });
  } else {
    await server.register(helmet, { contentSecurityPolicy: false });
  }

  await server.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });

  await server.register(formbody);
  await server.register(websocket);

  await server.register(voiceRouter, { prefix: '/api' });
  await server.register(cameraRouter);
  await server.register(audioContentRouter, { prefix: '/api' });
  await server.register(userRouter, { prefix: '/api' });
  await server.register(provisioningRouter, { prefix: '/api' });

  server.setErrorHandler(async (error, _request, reply) => {
    if (error instanceof Error) {
      const apiError = {
        code: error.code,
        message: error.message,
        statusCode: error.statusCode,
      };

      reply.code(error.statusCode).send({
        success: false,
        error: apiError,
      });
      return;
    }

    const apiError = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      statusCode: STANDARD.INTERNAL_SERVER_ERROR,
    };
    reply.code(STANDARD.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: apiError,
    });
  });

  server.get('/health', async (_request, reply) => {
    const healthData = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    };

    reply.status(STANDARD.OK).send({
      success: true,
      data: healthData,
    });
  });

  return server;
}

export async function startServer(): Promise<FastifyInstance> {
  const app = await createApp();

  const port = Number(env.EFFECTIVE_PORT ?? env.API_PORT ?? 3000);
  const host = env.API_HOST;

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ['SIGINT', 'SIGTERM'];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await app.close();
        app.log.info(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        app.log.error(err, `Error closing application on ${signal}`);
        process.exit(1);
      }
    });
  });

  try {
    await app.listen({ port, host });
    app.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
}
