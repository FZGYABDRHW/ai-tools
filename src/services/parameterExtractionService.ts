export interface TaskListParameters {
  limit?: number;
  taskStatus?: 'new' | 'done' | 'canceled' | 'in-work' | 'on-moderation' | 'awaiting-approve' | 'on-payment' | 'in-queue';
  timeRangeFrom?: string;
  timeRangeTo?: string;
}

export interface ExtractedParameters {
  parameters: TaskListParameters;
  humanReadable: string[];
  isValid: boolean;
  errors: string[];
}

export class ParameterExtractionService {
  private static readonly STATUS_KEYWORDS = {
    'new': ['new', 'fresh', 'recent', 'just created', 'newly created'],
    'done': ['done', 'completed', 'finished', 'completed tasks', 'finished tasks'],
    'canceled': ['canceled', 'cancelled', 'cancelled tasks', 'canceled tasks'],
    'in-work': ['in work', 'in progress', 'working', 'being processed', 'currently working'],
    'on-moderation': ['on moderation', 'moderating', 'under moderation', 'being moderated'],
    'awaiting-approve': ['awaiting approve', 'awaiting approval', 'waiting for approval', 'pending approval', 'needs approval'],
    'on-payment': ['on payment', 'payment', 'paid', 'payment pending'],
    'in-queue': ['in queue', 'queued', 'waiting', 'pending']
  };

  private static readonly TIME_PATTERNS = [
    // Last X days/weeks/months
    /last\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
    // Past X days/weeks/months
    /past\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
    // Previous X days/weeks/months
    /previous\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
    // X days/weeks/months ago
    /(\d+)\s+(day|days|week|weeks|month|months)\s+ago/i,
    // Today, yesterday, this week, this month
    /(today|yesterday|this\s+week|this\s+month)/i,
    // Specific date ranges
    /from\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+to\s+(\d{1,2}\/\d{1,2}\/\d{4})/i,
    /between\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+and\s+(\d{1,2}\/\d{1,2}\/\d{4})/i
  ];

  private static readonly LIMIT_PATTERNS = [
    /(?:only|just|limit|first|top)\s+(\d+)/i,
    /(\d+)\s+(?:tasks?|items?|records?)/i,
    /maximum\s+(\d+)/i,
    /up\s+to\s+(\d+)/i
  ];

  static extractParameters(prompt: string): ExtractedParameters {
    const parameters: TaskListParameters = {};
    const humanReadable: string[] = [];
    const errors: string[] = [];
    const lowerPrompt = prompt.toLowerCase();

    // Extract limit
    const limitMatch = this.extractLimit(lowerPrompt);
    if (limitMatch) {
      parameters.limit = limitMatch.value;
      humanReadable.push(`Limit: ${limitMatch.value} tasks`);
    }

    // Extract task status
    const statusMatch = this.extractTaskStatus(lowerPrompt);
    if (statusMatch) {
      parameters.taskStatus = statusMatch.value;
      humanReadable.push(`Status: ${statusMatch.displayName}`);
    }

    // Extract time range
    const timeMatch = this.extractTimeRange(lowerPrompt);
    if (timeMatch) {
      parameters.timeRangeFrom = timeMatch.from;
      parameters.timeRangeTo = timeMatch.to;
      humanReadable.push(`Time Range: ${timeMatch.displayName}`);
    }

    // Validation
    if (parameters.limit && (parameters.limit < 1 || parameters.limit > 1000)) {
      errors.push('Limit must be between 1 and 1000');
    }

    return {
      parameters,
      humanReadable,
      isValid: errors.length === 0,
      errors
    };
  }

  private static extractLimit(prompt: string): { value: number } | null {
    for (const pattern of this.LIMIT_PATTERNS) {
      const match = prompt.match(pattern);
      if (match) {
        const value = parseInt(match[1], 10);
        if (!isNaN(value) && value > 0) {
          return { value };
        }
      }
    }
    return null;
  }

  private static extractTaskStatus(prompt: string): { value: TaskListParameters['taskStatus']; displayName: string } | null {
    for (const [status, keywords] of Object.entries(this.STATUS_KEYWORDS)) {
              for (const keyword of keywords) {
          if (prompt.includes(keyword)) {
            const displayName = this.getStatusDisplayName(status);
            return { value: status as TaskListParameters['taskStatus'], displayName };
          }
        }
    }
    return null;
  }

  private static extractTimeRange(prompt: string): { from: string; to: string; displayName: string } | null {
    for (const pattern of this.TIME_PATTERNS) {
      const match = prompt.match(pattern);
      if (match) {
        const now = new Date();
        
        if (pattern.source.includes('last|past|previous') || pattern.source.includes('ago')) {
          const amount = parseInt(match[1], 10);
          const unit = match[2].toLowerCase();
          
          const from = new Date();
          if (unit.includes('day')) {
            from.setDate(from.getDate() - amount);
          } else if (unit.includes('week')) {
            from.setDate(from.getDate() - (amount * 7));
          } else if (unit.includes('month')) {
            from.setMonth(from.getMonth() - amount);
          }
          
          return {
            from: from.toISOString().split('T')[0],
            to: now.toISOString().split('T')[0],
            displayName: `Last ${amount} ${unit}`
          };
        } else if (pattern.source.includes('today|yesterday|this')) {
          if (match[1] === 'today') {
            return {
              from: now.toISOString().split('T')[0],
              to: now.toISOString().split('T')[0],
              displayName: 'Today'
            };
          } else if (match[1] === 'yesterday') {
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            return {
              from: yesterday.toISOString().split('T')[0],
              to: yesterday.toISOString().split('T')[0],
              displayName: 'Yesterday'
            };
          } else if (match[1] === 'this week') {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            return {
              from: startOfWeek.toISOString().split('T')[0],
              to: now.toISOString().split('T')[0],
              displayName: 'This week'
            };
          } else if (match[1] === 'this month') {
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            return {
              from: startOfMonth.toISOString().split('T')[0],
              to: now.toISOString().split('T')[0],
              displayName: 'This month'
            };
          }
        } else if (pattern.source.includes('from|between')) {
          // Handle specific date ranges
          const date1 = new Date(match[1]);
          const date2 = new Date(match[2] || match[1]);
          
          if (!isNaN(date1.getTime()) && !isNaN(date2.getTime())) {
            return {
              from: date1.toISOString().split('T')[0],
              to: date2.toISOString().split('T')[0],
              displayName: `${date1.toLocaleDateString()} to ${date2.toLocaleDateString()}`
            };
          }
        }
      }
    }
    return null;
  }

  private static getStatusDisplayName(status: string): string {
    const displayNames: Record<string, string> = {
      'new': 'New Tasks',
      'done': 'Completed Tasks',
      'canceled': 'Canceled Tasks',
      'in-work': 'Tasks In Work',
      'on-moderation': 'Tasks On Moderation',
      'awaiting-approve': 'Tasks Awaiting Approval',
      'on-payment': 'Tasks On Payment',
      'in-queue': 'Tasks In Queue'
    };
    return displayNames[status] || status;
  }

  static getServiceMethod(status: string): string {
    const methodMap: Record<string, string> = {
      'new': 'getNewTasks',
      'done': 'getDoneTasks',
      'canceled': 'getCanceledTasks',
      'in-work': 'getInWorkTasks',
      'on-moderation': 'getOnModerationTasks',
      'awaiting-approve': 'getOnAwaitingApprove',
      'on-payment': 'getOnPayment',
      'in-queue': 'getInQueueTasks'
    };
    return methodMap[status] || 'getInWorkTasks';
  }
}
