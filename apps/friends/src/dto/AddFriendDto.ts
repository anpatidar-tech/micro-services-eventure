import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({
    example: '64f1e1a2c9d3b3a0d45f12cd',
    description: 'The ID of the friend to add',
    required: true,
  })
  @IsString()
  friendId: string;
}
