// Simple test to verify parameter extraction
const testPrompt = "Show me completed tasks for last 5 days with only first 10 tasks";

console.log('Testing with prompt:', testPrompt);

// Mock the service
const ParameterExtractionService = {
    STATUS_KEYWORDS: {
        'new': ['new', 'fresh', 'recent', 'just created', 'newly created'],
        'done': ['done', 'completed', 'finished', 'completed tasks', 'finished tasks'],
        'canceled': ['canceled', 'cancelled', 'cancelled tasks', 'canceled tasks'],
        'in-work': ['in work', 'in progress', 'working', 'being processed', 'currently working'],
        'on-moderation': ['on moderation', 'moderating', 'under moderation', 'being moderated'],
        'awaiting-approve': ['awaiting approve', 'awaiting approval', 'waiting for approval', 'pending approval', 'needs approval'],
        'on-payment': ['on payment', 'payment', 'paid', 'payment pending'],
        'in-queue': ['in queue', 'queued', 'waiting', 'pending']
    },

    LIMIT_PATTERNS: [
        /(?:only|just|limit|first|top)\s+(\d+)/i,
        /(\d+)\s+(?:tasks?|items?|records?)/i,
        /maximum\s+(\d+)/i,
        /up\s+to\s+(\d+)/i
    ],

    TIME_PATTERNS: [
        /last\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
        /past\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
        /previous\s+(\d+)\s+(day|days|week|weeks|month|months)/i,
        /(\d+)\s+(day|days|week|weeks|month|months)\s+ago/i,
        /(today|yesterday|this\s+week|this\s+month)/i,
        /from\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+to\s+(\d{1,2}\/\d{1,2}\/\d{4})/i,
        /between\s+(\d{1,2}\/\d{1,2}\/\d{4})\s+and\s+(\d{1,2}\/\d{1,2}\/\d{4})/i
    ],

    extractParameters(prompt) {
        const parameters = {};
        const humanReadable = [];
        const errors = [];
        const lowerPrompt = prompt.toLowerCase();

        console.log('Extracting from:', lowerPrompt);

        // Extract limit
        for (const pattern of this.LIMIT_PATTERNS) {
            const match = lowerPrompt.match(pattern);
            if (match) {
                const value = parseInt(match[1], 10);
                if (!isNaN(value) && value > 0) {
                    parameters.limit = value;
                    humanReadable.push(`Limit: ${value} tasks`);
                    console.log('Found limit:', value);
                    break;
                }
            }
        }

        // Extract task status
        for (const [status, keywords] of Object.entries(this.STATUS_KEYWORDS)) {
            for (const keyword of keywords) {
                if (lowerPrompt.includes(keyword)) {
                    parameters.taskStatus = status;
                    const displayName = this.getStatusDisplayName(status);
                    humanReadable.push(`Status: ${displayName}`);
                    console.log('Found status:', status, displayName);
                    break;
                }
            }
            if (parameters.taskStatus) break;
        }

        // Extract time range
        for (const pattern of this.TIME_PATTERNS) {
            const match = lowerPrompt.match(pattern);
            if (match) {
                console.log('Time pattern match:', match);
                const now = new Date();
                
                if (pattern.source.includes('last') || pattern.source.includes('past') || pattern.source.includes('previous') || pattern.source.includes('ago')) {
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
                    
                    parameters.timeRangeFrom = from.toISOString().split('T')[0];
                    parameters.timeRangeTo = now.toISOString().split('T')[0];
                    humanReadable.push(`Time Range: Last ${amount} ${unit}${amount > 1 ? 's' : ''}`);
                    console.log('Found time range:', parameters.timeRangeFrom, 'to', parameters.timeRangeTo);
                    break;
                }
            }
        }

        return {
            parameters,
            humanReadable,
            isValid: errors.length === 0,
            errors
        };
    },

    getStatusDisplayName(status) {
        const displayNames = {
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
};

const result = ParameterExtractionService.extractParameters(testPrompt);
console.log('\nFinal result:', JSON.stringify(result, null, 2));
console.log('\nHuman readable params:', result.humanReadable);
console.log('\nShould display in UI:', result.humanReadable.length > 0);
