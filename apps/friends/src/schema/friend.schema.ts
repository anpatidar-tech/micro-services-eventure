import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Friend extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  friend: string;
}

export const FriendSchema = SchemaFactory.createForClass(Friend);
