import { ForbiddenException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { AuthDto } from './dto';
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CustomLoggerService } from 'src/logger/custom-logger.service';

@Injectable()
export class AuthService {
  private readonly LOG = 'AuthService | ';
  constructor(
    private db: DbService,
    private jwt: JwtService,
    private config: ConfigService,
    private readonly logger: CustomLoggerService,
  ) {}

  async signup(requestId: string, authDto: AuthDto) {
    try {
      this.logger.log(`${this.LOG} Signup | start`, requestId);
      const hash: string = await argon.hash(authDto.password);
      const user = await this.db.user.create({
        data: {
          email: authDto.email,
          hash,
        },
      });
      this.logger.log(`${this.LOG} Signup | User Created`, requestId);
      return this.signToken(user.id, user.email);
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.logger.error(
            `Signup failed: ${error.message}`,
            error.stack || 'No stack trace available',
            requestId,
          );
          throw new ForbiddenException('Credentials already taken !');
        }
      }
      this.logger.error(
        `Signup failed: ${error.message}`,
        error.stack || 'No stack trace available',
        requestId,
      );
      throw error;
    }
  }
  async signin(requestId: string, authDto: AuthDto) {
    this.logger.log(`${this.LOG} Signin | start`, requestId);
    const user = await this.db.user.findUnique({
      where: {
        email: authDto.email,
      },
    });
    if (!user) {
      this.logger.log(
        `${this.LOG} Signin | User: ${authDto.email} Not Found`,
        requestId,
      );
      throw new ForbiddenException('Incorrect Credentials !');
    }

    const pwMatches = await argon.verify(user.hash, authDto.password);
    if (!pwMatches) {
      this.logger.log(`${this.LOG} Signin | Incorrect Credentials`, requestId);
      throw new ForbiddenException('Incorrect Credentials !');
    }

    return this.signToken(user.id, user.email);
  }

  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };
    const token = await this.jwt.signAsync(payload, {
      expiresIn: this.config.get('TOKEN_EXPIRES_IN'),
      secret: this.config.get('JWT_SECRET'),
    });
    return {
      access_token: token,
    };
  }
}
