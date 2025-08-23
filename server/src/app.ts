import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import fastify, { FastifyInstance } from "fastify";
import pino from "pino";
import path from "path";
import fastifyStatic from "@fastify/static";

import { env } from "./config/env.config";
import { voiceRouter } from "./features/voice";
import { cameraRouter } from "./features/camera";
import { audioContentRouter } from "./features/audio-content";
import { STANDARD } from "./constants/request";

export interface AppOptions {
  logger?: pino.Logger;
}

export async function createApp(options: AppOptions = {}): Promise<FastifyInstance> {
  const server = fastify({
    logger: options.logger || pino({ level: env.LOG_LEVEL }),
    disableRequestLogging: false,
  });

  // ✅ Serve React build (after client is built)
  server.register(fastifyStatic, {
    root: path.join(__dirname, "../client/dist"),
    prefix: "/", // serve at root
  });

  // Register middlewares
  await server.register(formbody);
  await server.register(cors, {
    origin: (origin, cb) => {
      if (!origin) return cb(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
      ];

      if (allowedOrigins.includes(origin)) {
        return cb(null, true);
      }

      return cb(new Error("Not allowed by CORS"), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  });
  await server.register(helmet);
  await server.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 1,
    },
  });
  await server.register(websocket);

  // Register API routes
  await server.register(voiceRouter, { prefix: "/api" });
  await server.register(cameraRouter);
  await server.register(audioContentRouter, { prefix: "/api" });

  // Global error handler
  server.setErrorHandler(async (error, request, reply) => {
    if (error instanceof Error && "code" in error && "statusCode" in error) {
      const apiError = {
        code: (error as any).code,
        message: error.message,
        details: (error as any).details,
        statusCode: (error as any).statusCode,
      };
      reply.code((error as any).statusCode).send({
        success: false,
        error: apiError,
      });
      return;
    }

    const apiError = {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      statusCode: STANDARD.INTERNAL_SERVER_ERROR,
    };
    reply.code(STANDARD.INTERNAL_SERVER_ERROR).send({
      success: false,
      error: apiError,
    });
  });

  // ✅ NotFound handler: serve React index.html for SPA routes
  server.setNotFoundHandler((request, reply) => {
    if (request.raw.method === "GET" && !request.raw.url?.startsWith("/api")) {
      return reply.sendFile("index.html");
    }

    reply.code(STANDARD.NOT_FOUND).send({
      success: false,
      error: {
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: STANDARD.NOT_FOUND,
      },
    });
  });

  // Health check endpoint
  server.get("/health", async (_request, reply) => {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    };

    reply.status(STANDARD.OK).send({
      success: true,
      data: healthData,
    });
  });

  // Root endpoint
  server.get("/", (_request, reply) => {
    const apiInfo = {
      name: "Voice Care API",
      version: "1.0.0",
      environment: env.NODE_ENV,
      status: "running",
    };

    reply.status(STANDARD.OK).send({
      success: true,
      data: apiInfo,
    });
  });

  return server;
}

export async function startServer(): Promise<FastifyInstance> {
  const app = await createApp();

  const port = Number(env.API_PORT);
  const host = env.API_HOST;

  // Graceful shutdown
  const signals: NodeJS.Signals[] = ["SIGINT", "SIGTERM"];
  signals.forEach((signal) => {
    process.on(signal, async () => {
      try {
        await app.close();
        app.log.info(`Closed application on ${signal}`);
        process.exit(0);
      } catch (err) {
        app.log.error(`Error closing application on ${signal}`, err);
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
