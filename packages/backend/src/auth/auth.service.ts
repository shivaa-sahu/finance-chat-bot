import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwt: JwtService, private prisma: PrismaClient) {}

  async register(email: string, password: string, name?: string) {
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.user.create({
      data: { email, password: hashed, name },
    });
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email }});
    if (!user) return null;
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return null;
    return user;
  }

  async login(user) {
    const payload = { sub: user.id, email: user.email };
    const token = this.jwt.sign(payload);
    // create session entry
    await this.prisma.session.create({
      data: { token, userId: user.id, expiresAt: new Date(Date.now() + 7*24*3600*1000) }
    });
    return { access_token: token };
  }
}
