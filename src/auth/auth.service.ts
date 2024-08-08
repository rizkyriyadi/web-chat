import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcryptjs';
import { compare } from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService, // Inject JwtService
  ) {}

  async validateUser(profile: any): Promise<any> {
    const { id, emails, displayName } = profile;
    const user = {
      googleId: id,
      email: emails[0].value,
      name: displayName,
    };
    return user;
  }

  async register(registerDto: RegisterDto): Promise<void> {
    const { username, email, password, firstName, lastName } = registerDto;

    // Check if username or email already exists
    const existingUser = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });
    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = this.userRepository.create({
      username,
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    // Save the user
    console.log('User: Succesfully created', user);
    await this.userRepository.save(user);
  }

  async login(loginDto: LoginDto): Promise<{ accessToken: string }> {
    const { email, password } = loginDto;

    try {
      const user = await this.userRepository.findOne({ where: { email } });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await compare(password, user.password);

      if (!isPasswordValid) {
        console.log('Invalid credentials for user:', user);
        throw new UnauthorizedException(`Invalid credentials`);
      }

      // Buat JWT
      const payload = { userId: user.id, email: user.email };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken };
    } catch (error) {
      console.error('Error during login:', error);

      if (error instanceof HttpException) {
        throw error;
      } else {
        throw new HttpException(
          'Internal server error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }
  }
}
