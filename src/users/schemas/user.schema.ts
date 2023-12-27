// import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { generateHash } from 'src/utils/helper/common';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({
    type: 'string',
    trim: true,
  })
  name: string;

  @Prop({
    type: 'string',
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  })
  email: string;

  @Prop({
    type: 'string',
    required: true,
    trim: true,
    minlength: 8,
  })
  password: string;

  @Prop({
    type: 'string',
    default: null,
  })
  activeSessionToken: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Encrypt password
UserSchema.pre('save', async function (this: UserDocument) {
  if (this.isModified('password')) {
    this.password = await generateHash(this.password);
  }
});

UserSchema.index({
  email: 'text',
});
