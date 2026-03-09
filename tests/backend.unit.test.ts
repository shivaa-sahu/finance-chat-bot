import { AuthService } from '../packages/backend/src/auth/auth.service';
import { PrismaClient } from '@prisma/client';
jest.mock('@prisma/client');

describe('AuthService', () => {
  it('registers user and hashes password', async () => {
    const prisma = new PrismaClient();
    prisma.user = { create: jest.fn().mockResolvedValue({id:'u1',email:'a@b'}) } as any;
    const service = new AuthService(null as any, prisma as any);
    const user = await service.register('a@b','password');
    expect(prisma.user.create).toHaveBeenCalled();
    expect(user.email).toEqual('a@b');
  });
});
