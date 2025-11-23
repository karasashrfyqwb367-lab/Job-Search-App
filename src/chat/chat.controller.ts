import { Controller, Post, Body, Param, Get } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('start')
  async startConversation(
    @Body('senderId') senderId: string,
    @Body('receiverId') receiverId: string,
  ) {
    return this.chatService.createConversation(senderId, receiverId);
  }

  @Post(':chatId/message')
  async sendMessage(
    @Param('chatId') chatId: string,
    @Body('senderId') senderId: string,
    @Body('message') message: string,
  ) {
    return this.chatService.addMessage(chatId, senderId, message);
  }

  @Get('between/:user1/:user2')
  async getChat(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ) {
    return this.chatService.getChatBetweenUsers(user1, user2);
  }
}
