// eslint-disable-next-line import/namespace
import {buildServiceInitializer, ServiceInitializer} from "./serviceInit";
import { CuratorListService } from './api-client/src/services/v2/curator/task/index';
import { TaskListParameters } from './services/parameterExtractionService';

import { defer, from, EMPTY, Observable } from 'rxjs';
import { concatMap, expand, map, startWith, endWith } from 'rxjs/operators';
import type { Task } from './api-client/src/services/v2/curator/task/interfaces';
// import type { ListQueryParams, AxiosRequestConfig } from 'axios';

/**
 * Streamed event describing the progress of the iteration through the
 * "in‑work" task list.
 */
export interface Event {
  type: 'start' | 'content' | 'end';
  taskId?: number;
}

export function taskIterator(
    si: ServiceInitializer,
    startOffset: number = 0,
    parameters?: TaskListParameters,
): Observable<Event> {

  const service = si(CuratorListService);

  // Default parameters
  const defaultLimit = 30;
  const limit = parameters?.limit || defaultLimit;
  
  // Determine which service method to use based on task status
  const taskStatus = parameters?.taskStatus || 'in-work';
  const serviceMethod = getServiceMethod(taskStatus);
  
  // Build query parameters
  const queryParams: any = { 
    limit, 
    offset: startOffset 
  };
  
  // Add time range parameters if provided
  if (parameters?.timeRangeFrom) {
    queryParams.timeRangeFrom = parameters.timeRangeFrom;
  }
  if (parameters?.timeRangeTo) {
    queryParams.timeRangeTo = parameters.timeRangeTo;
  }

  return defer(() =>
    from(service[serviceMethod](queryParams)),
  ).pipe(
    // Fetch subsequent pages until a final short page is returned.
    expand((tasks, idx) => {
      if (tasks.length < limit) {
        return EMPTY;
      }
      const nextOffset = (idx + 1) * limit;
      return from(service[serviceMethod]({ ...queryParams, offset: nextOffset }));
    }),
    // Flatten each page into individual tasks.
    concatMap((tasks: Task[]) => from(tasks)),
    // Wrap each task as a content event.
    map((task: Task) => ({ type: 'content', taskId: task.id } as Event)),
    // Mark stream start and end.
    startWith({ type: 'start', task: null } as Event),
    endWith({ type: 'end', task: null } as Event),
  );
}

/**
 * Helper function to get the appropriate service method based on task status
 */
function getServiceMethod(status: string): string {
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

/**
 * Optional helper for codebases that rely on the service‑initializer
 * pattern.  It registers the ready‑to‑use iterator in the DI container.
 */

