import { taskIterator, Event as TaskEvent } from './taskIterator';
import { ServiceInitializer } from './serviceInit';
import OpenAI from 'openai';
import { filter, mergeMap } from 'rxjs/operators';
import { TaskListParameters } from './services/parameterExtractionService';

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
  abortSignal?: AbortSignal,
  startOffset: number = 0,
  parameters?: TaskListParameters,
): Promise<{ 
  columns: string[]; 
  results: Array<Record<string, unknown>>; 
  csv: string;
  extractedParameters?: {
    parameters: TaskListParameters;
    humanReadable: string[];
  };
}> {

  const openai = new OpenAI({dangerouslyAllowBrowser: true, apiKey: "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"});

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
          content: `You are a parameter extraction specialist. From the user prompt, extract task list parameters and return ONLY a JSON object with the following structure:
{
  "limit": number (optional, maximum number of tasks to process, default 30),
  "taskStatus": string (optional, one of: "new", "done", "canceled", "in-work", "on-moderation", "awaiting-approve", "on-payment", "in-queue", default "in-work"),
  "timeRangeFrom": string (optional, ISO date string YYYY-MM-DD),
  "timeRangeTo": string (optional, ISO date string YYYY-MM-DD)
}

Rules:
- If user mentions "only first X tasks" or "limit to X tasks", set limit to X
- If user mentions task status keywords, map them appropriately:
  * "new", "fresh", "recent" → "new"
  * "completed", "done", "finished" → "done"
  * "canceled", "cancelled" → "canceled"
  * "in work", "in progress", "working" → "in-work"
  * "on moderation", "moderating" → "on-moderation"
  * "awaiting approval", "pending approval" → "awaiting-approve"
  * "on payment", "paid" → "on-payment"
  * "in queue", "queued", "waiting" → "in-queue"
- If user mentions time ranges, convert to ISO dates:
  * "last X days" → timeRangeFrom = X days ago, timeRangeTo = today
  * "this week" → timeRangeFrom = start of week, timeRangeTo = today
  * "this month" → timeRangeFrom = start of month, timeRangeTo = today
  * "yesterday" → timeRangeFrom = yesterday, timeRangeTo = yesterday
  * "today" → timeRangeFrom = today, timeRangeTo = today

Return only the JSON object, no additional text.` 
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

  // 1) Derive the tabular schema (column names) from the raw prompt
  // Check for abort signal before making the initial OpenAI call
  if (abortSignal?.aborted) {
    throw new Error('Aborted');
  }
  
  const schemaCompletion = await openai.chat.completions.create({
    model: 'o3',
    messages: [
      { role: 'system', content: 'You are an analyst. From the user prompt, output ONLY a JSON array of column names for an agile task report. Return only a JSON string.' },
      { role: 'user', content: rawPrompt },
    ],
  });
  console.log(schemaCompletion.choices[0].message.content);
  let columns: string[];
  try {
    columns = JSON.parse(schemaCompletion.choices[0].message.content ?? '[]');
    if (!Array.isArray(columns) || !columns.every((c) => typeof c === 'string')) {
      throw new Error('Schema is not an array of strings');
    }
  } catch (err) {
    throw new Error(`Could not parse column list from OpenAI: ${err instanceof Error ? err.message : String(err)}`);
  }

  // Ensure taskId is always part of the schema
  if (!columns.includes('taskId')) {
    columns.unshift('taskId');
  }

  // 2) Prepare storage and a helper to build per‑task prompts enforcing the schema
  const results: Record<string, unknown>[] = [];

  const makeTaskPrompt = (taskText: string) =>
    `Request from user for the context: ${rawPrompt}, Return a JSON object with EXACTLY these keys: ${columns.join(', ')}. ` +
    `Fill them with data inferred from the following task description, nothing more, nothing less.\n\n` +
    `Task description:\n${taskText}`;

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
              { role: 'system', content: 'You are a helpful assistant producing structured task rows.' },
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

  // Automatically download the CSV in renderer contexts
  downloadCsv(csvContent);
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