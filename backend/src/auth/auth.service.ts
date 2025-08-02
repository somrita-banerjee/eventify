import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtUser } from 'src/decorator/userFromAuth.decorator';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  logger = new Logger(AuthService.name);

  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configservice: ConfigService,
  ) {}

  async login(body: LoginDto) {
    const findUser = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
    });

    if (
      !findUser ||
      !(await bcrypt.compare(body.password, findUser.password))
    ) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await this.generateJwtToken(findUser.id, {
      email: findUser.email,
    });
    return {
      ...token,
    };
  }

  private async generateJwtToken(userId: string, extras: Record<string, any>) {
    const payload: JwtUser = {
      sub: userId,
      ...extras,
    };
    return {
      access_token: await this.jwtService.signAsync(payload, {
        secret: this.configservice.get<string>('JWT_SECRET'),
        expiresIn: '7d',
      }),
    };
  }

  async register(body: RegisterDto) {
    const existinguser = await this.prismaService.users.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existinguser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const newuser = await this.prismaService.users.create({
      data: {
        id: uuidv4(),
        name: body.name,
        email: body.email,
        password: hashedPassword,
      },
    });
    const token = await this.generateJwtToken(newuser.id, {
      email: newuser.email,
    });
    return {
      ...token,
    };
  }

  async getMe(user: JwtUser) {
    const foundUser = await this.prismaService.users.findUnique({
      where: {
        id: user.sub,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }
    return foundUser;
  }
}
