"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptEnhancerService = exports.PromptEnhancerService = void 0;
const openai_1 = __importDefault(require("openai"));
const settingsService_1 = require("./settingsService");
class PromptEnhancerService {
    constructor() {
        this.openai = null;
    }
    initializeOpenAI() {
        const apiKey = settingsService_1.settingsService.getOpenAIKey();
        if (!apiKey) {
            throw new Error('OpenAI API key not configured. Please go to Settings and configure your API key.');
        }
        this.openai = new openai_1.default({ dangerouslyAllowBrowser: true, apiKey });
    }
    async enhancePrompt(originalPrompt) {
        if (!this.openai) {
            this.initializeOpenAI();
        }
        if (!originalPrompt.trim()) {
            throw new Error('Please provide a prompt to enhance');
        }
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o', // Using gpt-4o for better prompt enhancement
                messages: [
                    {
                        role: 'system',
                        content: `You are an expert prompt engineer for a task-report generation tool.

OBJECTIVE:
ENHANCE and improve the user's prompt by adding data types, formats, and better structure. Do NOT just copy the original - make meaningful improvements.

STRICT RULES:
- Use the SAME LANGUAGE as the user's original prompt for ALL text, including section headings.
- Output MUST contain EXACTLY TWO SECTIONS and NOTHING ELSE:
  1) ## Report Fields
  2) ## Filtering Criteria
- Do NOT include any introductions, explanations, examples, or trailing commentary.
- ALWAYS enhance the original content - add data types, formats, constraints, and better descriptions.

MAPPING RULES:
- Turn EVERY requirement/condition from the original prompt into either:
  • a field (per-row output column), or
  • a filtering criterion (list-level parameter) — only for: task status, date range, limit.
- If a condition can be represented as a per-row value (e.g., assignee, price, deadline, tags), put it under Report Fields.
- Only list-level restrictions go under Filtering Criteria (e.g., Status filter, Date range, Limit N items). Do NOT add sorting/grouping here.

FORMAT RULES:
- Report Fields: bullet list. Each item: **Field Name**: short description (concise, 1 sentence max).
- Filtering Criteria: bullet list. Only include relevant items from: **Status**, **Date Range**, **Limit**.
- Use **bold** for field names and criteria labels. Use *italic* sparingly.
- No code blocks unless the user explicitly asks for technical format snippets.

DATA TYPE RULES:
- For each field, specify data type, format, and possible values when relevant:
  * Dates: specify format (e.g., "В формате ISO", "В формате DD.MM.YYYY")
  * Status/Boolean fields: specify possible values (e.g., "Может принимать значения: выполнено - не выполнено")
  * Numbers: specify units or ranges if applicable (e.g., "В днях", "В рублях")
  * Text: specify max length or format if relevant (e.g., "До 255 символов", "Email формат")
  * Enums: list all possible values (e.g., "Возможные значения: новый, в работе, завершен")

QUALITY RULES:
- Keep it specific and unambiguous. Preserve the user's intent.
- Prefer domain-appropriate field names our report tool could use as columns.
- If the user provides none of the allowed filters, leave Filtering Criteria empty.`
                    },
                    {
                        role: 'user',
                        content: `IMPORTANT: You must ENHANCE and improve the following prompt. Do NOT just copy it - add data types, formats, constraints, and better descriptions.

Return Markdown with EXACTLY two sections (no extra text):
## Report Fields
## Filtering Criteria

Original prompt to enhance:
"""
${originalPrompt}
"""

ENHANCEMENT REQUIREMENTS:
- Add data types and formats to each field (dates, numbers, text constraints, possible values)
- Improve field descriptions with specific details
- Add any missing relevant fields that would be useful for analysis
- Specify exact formats and constraints
- Make descriptions more precise and actionable

Reflect ALL conditions as either fields or allowed filters (Status, Date Range, Limit).`
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            });
            const enhancedPrompt = completion.choices[0].message.content?.trim() || originalPrompt;
            // Generate AI suggestions for additional fields that fit the user's goal
            const aiSuggestions = await this.generateAISuggestions(originalPrompt, enhancedPrompt);
            return {
                enhancedPrompt,
                originalPrompt,
                suggestions: this.generateSuggestions(originalPrompt, enhancedPrompt),
                aiSuggestions
            };
        }
        catch (error) {
            console.error('Error enhancing prompt:', error);
            throw new Error(`Failed to enhance prompt: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async generateAISuggestions(originalPrompt, enhancedMarkdown) {
        try {
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You are assisting a task-report generator. Infer the user's analysis goal from the original prompt and propose ADDITIONAL per-row report fields that would help achieve that goal.

STRICT RULES:
- Respond in the SAME LANGUAGE as the original prompt. Do NOT switch to English if the prompt is not English.
- Only propose per-row fields (columns). Do NOT propose filters, sorting, grouping, or global metadata.
- Each suggestion must be useful for the likely analysis objective.
- Output MUST be a JSON array of objects with keys: "field" (short name) and "description" (1 concise sentence). The values of both keys MUST be in the SAME LANGUAGE as the original prompt. No extra text.

DATA TYPE REQUIREMENTS:
- Include data type, format, and possible values in descriptions when relevant:
  * Dates: specify format (e.g., "В формате ISO", "В формате DD.MM.YYYY")
  * Status/Boolean: specify possible values (e.g., "Может принимать значения: да - нет")
  * Numbers: specify units (e.g., "В днях", "В рублях")
  * Text: specify constraints (e.g., "До 255 символов", "Email формат")
  * Enums: list possible values (e.g., "Возможные значения: новый, в работе, завершен")`
                    },
                    {
                        role: 'user',
                        content: `Original prompt:\n"""\n${originalPrompt}\n"""\n\nEnhanced (for context):\n"""\n${enhancedMarkdown}\n"""\n\nReturn ONLY JSON array: [{"field":"...","description":"..."}]`
                    }
                ],
                temperature: 0.4,
                max_tokens: 600
            });
            const raw = completion.choices[0].message.content?.trim() ?? '[]';
            try {
                const parsed = JSON.parse(raw);
                if (Array.isArray(parsed)) {
                    return parsed
                        .filter(it => it && typeof it.field === 'string' && typeof it.description === 'string')
                        .slice(0, 12);
                }
            }
            catch {
                // fallthrough
            }
            return [];
        }
        catch (err) {
            console.warn('AI suggestions generation failed:', err);
            return [];
        }
    }
    // Public API to get suggestions on demand (used by UI when none were returned initially)
    async getAISuggestions(originalPrompt, enhancedMarkdown) {
        if (!this.openai) {
            this.initializeOpenAI();
        }
        return this.generateAISuggestions(originalPrompt, enhancedMarkdown);
    }
    async mergeWithSuggestions(enhancedMarkdown, suggestions, originalPrompt) {
        if (!this.openai) {
            this.initializeOpenAI();
        }
        try {
            const suggestionsList = suggestions.map(s => `- **${s.field}**: ${s.description}`).join('\n');
            const completion = await this.openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    {
                        role: 'system',
                        content: `You merge additional column suggestions into an existing two-section Markdown spec used by our report generator.

RULES:
- Keep the SAME LANGUAGE as the original prompt. If the prompt is not English, keep all field names and descriptions in that language.
- Keep EXACTLY TWO SECTIONS: "## Report Fields" and "## Filtering Criteria".
- Append the provided suggestions into the Report Fields section as new bullet items.
- Do NOT alter existing Filtering Criteria. Do NOT add new filters.
- Keep formatting consistent (bold field names, concise descriptions). Return ONLY the final Markdown.`
                    },
                    {
                        role: 'user',
                        content: `Original prompt (for language context):\n"""\n${originalPrompt}\n"""\n\nCurrent enhanced spec:\n"""\n${enhancedMarkdown}\n"""\n\nSuggestions to append under Report Fields:\n"""\n${suggestionsList}\n"""`
                    }
                ],
                temperature: 0.3,
                max_tokens: 1200
            });
            return completion.choices[0].message.content?.trim() || enhancedMarkdown;
        }
        catch (error) {
            console.error('Failed to merge suggestions:', error);
            return enhancedMarkdown;
        }
    }
    generateSuggestions(original, enhanced) {
        const suggestions = [];
        // Check if enhanced prompt is significantly longer
        if (enhanced.length > original.length * 1.5) {
            suggestions.push('Consider adding more specific field descriptions');
        }
        // Check for common improvements
        if (!enhanced.toLowerCase().includes('field') && !enhanced.toLowerCase().includes('column')) {
            suggestions.push('Consider specifying what data fields should be extracted');
        }
        if (!enhanced.toLowerCase().includes('report') && !enhanced.toLowerCase().includes('table')) {
            suggestions.push('Consider clarifying the expected output format');
        }
        if (enhanced.includes('•') || enhanced.includes('-')) {
            suggestions.push('The enhanced prompt includes structured formatting');
        }
        return suggestions;
    }
    // Utility method to check if a prompt could benefit from enhancement
    static shouldEnhance(prompt) {
        if (!prompt.trim())
            return false;
        // Check for vague or short prompts
        if (prompt.length < 20)
            return true;
        // Check for common vague terms
        const vagueTerms = ['stuff', 'things', 'data', 'information', 'details'];
        const hasVagueTerms = vagueTerms.some(term => prompt.toLowerCase().includes(term) && prompt.length < 100);
        // Check if prompt lacks specific field descriptions
        const lacksSpecificity = !prompt.toLowerCase().includes('field') &&
            !prompt.toLowerCase().includes('column') &&
            !prompt.toLowerCase().includes('include') &&
            prompt.length < 150;
        return hasVagueTerms || lacksSpecificity;
    }
}
exports.PromptEnhancerService = PromptEnhancerService;
// Export singleton instance
exports.promptEnhancerService = new PromptEnhancerService();
//# sourceMappingURL=promptEnhancerService.js.map