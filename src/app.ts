import cors from "@fastify/cors";
import formbody from "@fastify/formbody";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import websocket from "@fastify/websocket";
import fastify, { FastifyInstance } from "fastify";
import pino from "pino";
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

 

  // Register routes
  await server.register(voiceRouter, { prefix: "/api" });
  await server.register(cameraRouter);
  await server.register(audioContentRouter, { prefix: "/api" });
  

  // Global error handler
  server.setErrorHandler(async (error, request, reply) => {    
    // Handle AppError instances
    if (error instanceof Error && 'code' in error && 'statusCode' in error) {
      const apiError = {
        code: (error as any).code,
        message: error.message,
        details: (error as any).details,
        statusCode: (error as any).statusCode,
      };
      const response = {
        success: false,
        error: apiError
      };
      reply.code((error as any).statusCode).send(response);
      return;
    }

    // Handle unknown errors
    const apiError = {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred",
      statusCode: STANDARD.INTERNAL_SERVER_ERROR,
    };
    const response = {
      success: false,
      error: apiError
    };
    reply.code(STANDARD.INTERNAL_SERVER_ERROR).send(response);
  });

  // Custom 404 handler
  server.setNotFoundHandler(async (request, reply) => {
    const response = {
      success: false,
      error: {
        message: `Route ${request.method} ${request.url} not found`,
        statusCode: STANDARD.NOT_FOUND
      }
    };
    reply.code(STANDARD.NOT_FOUND).send(response);
  });

  // Health check endpoint
  server.get("/health", async (_request, reply) => {
    const healthData = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    };

    const response = {
      success: true,
      data: healthData
    };
    reply.status(STANDARD.OK).send(response);
  });

  // Root endpoint
  server.get("/", (_request, reply) => {
    const apiInfo = {
      name: "Voice Care API",
      version: "1.0.0",
      environment: env.NODE_ENV,
      status: "running",
    };

    const response = {
      success: true,
      data: apiInfo
    };
    reply.status(STANDARD.OK).send(response);
  });

  return server;
}

export async function startServer(): Promise<FastifyInstance> {
  const app = await createApp();
  
  const port = Number(env.API_PORT);
  const host = env.API_HOST;

  // Graceful shutdown handling
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
    await app.listen({
      port,
      host,
    });
    app.log.info(`Server listening on ${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }

  return app;
} 