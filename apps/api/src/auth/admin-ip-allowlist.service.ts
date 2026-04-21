import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminIpAllowlistService {
  constructor(private readonly prisma: PrismaService) {}

  private parseIpList(value?: string | null): string[] {
    if (!value) return [];

    return value
      .split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter(Boolean);
  }

  private normalizeIp(ip?: string | null): string {
    if (!ip) return '';

    let value = ip.trim();

    if (value.includes(',')) {
      value = value.split(',')[0].trim();
    }

    if (value.startsWith('::ffff:')) {
      value = value.slice(7);
    }

    return value;
  }

  extractRequestIp(request: {
    ip?: string;
    headers?: Record<string, string | string[] | undefined>;
    socket?: { remoteAddress?: string };
  }): string {
    const forwarded = request.headers?.['x-forwarded-for'];
    const forwardedIp = Array.isArray(forwarded) ? forwarded[0] : forwarded;

    return this.normalizeIp(forwardedIp || request.ip || request.socket?.remoteAddress || '');
  }

  async getAllowedIps(): Promise<string[]> {
    const config = await this.prisma.siteConfig.findFirst({
      where: { isActive: true },
      select: { adminAllowedIps: true },
    });

    return this.parseIpList(config?.adminAllowedIps);
  }

  async assertIpAllowed(ip?: string | null): Promise<void> {
    const normalizedIp = this.normalizeIp(ip);
    const allowedIps = await this.getAllowedIps();

    if (allowedIps.length === 0) {
      return;
    }

    if (!normalizedIp || !allowedIps.includes(normalizedIp)) {
      throw new ForbiddenException('Your IP address is not allowed to access admin endpoints');
    }
  }
}
