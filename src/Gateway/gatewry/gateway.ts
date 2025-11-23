import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from 'src/DB/model/User.Model';
import { Chat } from 'src/DB/model/Chat.Model';
import { ChatService } from 'src/chat/chat.service';

@WebSocketGateway({
  cors: { origin: '*' },
  namespace: 'events'
})
export class RealtimeGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly chatService: ChatService
  ) {}

  // عند اتصال العميل
  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);

    const token = client.handshake.headers.authorization as string;
    if (!token) return client.disconnect();

    try {
      const payload = await this.jwtService.verify(token, {
        secret: process.env.ACCESS_SECRET_KEY
      });

      const user = await this.userModel.findById(payload.id);
      if (!user) return client.disconnect();

      console.log(`User connected: ${user.email}`);
      // انضمام العميل إلى غرفة خاصة بالـ userId
      client.join(user._id.toString());
    } catch (err) {
      console.log('JWT verification failed:', err.message);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // إرسال رسالة
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @MessageBody() data: { chatId: string; senderId: string; message: string; receiverId: string },
    @ConnectedSocket() client: Socket
  ) {
    try {
      // تخزين الرسالة في DB
      const chat = await this.chatService.addMessage(data.chatId, data.senderId, data.message);

      // إرسال الرسالة للطرف الآخر فقط
      this.server.to(data.receiverId).emit('new_message', {
        chatId: data.chatId,
        senderId: data.senderId,
        message: data.message,
      });

      return { status: 'ok', chat };
    } catch (err) {
      console.error(err);
      return { status: 'error', message: err.message };
    }
  }
}
