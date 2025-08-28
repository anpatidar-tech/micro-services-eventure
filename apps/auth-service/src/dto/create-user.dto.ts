import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'john@example.com', 
    description: 'The email of the user', 
    required: true 
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({ 
    example: 'John Doe', 
    description: 'The full name of the user', 
    required: true 
  })
  @IsNotEmpty({ message: 'Name is required' })
  name: string;

  @ApiProperty({ 
    example: 'strongPassword123',  
    description: 'The password of the user', 
    required: true 
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
