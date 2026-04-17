import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SiteConfigService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Get the active site configuration.
   * Returns the first active config (for single-site deployments).
   */
  async getActiveConfig() {
    return this.prisma.siteConfig.findFirst({
      where: { isActive: true },
    }) || null;
  }

  /**
   * Get site configuration by ID.
   */
  async getConfig(id: string) {
    return this.prisma.siteConfig.findUnique({
      where: { id },
    });
  }

  /**
   * Create a new site configuration.
   */
  async createConfig(data: {
    siteName: string;
    bubbleColor?: string;
    welcomeMessage?: string;
    offlineMessage?: string;
    bubbleSize?: string;
    bubblePattern?: string;
    websitePosition?: string;
    bubbleIcon?: string;
    notificationSoundUrl?: string;
    allowedOrigins: string;
    enableReadReceipts?: boolean;
    isOfflineMode?: boolean;
  }) {
    return this.prisma.siteConfig.create({ data });
  }

  /**
   * Update an existing site configuration.
   */
  async updateConfig(
    id: string,
    data: {
      bubbleColor?: string;
      welcomeMessage?: string;
      bubbleSize?: string;
      bubblePattern?: string;
      websitePosition?: string;
      bubbleIcon?: string;
      notificationSoundUrl?: string;
      allowedOrigins?: string;
      isActive?: boolean;
      enableReadReceipts?: boolean;
      isOfflineMode?: boolean;
    },
  ) {
    return this.prisma.siteConfig.update({
      where: { id },
      data,
    });
  }

  /**
   * List all site configurations.
   */
  async listConfigs() {
    return this.prisma.siteConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
