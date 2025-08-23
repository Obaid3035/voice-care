import type { FastifyReply, FastifyRequest } from 'fastify';
import { WebSocket } from 'ws';

interface CameraClient {
  id: string;
  socket: WebSocket;
  isCamera: boolean;
  connectedAt: Date;
}

interface CameraStatus {
  connectedClients: number;
  cameraClients: number;
  viewerClients: number;
  lastFrameTime?: Date;
  uptime: number;
}

class CameraService {
  private clients: Map<string, CameraClient> = new Map();
  private lastFrame: string | null = null;
  private startTime: Date = new Date();
  public clientCounter = 0;

  addClient(socket: WebSocket, isCamera = false): string {
    const clientId = `client_${++this.clientCounter}_${Date.now()}`;

    this.clients.set(clientId, {
      id: clientId,
      socket,
      isCamera,
      connectedAt: new Date(),
    });

    // If this is a camera client, send the last frame if available
    if (isCamera && this.lastFrame) {
      socket.send(
        JSON.stringify({
          type: 'lastFrame',
          data: { frame: this.lastFrame },
        })
      );
    }

    return clientId;
  }

  removeClient(clientId: string): void {
    this.clients.delete(clientId);
  }

  broadcastFrame(frame: string, senderId: string): void {
    this.lastFrame = frame;

    const message = JSON.stringify({
      type: 'frame',
      data: { frame, timestamp: new Date().toISOString() },
    });

    // Broadcast to all clients except the sender
    for (const [clientId, client] of this.clients) {
      if (clientId !== senderId && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(message);
        } catch (error) {
          console.error(`Error sending frame to client ${clientId}:`, error);
          this.removeClient(clientId);
        }
      }
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: Will be fixed later
  broadcastToViewers(message: any): void {
    const messageStr = JSON.stringify(message);

    for (const [clientId, client] of this.clients) {
      if (!client.isCamera && client.socket.readyState === WebSocket.OPEN) {
        try {
          client.socket.send(messageStr);
        } catch (error) {
          console.error(`Error sending message to viewer ${clientId}:`, error);
          this.removeClient(clientId);
        }
      }
    }
  }

  getStatus(): CameraStatus {
    const connectedClients = this.clients.size;
    const cameraClients = Array.from(this.clients.values()).filter((c) => c.isCamera).length;
    const viewerClients = connectedClients - cameraClients;

    return {
      connectedClients,
      cameraClients,
      viewerClients,
      lastFrameTime: this.lastFrame ? new Date() : undefined,
      uptime: Date.now() - this.startTime.getTime(),
    };
  }

  getConnectedClients(): CameraClient[] {
    return Array.from(this.clients.values());
  }
}

const cameraService = new CameraService();

export const cameraController = {
  // biome-ignore lint/suspicious/noExplicitAny: Will be fixed later
  async handleWebSocket(connection: any, req: FastifyRequest) {
    const { socket } = connection;
    const clientId = cameraService.addClient(socket);

    req.log.info(`Camera client connected: ${clientId}`);

    socket.send(
      JSON.stringify({
        type: 'status',
        data: { connected: true, clientId },
      })
    );

    socket.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        req.log.info(`Received message from camera client: ${data.type}`);

        switch (data.type) {
          case 'frame':
            cameraService.broadcastFrame(data.frame, clientId);
            break;
          case 'ping':
            socket.send(JSON.stringify({ type: 'pong' }));
            break;
          default:
            req.log.warn(`Unknown message type: ${data.type}`);
        }
      } catch (error) {
        req.log.error(error, 'Error parsing WebSocket message:');
      }
    });

    // Handle client disconnect
    socket.on('close', () => {
      cameraService.removeClient(clientId);
      req.log.info(`Camera client disconnected: ${clientId}`);
    });

    // Handle errors
    socket.on('error', (error) => {
      req.log.error(error, `WebSocket error for client ${clientId}:`);
      cameraService.removeClient(clientId);
    });
  },

  // Get camera service status
  async getStatus(_req: FastifyRequest, reply: FastifyReply) {
    const status = cameraService.getStatus();
    return reply.send({
      success: true,
      data: status,
    });
  },
};
