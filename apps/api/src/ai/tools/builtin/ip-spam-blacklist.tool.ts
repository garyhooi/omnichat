import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';
import { AiSecurityService } from '../../ai-security.service';

export class IpSpamBlacklistTool implements ToolHandler {
  name = 'ip_spam_blacklist';
  description =
    'Tracks and blocks IPs that repeatedly spam the AI across conversations. ' +
    'Call this to check whether a visitor has been blacklisted for spam behavior. ' +
    'The system automatically blacklists IPs that exceed rate limits or send repeated duplicate messages.';
  parameters = z.object({});

  constructor(private readonly securityService: AiSecurityService) {}

  async execute(_args: Record<string, never>, context: ToolContext): Promise<any> {
    const visitorIp = context.visitorIp;
    const isBlacklisted = visitorIp ? await this.securityService.isIpBlacklisted(visitorIp) : false;

    return {
      protectionActive: true,
      visitorIp: visitorIp || 'unknown',
      blacklisted: isBlacklisted,
      message: isBlacklisted
        ? 'This visitor is currently blacklisted due to spam activity.'
        : 'No blacklist entry for this visitor.',
    };
  }
}
