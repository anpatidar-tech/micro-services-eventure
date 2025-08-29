import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private onlineUsers: Map<string, string> = new Map();

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) {
      this.onlineUsers.set(userId, client.id);
      console.log(`User ${userId} connected`);
    }
  }

  handleDisconnect(client: Socket) {
    for (const [userId, socketId] of this.onlineUsers.entries()) {
      if (socketId === client.id) {
        this.onlineUsers.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  }

  sendEventCreated(friendIds: string[], payload: any) {
    friendIds.forEach((fid) => {
      const socketId = this.onlineUsers.get(fid);
      if (socketId) {
        this.server.to(socketId).emit('event_created', payload);
      }
    });
  }

  //update own leaderboard
  sendLeaderboardUpdate(creatorId: string, payload: any) {
    const socketId = this.onlineUsers.get(creatorId);
    if (socketId) {
      this.server.to(socketId).emit('leaderboard_updated', payload);
    }
  }
  
}
