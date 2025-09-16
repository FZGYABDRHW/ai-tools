import { taskIterator, Event as TaskEvent } from './taskIterator';
import { ServiceInitializer } from './serviceInit';
import OpenAI from 'openai';
import { filter, mergeMap } from 'rxjs/operators';
import { TaskListParameters } from './services/parameterExtractionService';
import { settingsService } from './services/settingsService';

// Helper to trigger a file download in a browser/Electron renderer
function downloadCsv(csvContent: string, filename = 'report.csv') {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    // Not in a browser/renderer context – skip automatic download.
    return;
  }
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Builds an in‑memory report for all current "in‑work" tasks.
 *
 * The function iterates over the task stream produced by {@link taskIterator},
 * calls OpenAI once for every task ID, and stores the resulting completion
 * text in an **array**. The array is returned when the stream finishes.
 *
 * @param si          The common service‑initializer factory used throughout the codebase.
 * @param buildPrompt Optional helper that turns a task ID into the prompt sent to OpenAI.
 *                    This makes the function easier to test/mock.
 * @returns `{ columns, results, csv }`, where `csv` is the raw CSV text so the caller can decide how to save it (e.g. via Blob in an Electron renderer).
 */
export async function buildReport(
  rawPrompt: string,
  si: ServiceInitializer,
  taskPlotGenerator: (taskId: number) => Promise<string>,
  onProgress?: (update: { columns: string[]; results: Array<Record<string, unknown>>; csv: string }) => void,
  onParametersExtracted?: (parameters: { parameters: TaskListParameters; humanReadable: string[] }) => void,
  abortSignal?: AbortSignal,
  startOffset: number = 0,
  parameters?: TaskListParameters,
  existingColumns?: string[],
): Promise<{
  columns: string[];
  results: Array<Record<string, unknown>>;
  csv: string;
  extractedParameters?: {
    parameters: TaskListParameters;
    humanReadable: string[];
  };
}> {

  // Get OpenAI API key from settings
  const apiKey = settingsService.getOpenAIKey();
  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please go to Settings and configure your API key.');
  }

  const openai = new OpenAI({dangerouslyAllowBrowser: true, apiKey });

  // 0) Extract parameters from the prompt using OpenAI if not provided
  let extractedParameters = parameters;
  if (!extractedParameters) {
    // Check for abort signal before making the parameter extraction call
    if (abortSignal?.aborted) {
      throw new Error('Aborted');
    }

    const parameterCompletion = await openai.chat.completions.create({
      model: 'o3',
      messages: [
        {
          role: 'system',
          content: `You are an expert parameter extraction specialist for agile project management systems. Your task is to analyze user requests and extract precise filtering parameters for task reports.

CONTEXT: You're working with a task management system that tracks work items through various stages. Users request reports with specific filters.

CURRENT DATE: ${new Date().toISOString().split('T')[0]} (YYYY-MM-DD format)

EXTRACT these parameters and return ONLY a valid JSON object:
{
  "limit": number (optional, max tasks to process, default: undefined),
  "taskStatus": string (optional, one of: "new", "done", "canceled", "in-work", "on-moderation", "awaiting-approve", "on-payment", "in-queue", default: "in-work"),
  "timeRangeFrom": string (optional, ISO date YYYY-MM-DD),
  "timeRangeTo": string (optional, ISO date YYYY-MM-DD)
}

EXTRACTION RULES:

1. LIMIT DETECTION:
   - "first X", "only X", "limit to X", "top X", "maximum X" → set limit to X
   - Numbers 1-1000 are valid limits

2. STATUS MAPPING (case-insensitive):
   - "new", "fresh", "recent", "новое", "новые" → "new"
   - "completed", "done", "finished", "завершенные", "выполненные" → "done"
   - "canceled", "cancelled", "отмененные" → "canceled"
   - "in work", "in progress", "working", "в работе", "выполняются" → "in-work"
   - "on moderation", "moderating", "на модерации" → "on-moderation"
   - "awaiting approval", "pending approval", "ожидают одобрения" → "awaiting-approve"
   - "on payment", "paid", "на оплате" → "on-payment"
   - "in queue", "queued", "waiting", "в очереди" → "in-queue"

3. TIME RANGE CALCULATION (based on current date):
   - "last X days/weeks/months" → from: (current - X units), to: current
   - "this week" → from: start of current week, to: current
   - "this month" → from: start of current month, to: current
   - "yesterday" → from: current-1 day, to: current-1 day
   - "today" → from: current, to: current
   - "last week/month" → from: start of previous period, to: end of previous period

EXAMPLES:
- "Show me new tasks from last week" → {"taskStatus": "new", "timeRangeFrom": "2024-01-15", "timeRangeTo": "2024-01-21"}
- "First 50 completed tasks" → {"limit": 50, "taskStatus": "done"}
- "Tasks in progress this month" → {"taskStatus": "in-work", "timeRangeFrom": "2024-01-01", "timeRangeTo": "2024-01-22"}

CRITICAL: Return ONLY the JSON object, no explanations or additional text.`
        },
        { role: 'user', content: rawPrompt },
      ],
    });

    console.log('Parameter extraction result:', parameterCompletion.choices[0].message.content);

    try {
      const extracted = JSON.parse(parameterCompletion.choices[0].message.content ?? '{}');
      extractedParameters = {
        limit: extracted.limit,
        taskStatus: extracted.taskStatus,
        timeRangeFrom: extracted.timeRangeFrom,
        timeRangeTo: extracted.timeRangeTo
      };
      console.log('Extracted parameters:', extractedParameters);
    } catch (err) {
      console.warn('Could not parse parameters from OpenAI, using defaults:', err);
      extractedParameters = {};
    }
  }

  // Convert extracted parameters to human-readable format for immediate display
  const humanReadableParams: string[] = [];
  if (extractedParameters) {
    if (extractedParameters.limit) {
      humanReadableParams.push(`Limit: ${extractedParameters.limit} tasks`);
    }
    if (extractedParameters.taskStatus) {
      const statusDisplayNames: Record<string, string> = {
        'new': 'New Tasks',
        'done': 'Completed Tasks',
        'canceled': 'Canceled Tasks',
        'in-work': 'Tasks In Work',
        'on-moderation': 'Tasks On Moderation',
        'awaiting-approve': 'Tasks Awaiting Approval',
        'on-payment': 'Tasks On Payment',
        'in-queue': 'Tasks In Queue'
      };
      humanReadableParams.push(`Status: ${statusDisplayNames[extractedParameters.taskStatus] || extractedParameters.taskStatus}`);
    }
    if (extractedParameters.timeRangeFrom && extractedParameters.timeRangeTo) {
      const fromDate = new Date(extractedParameters.timeRangeFrom);
      const toDate = new Date(extractedParameters.timeRangeTo);
      const fromStr = fromDate.toLocaleDateString();
      const toStr = toDate.toLocaleDateString();
      if (fromStr === toStr) {
        humanReadableParams.push(`Date: ${fromStr}`);
      } else {
        humanReadableParams.push(`Date Range: ${fromStr} to ${toStr}`);
      }
    }
  }

  // Store parameters in generation state immediately for UI display
  const extractedParamsForUI = extractedParameters ? {
    parameters: extractedParameters,
    humanReadable: humanReadableParams
  } : undefined;

  // Call the callback immediately when parameters are extracted
  if (extractedParamsForUI && onParametersExtracted) {
    onParametersExtracted(extractedParamsForUI);
  }

  // 1) Derive the tabular schema (column names) from the raw prompt, or reuse existing ones
  let columns: string[];
  if (existingColumns && Array.isArray(existingColumns) && existingColumns.length > 0) {
    columns = existingColumns;
  } else {
    // Check for abort signal before making the initial OpenAI call
    if (abortSignal?.aborted) {
      throw new Error('Aborted');
    }

    const schemaCompletion = await openai.chat.completions.create({
      model: 'o3',
      messages: [
        { role: 'system', content: `You are an expert business analyst specializing in agile project management reporting. Your task is to design optimal column schemas for task reports.

CONTEXT: You're creating a structured report schema based on user requirements for agile task analysis.

TASK: Analyze the user's request and determine the most relevant column names for a comprehensive task report.

REQUIREMENTS:
- Return ONLY a JSON array of column names (strings)
- Use clear, descriptive column names in English
- Include standard agile metrics when relevant
- Consider both technical and business perspectives
- Maximum 15 columns to keep reports manageable

STANDARD COLUMNS (include when relevant):
- "Task ID" - unique identifier
- "Title" - task name/summary
- "Description" - detailed task description
- "Status" - current task status
- "Priority" - task priority level
- "Assignee" - person responsible
- "Sprint" - sprint/iteration
- "Story Points" - effort estimation
- "Created Date" - when task was created
- "Due Date" - deadline
- "Completed Date" - when finished
- "Tags" - categorization labels
- "Epic" - larger feature grouping
- "Component" - technical component
- "Labels" - additional categorization

EXAMPLES:
- "Show task completion rates" → ["Task ID", "Title", "Status", "Completed Date", "Story Points", "Sprint"]
- "Analyze developer workload" → ["Task ID", "Title", "Assignee", "Status", "Story Points", "Priority", "Sprint"]
- "Track bug resolution" → ["Task ID", "Title", "Status", "Priority", "Assignee", "Created Date", "Completed Date", "Component"]

CRITICAL: Return ONLY the JSON array, no explanations.` },
        { role: 'user', content: rawPrompt },
      ],
    });
    console.log(schemaCompletion.choices[0].message.content);
    try {
      columns = JSON.parse(schemaCompletion.choices[0].message.content ?? '[]');
      if (!Array.isArray(columns) || !columns.every((c) => typeof c === 'string')) {
        throw new Error('Schema is not an array of strings');
      }
    } catch (err) {
      throw new Error(`Could not parse column list from OpenAI: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Ensure taskId is always part of the schema
  if (!columns.includes('taskId')) {
    columns.unshift('taskId');
  }

  // 2) Prepare storage and a helper to build per‑task prompts enforcing the schema
  const results: Record<string, unknown>[] = [];

  const makeTaskPrompt = (taskText: string) =>
    `You are a data extraction specialist for agile project management. Extract structured information from task descriptions to populate a report.

REPORT CONTEXT: ${rawPrompt}

REQUIRED COLUMNS: ${columns.join(', ')}

TASK DESCRIPTION:
${taskText}

INSTRUCTIONS:
1. Analyze the task description carefully
2. Extract relevant information for each required column
3. Use "N/A" for missing information (don't make up data)
4. For dates, use ISO format (YYYY-MM-DD) when possible
5. For numbers, use actual values or 0 if not specified
6. For text fields, use exact wording from the task when available
7. Ensure all column names match exactly (case-sensitive)

OUTPUT FORMAT: Return ONLY a JSON object with the exact column names as keys. No explanations or additional text.

EXAMPLE OUTPUT:
{"Task ID": "12345", "Title": "Fix login bug", "Status": "in-work", "Priority": "high", "Assignee": "John Doe", "Story Points": 3}`;

  // Helper function to update progress
  const updateProgress = () => {
    if (onProgress) {
      const escapeCsv = (v: unknown) =>
        `"${String(v ?? '').replace(/"/g, '""')}"`;
      const header = columns.join(',');
      const body = results
        .map((row) => columns.map((c) => escapeCsv((row as Record<string, unknown>)[c])).join(','))
        .join('\n');
      const csvContent = `${header}\n${body}`;

      onProgress({ columns, results: [...results], csv: csvContent });
    }
  };

  // Emit an initial progress update with just the header so columns are persisted early
  // Only emit if there are no existing rows to avoid overwriting persisted UI state with empty results
  if (results.length === 0) {
    updateProgress();
  }

  // Wrap the RxJS pipeline in an explicit promise so we can await completion.
  await new Promise<void>((resolve, reject) => {
    let abortHandler: (() => void) | null = null;

    const subscription = taskIterator(si, startOffset, extractedParameters).pipe(
      // We only care about concrete "content" events (those carry the task ID).
      filter((ev): ev is TaskEvent & { taskId: number } => ev.type === 'content'),
      // Add abort check to the stream
      filter(() => !abortSignal?.aborted),
      // Call OpenAI for each task, one at a time to stay within rate limits.
      // Increase the concurrency argument (2nd param) if higher throughput is needed.
      mergeMap(
        async (ev) => {
          // Check for abort signal before processing each task
          if (abortSignal?.aborted) {
            console.log('Abort detected before task processing');
            throw new Error('Aborted');
          }

          const task = await taskPlotGenerator(ev.taskId);

          // Check for abort signal before making OpenAI call
          if (abortSignal?.aborted) {
            console.log('Abort detected before OpenAI call');
            throw new Error('Aborted');
          }

          // Create a promise that can be cancelled
          const completionPromise = openai.chat.completions.create({
            model: 'o3', // replace with any model your account supports
            messages: [
              { role: 'system', content: `You are an expert data analyst specializing in agile project management. Your task is to extract structured information from task descriptions and format it according to specific report requirements.

EXPERTISE: You understand agile methodologies, project management terminology, and can accurately interpret task descriptions to extract relevant metrics and metadata.

QUALITY STANDARDS:
- Extract only factual information from the provided task description
- Use consistent formatting for similar data types
- Apply domain knowledge to infer reasonable values when context is clear
- Maintain data integrity and avoid hallucination
- Follow the exact column schema provided

OUTPUT REQUIREMENTS:
- Return ONLY valid JSON
- Use exact column names as provided
- Include all required columns
- Use appropriate data types (strings, numbers, dates)
- No explanations or additional text` },
              { role: 'user', content: makeTaskPrompt(task) },
            ],
          });

          // Check for abort during the OpenAI call
          const completion = await Promise.race([
            completionPromise,
            new Promise<never>((_, reject) => {
              // Check if already aborted
              if (abortSignal?.aborted) {
                reject(new Error('Aborted'));
                return;
              }

              // Set up abort listener
              const abortListener = () => {
                reject(new Error('Aborted'));
              };

              abortSignal?.addEventListener('abort', abortListener, { once: true });

              // Clean up listener if promise resolves normally
              completionPromise.finally(() => {
                abortSignal?.removeEventListener('abort', abortListener);
              });
            })
          ]);
          console.log(completion.choices[0].message.content);
          // Persist the answer in memory.
          try {
            const row = JSON.parse(completion.choices[0].message.content ?? '{}') as Record<string, unknown>;
            results.push({ ...row, taskId: ev.taskId });
          } catch {
            // Fallback: keep raw content if JSON parsing fails
            results.push({ taskId: ev.taskId, raw: completion.choices[0].message.content });
          }
          // Update progress after each result
          updateProgress();
        },
        30, // concurrency
      ),
    ).subscribe({
      complete: () => {
        if (abortHandler) {
          abortSignal?.removeEventListener('abort', abortHandler);
        }
        resolve();
      },
      error: (error) => {
        console.log('RxJS stream error:', error);
        if (abortHandler) {
          abortSignal?.removeEventListener('abort', abortHandler);
        }
        reject(error);
      },
    });

    // Listen for abort signal and unsubscribe if aborted
    if (abortSignal) {
      abortHandler = () => {
        console.log('Abort signal received, unsubscribing from RxJS stream');
        subscription.unsubscribe();
        reject(new Error('Aborted'));
      };

      abortSignal.addEventListener('abort', abortHandler);

      // Also check if already aborted
      if (abortSignal.aborted) {
        console.log('Abort signal already aborted, rejecting immediately');
        subscription.unsubscribe();
        reject(new Error('Aborted'));
        return;
      }
    }
  });

  // 3) Build CSV from the collected rows
  const escapeCsv = (v: unknown) =>
    `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = columns.join(',');
  const body = results
    .map((row) => columns.map((c) => escapeCsv((row as Record<string, unknown>)[c])).join(','))
    .join('\n');

  const csvContent = `${header}\n${body}`;

  // Convert extracted parameters to human-readable format
  const humanReadable: string[] = [];
  if (extractedParameters) {
    if (extractedParameters.limit) {
      humanReadable.push(`Limit: ${extractedParameters.limit} tasks`);
    }
    if (extractedParameters.taskStatus) {
      const statusDisplayNames: Record<string, string> = {
        'new': 'New Tasks',
        'done': 'Completed Tasks',
        'canceled': 'Canceled Tasks',
        'in-work': 'Tasks In Work',
        'on-moderation': 'Tasks On Moderation',
        'awaiting-approve': 'Tasks Awaiting Approval',
        'on-payment': 'Tasks On Payment',
        'in-queue': 'Tasks In Queue'
      };
      humanReadable.push(`Status: ${statusDisplayNames[extractedParameters.taskStatus] || extractedParameters.taskStatus}`);
    }
    if (extractedParameters.timeRangeFrom && extractedParameters.timeRangeTo) {
      const fromDate = new Date(extractedParameters.timeRangeFrom);
      const toDate = new Date(extractedParameters.timeRangeTo);
      const fromStr = fromDate.toLocaleDateString();
      const toStr = toDate.toLocaleDateString();
      if (fromStr === toStr) {
        humanReadable.push(`Date: ${fromStr}`);
      } else {
        humanReadable.push(`Date Range: ${fromStr} to ${toStr}`);
      }
    }
  }

  // Return the results without automatic download
  return {
    columns,
    results,
    csv: csvContent,
    extractedParameters: extractedParameters ? {
      parameters: extractedParameters,
      humanReadable
    } : undefined
  };
}
