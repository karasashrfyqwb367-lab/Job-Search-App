import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Chat {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  senderId: Types.ObjectId; 

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  receiverId: Types.ObjectId; 

  @Prop([
    {
      message: { type: String, required: true },
      senderId: { type: Types.ObjectId, ref: 'User', required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ])
  messages: {
    message: string;
    senderId: Types.ObjectId;
    createdAt?: Date;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
