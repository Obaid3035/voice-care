import type { FastifyInstance } from 'fastify';
import { cameraController } from '../camera/camera.controller';

export async function cameraRouter(fastify: FastifyInstance) {
  fastify.register(async (fastify) => {
    // WebSocket route for camera streaming
    fastify.get('/ws/camera', { websocket: true }, cameraController.handleWebSocket);

    // HTTP endpoint to get camera status
    fastify.get('/camera/status', cameraController.getStatus);
  });
}
