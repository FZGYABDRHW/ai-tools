// eslint-disable-next-line import/namespace
import {buildServiceInitializer, ServiceInitializer} from "./serviceInit";
import { CuratorListService } from './api-client/src/services/v2/curator/task/index';



import { defer, from, EMPTY, Observable } from 'rxjs';
import { concatMap, expand, map, startWith, endWith } from 'rxjs/operators';
// import type { ListQueryParams, Task } from './api-client/src/services/v2/curator/task/interfaces';
// import type { AxiosRequestConfig } from 'axios';

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
): Observable<Event> {

  const service = si(CuratorListService);

  const limit = 30;

  return defer(() =>
    from(service.getInWorkTasks({ limit, offset: 0 })),
  ).pipe(
    // Fetch subsequent pages until a final short page is returned.
    expand((tasks, idx) => {
      if (tasks.length < limit) {
        return EMPTY;
      }
      const nextOffset = (idx + 1) * limit;
      return from(service.getInWorkTasks({ limit, offset: nextOffset }));
    }),
    // Flatten each page into individual tasks.
    concatMap(tasks => from(tasks)),
    // Wrap each task as a content event.
    map(task => ({ type: 'content', taskId: task.id } as Event)),
    // Mark stream start and end.
    startWith({ type: 'start', task: null } as Event),
    endWith({ type: 'end', task: null } as Event),
  );
}

/**
 * Optional helper for codebases that rely on the service‑initializer
 * pattern.  It registers the ready‑to‑use iterator in the DI container.
 */

