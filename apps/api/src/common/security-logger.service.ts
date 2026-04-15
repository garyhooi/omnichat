import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class SecurityLoggerService {
  private readonly logger = new Logger('Security');

  logAuthAttempt(username: string, success: boolean, ip: string, reason?: string) {
    if (success) {
      this.logger.log(`Successful login for user ${username} from IP ${ip}`);
    } else {
      this.logger.warn(`Failed login attempt for user ${username} from IP ${ip}. Reason: ${reason}`);
    }
  }

  logOriginViolation(origin: string, referer: string, ip: string) {
    this.logger.warn(`Origin validation failed - Origin: ${origin}, Referer: ${referer}, IP: ${ip}`);
  }

  logRateLimitViolation(ip: string, endpoint: string) {
    this.logger.warn(`Rate limit exceeded for IP ${ip} on endpoint ${endpoint}`);
  }

  logSuspiciousActivity(ip: string, action: string, details: string) {
    this.logger.error(`Suspicious activity detected from IP ${ip}: ${action} - ${details}`);
  }
}