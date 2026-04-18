import { z } from 'zod';
import { ToolHandler, ToolContext } from '../tool.interface';

// This is a simple example of a built-in tool that provides business hours information.
// In a real application, you might want to make this dynamic based on your business requirements.
export class GetBusinessHoursTool implements ToolHandler {
  name = 'get_business_hours';
  description = 'Get the current business hours and availability status. Use this when customers ask about operating hours or when agents are available.';
  parameters = z.object({});

  async execute(_args: any, _context: ToolContext): Promise<any> {
    // This is a placeholder that can be configured via admin settings
    return {
      timezone: 'UTC',
      hours: {
        monday: '9:00 AM - 6:00 PM',
        tuesday: '9:00 AM - 6:00 PM',
        wednesday: '9:00 AM - 6:00 PM',
        thursday: '9:00 AM - 6:00 PM',
        friday: '9:00 AM - 6:00 PM',
        saturday: 'Closed',
        sunday: 'Closed',
      },
      note: 'Business hours are in the configured timezone. A human agent may not be immediately available outside these hours.',
    };
  }
}
