import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Chat } from 'src/DB/model/Chat.Model';
import { User } from 'src/DB/model/User.Model';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}


  async createConversation(senderId: string, receiverId: string) {
    const sender = await this.userModel.findById(senderId);
    if (!sender) throw new NotFoundException('Sender not found');

   
    if (!['HR', 'Owner'].includes(sender.role)) {
      throw new ForbiddenException('Only HR or Owner can start conversation');
    }

    // تحقق المستخدم 
    const receiver = await this.userModel.findById(receiverId);
    if (!receiver) throw new NotFoundException('Receiver not found');

    const chat = await this.chatModel.create({
      senderId,
      receiverId,
      messages: [],
    });

    return chat;
  }

  async addMessage(chatId: string, senderId: string, message: string) {
    const chat = await this.chatModel.findById(chatId);
    if (!chat) throw new NotFoundException('Chat not found');

    chat.messages.push({ message, senderId: new Types.ObjectId(senderId) });
    await chat.save();
    return chat;
  }

  async getChatBetweenUsers(user1Id: string, user2Id: string) {
    return this.chatModel.findOne({
      $or: [
        { senderId: user1Id, receiverId: user2Id },
        { senderId: user2Id, receiverId: user1Id },
      ],
    });
  }
}
