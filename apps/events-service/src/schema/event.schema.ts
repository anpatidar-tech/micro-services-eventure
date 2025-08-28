// event.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  media: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  creator: string;

  @Prop({
    type: [
      {
        user: { type: Types.ObjectId, ref: 'User' },
        points: Number,
        order: Number,
      },
    ],
    default: [],
  })
  acknowledgers: { user: string; points: number; order: number }[];
  createdAt: Date;
  updatedAt: Date;
}

export type EventDocument = Event & Document;


export const EventSchema = SchemaFactory.createForClass(Event);
