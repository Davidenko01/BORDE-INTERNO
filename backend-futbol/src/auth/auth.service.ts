/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async register(email: string, password: string) {
    const exists = await this.prisma.usuario.findUnique({ where: { email } });
    if (exists) {
      throw new ConflictException('El correo ya existe');
    }
  
    const hashed = await bcrypt.hash(password, 10);
    const user = await this.prisma.usuario.create({ data: { email, password: hashed } });
  
    const payload = { sub: user.id, email: user.email };
    return { access_token: this.jwtService.sign(payload), email: user.email };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.usuario.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { sub: user.id, email: user.email };
    //firma payload con el ID y el correo, retorna token de acceso
    return { access_token: this.jwtService.sign(payload) };
  }
}
